@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
set ELECTRON_RUN_AS_NODE=
cd /d "%~dp0"
npm run dev
