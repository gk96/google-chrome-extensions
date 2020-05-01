# Check Python and neccessary Modules installed
sudo apt-get install python3
sudo apt-get install python3-pip
pip3 install psutil

# Copy Manifest to Config
sudo cp com.gk.netmon.json ~/.config/google-chrome/NativeMessagingHosts/
sudo cp com.gk.netstat.json ~/.config/google-chrome/NativeMessagingHosts/

# New Directory for installation
sudo mkdir /etc/opt/chrome/native-messaging-hosts/network-monitor

# Copy files to Installation Directory
# 1. Network Monitor
sudo cp network_monitor.py /etc/opt/chrome/native-messaging-hosts/network-monitor
sudo cp netstat.py /etc/opt/chrome/native-messaging-hosts/network-monitor

# 2. Netstat Program
sudo cp network_monitor.sh /etc/opt/chrome/native-messaging-hosts/network-monitor
sudo cp netstat.sh /etc/opt/chrome/native-messaging-hosts/network-monitor


# Setting Execute Permission for required files
sudo chmod +x /etc/opt/chrome/native-messaging-hosts/network-monitor/network_monitor.sh /etc/opt/chrome/native-messaging-hosts/network-monitor/network_monitor.py
sudo chmod +x /etc/opt/chrome/native-messaging-hosts/network-monitor/netstat.sh /etc/opt/chrome/native-messaging-hosts/network-monitor/netstat.py
