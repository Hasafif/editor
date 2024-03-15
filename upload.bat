@echo off
setlocal

:: Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Root privileges are required.
    exit /b 1
)

:: Check if the correct number of arguments are provided
if "%~1"=="" (
    echo Usage: %~nx0 [username] [repository_name] [commit_message]
    exit /b 1
)

echo SSH repository upload utility

:: Get the current directory
for /f "delims=" %%i in ('cd') do set folder=%%i

echo Uploading %folder% directory contents to github repo %2
git init -b main
git add .
git commit -m "%3"
git remote add origin git@github.com:%1/%2.git
git remote -v
git push -u origin main

echo Done!
