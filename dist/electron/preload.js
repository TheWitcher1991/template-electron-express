'use strict'

const { contextBridge, ipcRenderer }  = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#minimize-button').addEventListener('click', () => {
        ipcRenderer.send('minimize-window');
    })

    document.querySelector('#close-button').addEventListener('click', () => {
        ipcRenderer.send('close-window');
    })

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, (process.versions)[type]);
    }
})

contextBridge.exposeInMainWorld('api', {
    getExpressAppUrl: () => ipcRenderer.invoke('get-express-app-url')
})

contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (channel, listener) => {
        ipcRenderer.on(channel, listener);
    }
})