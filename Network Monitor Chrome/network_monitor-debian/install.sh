sudo apt-get install python3

sudo apt-get install python3-pip


sudo cp com.gk.netmon.json ~/.config/google-chrome/NativeMessagingHosts/

sudo mkdir /etc/opt/chrome/native-messaging-hosts/network-monitor

sudo cp network_monitor.py /etc/opt/chrome/native-messaging-hosts/network-monitor
sudo cp network_monitor.sh /etc/opt/chrome/native-messaging-hosts/network-monitor

sudo chmod +x /etc/opt/chrome/native-messaging-hosts/network-monitor/network_monitor.sh /etc/opt/chrome/native-messaging-hosts/network-monitor/network_monitor.py
