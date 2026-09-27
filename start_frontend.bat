@echo off
echo Starting NEXUS TWIN Frontend Server...
cd frontend
if not exist node_modules (
    echo Installing node dependencies...
    npm install
)
echo Launching Vite Dev Server on http://localhost:3000...
npm run dev -- --port 3000
pause
