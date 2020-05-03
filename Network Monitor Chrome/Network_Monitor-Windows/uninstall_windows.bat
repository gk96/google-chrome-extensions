@echo off

:menu
choice /m "Inorder to uninstall all running chrome processes must be killed.Continue:"?
if %errorlevel% equ 1 goto yes
if %errorlevel% equ 2 goto no


:yes
:: Remove entire Directory

:: Kill Chrome and all of its child processes
taskkill /F /IM chrome.exe /T

2> nul rmdir /S /Q "%USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative\"

:: Delete Values from Registry
uninstall_host.bat

echo Uninstalled !!!!

:no
