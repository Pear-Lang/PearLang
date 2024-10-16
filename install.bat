@echo off
REM add_to_path.bat - Enhanced Script to Check and Install Node.js

REM ================================
REM Functionality:
REM 1. Check if Node.js is installed.
REM 2. If not, prompt the user to install Node.js.
REM 3. Handle user response (Yes/No).
REM 4. Install Node.js if user agrees.
REM 5. Restart Command Prompt after installation.
REM 6. Proceed with existing PATH modifications.
REM ================================

REM Get the directory of this script
SET "SCRIPT_DIR=%~dp0"
REM Remove trailing backslash if present
IF "%SCRIPT_DIR:~-1%"=="\" SET "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM ===================================
REM Step 1: Check if Node.js is installed
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO Node.js is not installed on your system.
    REM ===================================
    REM Step 2: Prompt the user to install Node.js
    CHOICE /M "Do you want to install Node.js now?"
    IF ERRORLEVEL 2 (
        REM ===================================
        REM User chose 'No'
        ECHO Node.js is required for this script to run. Exiting...
        EXIT /B 1
    ) ELSE IF ERRORLEVEL 1 (
        REM ===================================
        REM User chose 'Yes'
        ECHO Preparing to install Node.js...

        REM Define Node.js installer URL
        REM You can update the URL to the latest LTS version as needed
        SET "NODE_INSTALLER_URL=https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi"

        REM Define the path to save the installer
        SET "INSTALLER_PATH=%TEMP%\nodejs-installer.msi"

        REM ===================================
        REM Step 3: Download the Node.js installer
        ECHO Downloading Node.js installer from %NODE_INSTALLER_URL%...
        REM Use PowerShell to download the installer
        powershell -Command "Invoke-WebRequest -Uri '%NODE_INSTALLER_URL%' -OutFile '%INSTALLER_PATH%'"

        REM Check if the installer was downloaded successfully
        IF NOT EXIST "%INSTALLER_PATH%" (
            ECHO Failed to download the Node.js installer. Please check your internet connection and try again.
            EXIT /B 1
        )

        REM ===================================
        REM Step 4: Run the Node.js installer silently
        ECHO Installing Node.js...
        msiexec /i "%INSTALLER_PATH%" /quiet /norestart

        REM ===================================
        REM Step 5: Verify installation
        node -v >nul 2>&1
        IF ERRORLEVEL 1 (
            ECHO Node.js installation failed. Please install it manually and rerun this script.
            EXIT /B 1
        ) ELSE (
            ECHO Node.js has been installed successfully.
            ECHO Restarting the Command Prompt to apply changes...
            REM ===================================
            REM Step 6: Restart the Command Prompt and rerun the script
            START "" cmd.exe /k "%~f0"
            EXIT
        )
    )
) ELSE (
    ECHO Node.js is already installed. Proceeding with the script...
)

REM ===================================
REM Existing Functionality: Add BIN_DIR to PATH

REM Construct the path to the bin directory
SET "BIN_DIR=%SCRIPT_DIR%\bin"

REM Check if BIN_DIR exists
IF NOT EXIST "%BIN_DIR%\pear.bat" (
    ECHO pear.bat not found in %BIN_DIR%
    EXIT /B 1
)

REM Get the current PATH variable
FOR /F "tokens=1* delims==" %%A IN ('set PATH') DO SET "OLD_PATH=%%B"

REM Check if BIN_DIR is already in PATH
ECHO %PATH% | FIND /I "%BIN_DIR%" >NUL
IF ERRORLEVEL 1 (
    ECHO Adding %BIN_DIR% to PATH...
    REM Use setx to update the PATH variable permanently for the current user
    SETX PATH "%OLD_PATH%;%BIN_DIR%"
    ECHO %BIN_DIR% has been added to your PATH environment variable.
    ECHO Please restart your Command Prompt or log off and log back in for the changes to take effect.
) ELSE (
    ECHO %BIN_DIR% is already in your PATH.
)

REM ===================================
REM End of Script
EXIT /B 0
