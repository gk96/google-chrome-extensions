
:: Deletes the entry created by install_host.bat
REG DELETE "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.gk.netmon" /f
REG DELETE "HKLM\Software\Google\Chrome\NativeMessagingHosts\com.gk.netmon" /f

REG DELETE "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.gk.netstat" /f
REG DELETE "HKLM\Software\Google\Chrome\NativeMessagingHosts\com.gk.netstat" /f
