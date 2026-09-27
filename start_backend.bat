@echo off
echo Starting NEXUS TWIN Backend Server...
cd backend
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call .venv\Scripts\activate.bat
)
echo Launching Uvicorn server on http://127.0.0.1:8000...
python run.py
pause
