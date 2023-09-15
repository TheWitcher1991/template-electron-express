'use strict'

if (require.main !== module) {
    require('update-electron-app')({
        logger: require('electron-log')
    })
}



const path = require('path')
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')

require('./src/app.js')

// When assembling for the operating system, this must be removed
// const log = require('electron-log');

const pjson = require('./package.json')

// log.transports.console.level = 'info'
// log.transports.file.level = 'info'
// log.info('App starting...')

const appversion = pjson.version

const expressAppUrl = `http://localhost:8080`;

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName(pjson.name)

let mainWindow = null

const registerGlobalShortcuts = () => {
    globalShortcut.register('CommandOrControl+Shift+L', () => {
        mainWindow?.webContents.send('show-server-log');
    })
}

function createWindow () {

    const windowOptions = {
        minWidth: 960,
        minHeight: 660,
        center: true,
        title: pjson.name,
        resizable: true,
        // transparent: true,
        frame: false,
        hasShadow: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, '/dist/public/img/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true,
            // webSecurity: false,
            worldSafeExecuteJavaScript: true,
            preload: path.join(__dirname, '/dist/electron/preload.js')
        }
    }

    if (process.platform === 'linux') {
        windowOptions.icon = path.join(__dirname, '/dist/public/img/icon.ico')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setProgressBar(0)
    // mainWindow.webContents.openDevTools()
    // mainWindow.loadURL(path.join(__dirname, '/dist/index.html'))
    mainWindow.loadURL('http://localhost:8080/')

    // log.info(mainWindow);

    if (debug) {
        mainWindow.webContents.openDevTools()
        mainWindow.maximize()
        require('devtron').install()
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });

    ipcMain.on('maximize-window', () => {
        mainWindow.maximize();
    });

    ipcMain.on('restore-window', () => {
        mainWindow.restore()
    });

    ipcMain.on('close-window', () => {
        mainWindow.close();
    });

    ipcMain.handle('get-express-app-url', () => {
        return expressAppUrl
    })
}


app.whenReady().then(() => {
    registerGlobalShortcuts()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    let checkServerRunning = setInterval(() => {
        fetch(expressAppUrl)
            .then((response) => {
                if (response.status === 200) {
                    clearInterval(checkServerRunning);
                    mainWindow?.webContents.send('server-running');
                }
            })
            .catch((err) => {
            });
    }, 1000);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})