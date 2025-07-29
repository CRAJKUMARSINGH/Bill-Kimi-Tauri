@echo off
echo Installing dependencies...
call npm install

echo Starting Bill Generator Kimi...
call npm run tauri dev

pause
