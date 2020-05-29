# Ushop Cross Time Graph Panel Plugin for Advantech

## 1.0.8

### Debug

- [x] YYYY,MM,WW 时间调整

## 1.0.7

### Debug

- [x] 无数据时标识线错误
- [x] 标识线平均值精度调整
- [x] 标识线数据值格式化调整

### New Feature

- [x] 默认颜色与`Grafana`同步
- [x] y 轴显示格式化调整

## 1.0.6

### New Feature

- [x] 年-月-日模式格式化时间
- [x] 自动补充间隔时间

## 1.0.5

### New Feature

## 1.0.4

### New Feature

- [x] 折线图中隐藏值为 0 的区域
  - 当值为 null 时不会显示(隐藏)
- [x] 柱状图中添加平均辅助线
  - series.markLine.data[0].type="average"

## 1.0.3

### New Feature

- 客制化 year:Custom-FullMonth

## 1.0.2

### New Feature

- 客制化 year:Custom-Month

## 1.0.1

### New Feature

- 客制化 year：Custom-Year

## 1.0.0

### New Feature

- legend 图例组件显示/隐藏，类型，定位,朝向,标记类型
- grid 直角坐标系内绘图网格定位，间距
- xAxis 底部 x 轴类目数据，留白，分割线
- yAxis 左侧 y 轴分割线
- color 颜色列表，根据 series 数量变化
- tooltip 提示框组件显示/隐藏，触发类型，指示器类型
- toolbox 工具栏显示/隐藏，朝向，工具配置，定位
- animation 动画
- series 系列列表,类型，堆叠，平滑曲线,阶梯线图,
  - line 线宽，填充透明度
