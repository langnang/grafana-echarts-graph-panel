import {
  MetricsPanelCtrl
} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import echarts from './libs/echarts.min';
import './libs/dark';
import './style.css!';

import {
  DataProcessor
} from './data_processor';
import DataFormatter from './data_formatter';

import {
  randomColor,
  xAxis,
  zeroToNull,
  markLine,
  to_date,
  to_utt_date,
  time_interval,
  date_diff_compare
} from './utils';


export class Controller extends MetricsPanelCtrl {

  constructor($scope, $injector) {
    super($scope, $injector);

    let axis = {
      xAxis: {},
      yAxis: {},
    };
    let option = {
      legend: {},
      grid: {},
      color: [],
      tooltip: {
      },
      toolbox: {},
      animation: {},
      markLine: {},
    };
    let series = [];

    var panelDefaults = {
      IS_UCD: false,
      METHODS: ['POST', 'GET'],
      ETYPE: ['line', 'pie', 'map'],
      url: '',
      debug: {
        print: false,
      },
      method: 'POST',
      upInterval: 60000,
      format: 'Year',
      markLine: {
        show: false,
        type: "average",
        precision: 2,
        formatter: `{c}`
      },
    };


    panelDefaults.setOption = {
      legend: {
        show: false,
        type: 'plain',
        left: 'auto',
        top: 'bottom',
        align: 'auto',
        orient: 'horizontal',
        icon: 'roundRect',
        data: []
      },
      grid: {
        left: '10%',
        top: '60',
        right: '10%',
        bottom: '60',
        containLabel: false
      },
      xAxis: [{
        type: 'category',
        data: [],
        boundaryGap: false,
        splitLine: {
          show: false,
          lineStyle: {
            type: 'solid',
            opacity: '0.3'
          }
        },

      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: `{value}`
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'solid',
            opacity: '0.3'
          },
        }
      }],
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      toolbox: {
        show: false,
        orient: 'horizontal',
        feature: {
          magicType: {
            type: ['line', 'bar', 'stack', 'tiled']
          },
          restore: {},
        },
        left: 'auto',
        top: 'auto'
      },
      series: [],
      color: ['#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0', '#508642', '#CCA300', '#447EBC'],
      animation: false,
      visualMap: {
        show: false,
        min: 0,
        max: 300,
        inRange: {
          color: ['red', 'yellow', 'green']
        }
      }

    };

    panelDefaults.spareOption = {
      series: {
        type: [],
        smooth: [],
        stack: [],
        step: [],
        symbolSize: [],
        itemStyle: {
          normal: {
            lineStyle: {
              width: []
            },
            areaStyle: {
              opacity: []
            }
          }
        }
      }
    };

    _.defaults(this.panel, panelDefaults);


    this.dataFormatter = new DataFormatter(this, kbn);
    this.processor = new DataProcessor(this.panel);


    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('panel-initialized', this.render.bind(this));

    this.refreshData();
  }


  onDataReceived(dataList) {
    this.seriesList = {
      dataList: dataList,
      xAxisOp: [],
      seriesOp: []
    };
    delete this.panel.setOption.visualMap;
    delete this.panel.setOption.xAxis[0].axisLabel;
    delete this.panel.setOption.tooltip.formatter;

    if (xAxis(this.panel.format, dataList)) {
      this.seriesList.xAxisOp = xAxis(this.panel.format, dataList);
    } else if (this.panel.format === 'Series') {
      let seriesxAxis = [];
      // let seriesData = [];
      dataList.forEach(v => {
        seriesxAxis.push(v.target);
        // seriesData.push(v.datapoints[0][0]);
      });
      this.seriesList.xAxisOp = seriesxAxis;

      this.panel.setOption.visualMap = {
        show: false,
        inRange: {
          color: this.panel.setOption.color
        }
      };
      this.panel.setOption.tooltip.formatter = "{b}:{c}";
      this.panel.setOption.xAxis[0].axisLabel = {
        formatter: function (value) {
          return value.split("").join("\n");
        }
      };
    } else if (this.panel.format === 'Custom-FullMonth') {
      for (var s in dataList) {
        var year = new Date(dataList[s].datapoints[0][1]).getFullYear();
        var mon = new Date(dataList[s].datapoints[0][1]).getMonth();
        if (mon !== 0) {
          for (var n = mon - 1; n >= 0; n--) {
            dataList[s].datapoints.unshift([0, new Date(year + '/' + (n + 1) + '/1').getTime()]);
          }
        } else {

        }
        if (dataList[s].datapoints.length < 12) {
          var len = dataList[s].datapoints.length;
          for (var n2 = len; n2 < 12; n2++) {
            dataList[s].datapoints.push([0, new Date(year + '/' + (n2 + 1) + '/1').getTime()]);
          }
        }
      }

      for (var t in dataList[0].datapoints) {
        this.seriesList.xAxisOp.push(new Date(dataList[0].datapoints[t][1]).getFullYear() + "-" + (new Date(dataList[0].datapoints[t][1]).getMonth() + 1));
      }

    } else {
      /**
       * 1. 取出所有数据中的时间(timestamp)，组合为一个新的数组
       * 2. 取出其中最大，最小值，并根据区段(100)组合成连续/不间断的时间，并格式化，存入x坐标数组中
       * 3. x坐标数组，去重，排序
       * 4. 遍历原始数据，根据坐标数组，补充间断的时间，并赋值为null
       */
      let _x = []; // 原始数据时间
      let _xT = [];
      let _xN = [];
      for (var row in dataList) {
        for (var col in dataList[row].datapoints) {
          _xN.push(dataList[row].datapoints[col][1]);
        }
      }
      let _xMax = Math.max(..._xN);
      let _xMin = Math.min(..._xN);
      while (_xMin <= _xMax) {
        _xT.push(_xMin);
        _x.push(to_date(new Date(_xMin), this.panel.format));
        _xMin += time_interval(this.panel.format, _xMin);
      }
      _x = new Set(_x);
      _x = Array.from(_x);
      // console.log(_x);
      // _x = _x.sort();
      this.seriesList.xAxisOp = _x;
      for (let row in dataList) {
        for (let col in dataList[row].datapoints) {
          date_diff_compare(_xT, dataList[row].datapoints);
        }
      }

    }

    for (var i in dataList) {

      if (this.panel.format === 'Series') {
        i = 0;
      }

      if (this.panel.spareOption.series.type[i] == undefined) {
        this.panel.spareOption.series.type[i] = "line";
      }

      if (this.panel.spareOption.series.smooth[i] == undefined) {
        this.panel.spareOption.series.smooth[i] = false;
      }

      if (this.panel.spareOption.series.stack[i] == undefined) {
        this.panel.spareOption.series.stack[i] = false;
      }

      if (this.panel.spareOption.series.step[i] == undefined) {
        this.panel.spareOption.series.step[i] = false;
      }

      if (this.panel.spareOption.series.symbolSize[i] == undefined) {
        this.panel.spareOption.series.symbolSize[i] = 4;
      }

      if (this.panel.spareOption.series.itemStyle.normal.lineStyle.width[i] == undefined) {
        this.panel.spareOption.series.itemStyle.normal.lineStyle.width[i] = 1;
      }

      if (this.panel.spareOption.series.itemStyle.normal.areaStyle.opacity[i] == undefined) {
        this.panel.spareOption.series.itemStyle.normal.areaStyle.opacity[i] = 0;
      }


      var tempData = {
        name: dataList[i].target,
        type: this.panel.spareOption.series.type[i],
        smooth: this.panel.spareOption.series.smooth[i],
        stack: this.panel.spareOption.series.stack[i],
        step: this.panel.spareOption.series.step[i],
        symbolSize: this.panel.spareOption.series.symbolSize[i],
        itemStyle: {
          normal: {
            lineStyle: {
              width: this.panel.spareOption.series.itemStyle.normal.lineStyle.width[i]
            },
            areaStyle: {
              opacity: this.panel.spareOption.series.itemStyle.normal.areaStyle.opacity[i]
            }
          }
        },
        data: []
      };
      if (this.panel.format === 'Series') {
        this.seriesList.seriesOp[0] = tempData;
        // this.seriesList.seriesOp[0].itemStyle.normal.color = function (d) {
        //   return "#" + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16);
        // };

        // this.seriesList.seriesOp[0].xAxis.axisLabel = {
        //   formatter: function (value) {
        //     return value.split("").join("\n");
        //   }
        // };
        for (var k in dataList) {
          this.seriesList.seriesOp[0].data.push(dataList[k].datapoints[0][0]);
        }
        this.panel.setOption.visualMap.max = Math.max(...this.seriesList.seriesOp[0].data);

      } else {
        this.seriesList.seriesOp.push(tempData);

        for (var j in dataList[i].datapoints) {
          this.seriesList.seriesOp[i].data.push(dataList[i].datapoints[j][0]);
        }
      }

      this.seriesList.seriesOp[i].data = zeroToNull(...this.seriesList.seriesOp[i].data);

      if (this.panel.setOption.color[i] === undefined) {
        this.panel.setOption.color[i] = randomColor();
      }
    }


    if (this.panel.markLine.show && this.seriesList.seriesOp.length > 0) {
      this.seriesList.seriesOp = markLine(this.seriesList.seriesOp, this.panel.markLine);
    }


    this.refreshed = true;
    this.render();
    this.refreshed = false;
  }
  onDataError(err) {
    this.series = [];
    this.render();
  }
  onInitEditMode() {
    this.addEditorTab('Axis', 'public/plugins/echarts-graph-panel/partials/axis.html', 2);
    this.addEditorTab('Option', 'public/plugins/echarts-graph-panel/partials/options.html', 3);
  }

  refreshData() {
    let _this = this,
      xmlhttp;

    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    let data = [];
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        _this.customizeData = JSON.parse(xmlhttp.responseText);
        _this.onDataReceived();
      }
    };

    if (this.panel.IS_UCD) {
      xmlhttp.open(_this.panel.method, _this.panel.url, true);
      xmlhttp.send();
    } else {
      xmlhttp = null;
    }

    this.$timeout(() => {
      this.refreshData();
    }, _this.panel.upInterval);
  }

  link(scope, elem, attrs, ctrl) {
    const $panelContainer = elem.find('.echarts_container')[0];


    ctrl.refreshed = true;

    function setHeight() {
      let height = ctrl.height || ctrl.panel.height;
      if (_.isString(height)) {
        height = parseInt(height.replace('px', ''), 10);
      }

      height += 0;

      $panelContainer.style.height = height + 'px';
    }

    setHeight();

    let myChart = echarts.init($panelContainer, 'dark');

    setTimeout(function () {
      myChart.resize();
    }, 1000);

    function render() {

      if (!myChart) {
        return;
      }

      setHeight();
      myChart.resize();

      if (ctrl.refreshed) {
        myChart.clear();


        if (ctrl.seriesList !== undefined) {
          ctrl.panel.setOption.xAxis[0].data = ctrl.seriesList.xAxisOp;
          ctrl.panel.setOption.series = ctrl.seriesList.seriesOp;
        } else {
          ctrl.panel.setOption.xAxis[0].data = [];
          ctrl.panel.setOption.series = [];
        }

        ctrl.panel.setOption.legend.data = [];
        for (var i in ctrl.panel.setOption.series) {
          ctrl.panel.setOption.legend.data.push(ctrl.panel.setOption.series[i].name);
        }
        // console.log(ctrl.panel);
        // console.log(JSON.stringify(ctrl.panel.setOption));

        myChart.setOption(ctrl.panel.setOption);
      }
    }

    this.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });
  }
}

Controller.templateUrl = 'partials/module.html';