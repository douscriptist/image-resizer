const {
	app,
	BrowserWindow,
	Menu,
	globalShortcut,
	ipcMain,
} = require('electron');

// Set node env
process.env.NODE_ENV = 'development';

const isDevMode = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'Image Resizer',
		width: isDevMode ? 750 : 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDevMode,
		backgroundColor: '#252b4d',
		webPreferences: {
			nodeIntegration: true,
		},
	});

	isDevMode && mainWindow.webContents.openDevTools();

	// mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	mainWindow.loadFile(`${__dirname}/app/index.html`);
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: 'About Image Resizer',
		width: 300,
		height: 200,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: false,
		backgroundColor: '#e6aa07',
		autoHideMenuBar: true,
		// frame: false,
	});

	aboutWindow.loadFile(`${__dirname}/app/about.html`);
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	// globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
	// globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () =>
	// 	mainWindow.toggleDevTools()
	// );

	mainWindow.on('closed', () => {
		mainWindow = null;
		aboutWindow = null;
	});
});

const menu = [
	// For mac file option
	...(isMac
		? [
				{
					// For file menu on the top bar just for MAC
					// role: 'appMenu'

					// Or custom just for MAC
					// For windows need to do another tab etc
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{ role: 'fileMenu' },
	...(isDevMode
		? [
				{
					label: 'Development',
					submenu: [
						{ role: 'reload' },
						{ role: 'forcereload' },
						{ type: 'separator' },
						{ role: 'toggledevtools' },
					],
				},
		  ]
		: []),
	// For windows help & about menu in different tab
	...(!isMac
		? [
				{
					role: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
];

ipcMain.on('img:resize', (e, opt) => {
	console.log(opt);
});

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});
