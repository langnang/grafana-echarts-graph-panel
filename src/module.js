import {Controller} from './controller';
import { loadPluginCss } from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/advantech-ushop-cross-time-graph/css/grouped.dark.css',
  light: 'plugins/advantech-ushop-cross-time-graph/css/grouped.light.css',
});

export {
  Controller as PanelCtrl
};
