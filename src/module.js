import { Controller } from './controller';
import { loadPluginCss } from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/echarts-graph-panel/css/grouped.dark.css',
  light: 'plugins/echarts-graph-panel/css/grouped.light.css',
});

export {
  Controller as PanelCtrl
};
