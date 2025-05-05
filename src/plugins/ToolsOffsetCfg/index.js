'use strict'

//import { registerSettingTab } from '../../routes'

import { registerRoute } from '../../routes'

import ToolsOffsetCfg from './ToolsOffsetCfg.vue'

//registerSettingTab(false, 'ToolsOffset', ToolsOffsetCfg, 'ToolsOffset');
// Register a route via Settings -> Object Model
registerRoute(ToolsOffsetCfg, {
	Settings: {
		ToolsOffset: {
			icon: 'mdi-file-tree',
			caption: 'plugins.ToolsOffsetCfg.menuCaption',
			path: '/ToolsOffsetCfg'
		}
	}
});