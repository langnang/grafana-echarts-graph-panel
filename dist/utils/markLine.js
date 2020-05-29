'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var markLine;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    return {
        setters: [],
        execute: function () {
            _export('markLine', markLine = function markLine(list, opts) {
                var markLine = {
                    silent: true,
                    symbol: ['none', 'none'],
                    precision: opts.precision,
                    lineStyle: {
                        normal: {
                            type: "solid"
                        }
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: opts.formatter
                            }
                        }
                    },
                    data: []
                    // console.log(type, list);
                };if (list.length === 1) {
                    markLine.data.push({
                        type: opts.type
                    });
                } else {
                    var avgArray = [];
                    list.forEach(function (v) {
                        avgArray = [].concat(_toConsumableArray(avgArray), _toConsumableArray(v.data));
                    });
                    // console.log(avgArray);
                    var avg = avgArray.reduce(function (acc, val) {
                        return acc + val;
                    }, 0) / (avgArray.length || 1);
                    // console.log(avg);

                    markLine.data.push({
                        yAxis: avg
                    });
                }

                list[0].markLine = markLine;
                return list;
            });

            _export('markLine', markLine);
        }
    };
});
//# sourceMappingURL=markLine.js.map
