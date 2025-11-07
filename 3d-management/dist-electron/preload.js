"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  // Database API
  db: {
    query: (params) => electron.ipcRenderer.invoke("db:query", params),
    insert: (params) => electron.ipcRenderer.invoke("db:insert", params),
    update: (params) => electron.ipcRenderer.invoke("db:update", params),
    delete: (params) => electron.ipcRenderer.invoke("db:delete", params),
    migrate: () => electron.ipcRenderer.invoke("db:migrate")
  }
});
