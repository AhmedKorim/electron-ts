const {app, BrowserWindow} = require('electron');
const {format: formatUrl} = require('url');
const path = require('path');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');

const unhandled = require('electron-unhandled');

unhandled();
const isDevelopment = process.env.NODE_ENV !== 'production'
let mainWindow;
console.log({isDevelopment});
class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}
module.exports = AppUpdater;


if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development'
) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

async function createMainWindow() {
    try {

        if (
            process.env.NODE_ENV === 'development'
        ) {
            console.log(' installing ext');
            await installExtensions();
        }
        const window = new BrowserWindow({
            width: 1024,
            height: 728,
            webPreferences: {nodeIntegration: true}
        })

        if (isDevelopment) {
            window.webContents.openDevTools()
        }

        if (isDevelopment) {
            window.loadURL(formatUrl({
                pathname: path.join(__dirname, 'app.html'),
                protocol: 'file',
                slashes: true
            }))

        } else {
            window.loadURL(formatUrl({
                pathname: path.join(__dirname, 'app.html'),
                protocol: 'file',
                slashes: true
            }))
        }

        window.on('closed', () => {
            mainWindow = null
        })

        window.webContents.on('devtools-opened', () => {
            window.focus()
            setImmediate(() => {
                window.focus()
            })
        })
        return window
    } catch (e) {
        console.log(e);
    }
    new AppUpdater();
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow()
})
