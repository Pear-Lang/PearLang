@echo off
setlocal

REM Define your script version here
set "VERSION=1.0.0"

REM Check if the first argument is --version
if "%~1"=="--version" (
    echo %VERSION%
    goto :eof
) else if "%~1"=="--v" (
    echo %VERSION%
    goto :eof
)

REM If not --version, proceed to run main.js with all passed arguments
node "%~dp0main.js" %*

endlocal
