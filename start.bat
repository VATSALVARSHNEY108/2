@echo off
echo Starting O(1) Platform...

:: Start Frontend
start "O(1) Frontend" cmd /k "npm run dev"

:: Start Backend
start "O(1) Backend" cmd /k "venv\Scripts\python -m uvicorn backend.main:app --reload"

echo Both servers are starting in separate windows.
pause
