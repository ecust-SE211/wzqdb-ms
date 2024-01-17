'use strict'

import {
	app,
	protocol,
	Menu,
	BrowserWindow
} from 'electron'
import {
	createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {
	VUEJS3_DEVTOOLS
} from 'electron-devtools-installer'
const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
	scheme: 'app',
	privileges: {
		secure: true,
		standard: true
	}
}])
global.win = null;
async function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 400, // 设置最小宽度
		minHeight: 300, // 设置最小高度
		icon: path.join(__dirname, 'build', 'icon.ico'),
		// autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
			webSecurity: false // 允许跨域访问
		},
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
		// 不自动打开控制台
		if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app')
		win.loadURL('app://./index.html')
	}
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		try {
			// 不在这里安装vueDevTools
			// await installExtension(VUEJS3_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	const template = [{
		label: "DevelopTool",
		click: () => {
			win.webContents.openDevTools()
		}
	}]
	// const menu = Menu.buildFromTemplate(template);
	// Menu.setApplicationMenu(menu);
	createWindow()
})

if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}