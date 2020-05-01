:: Python Modules Installation

pip install psutil





:: Moving All the files necessary
mkdir %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy com.gk.netmon.json %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy com.gk.netstat.json %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy "%~dp0network_monitor.py" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy "%~dp0netstat.py" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
copy "%~dp0install_host.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 
copy "%~dp0uninstall_host.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 
copy "%~dp0native-messaging-example-host.bat" %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative 


cd %USERPROFILE%\AppData\Local\Programs\NetworkMonitorNative
install_host.bat


