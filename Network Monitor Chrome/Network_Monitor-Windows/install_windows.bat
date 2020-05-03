@echo on
:: Python3 Modules Installation
pip install psutil

:: Moving All the files necessary
mkdir %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative

:: Copy Manifest Files
copy com.gk.netmon.json %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy com.gk.netstat.json %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative

:: Copy Python Files
copy "%~dp0network_monitor.py" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy "%~dp0netstat.py" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative

:: Copy Registry Installer and Uninstaller
copy "%~dp0install_host.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 
copy "%~dp0uninstall_host.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 

:: Copy Feature Files
copy "%~dp0start_network_monitor.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 
copy "%~dp0start_netstat.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative

:: Adding to Registry
cd %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
install_host.bat

echo Installed Sucessfull !!!!!


