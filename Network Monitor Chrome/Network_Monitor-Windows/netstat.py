import socket
from socket import AF_INET, SOCK_STREAM, SOCK_DGRAM
import sys
import psutil
import time
import struct
import json



AD = "-"
AF_INET6 = getattr(socket, 'AF_INET6', object())
proto_map = {
    (AF_INET, SOCK_STREAM): 'tcp',
    (AF_INET6, SOCK_STREAM): 'tcp6',
    (AF_INET, SOCK_DGRAM): 'udp',
    (AF_INET6, SOCK_DGRAM): 'udp6',
}


def main():
    templ = "%-5s %-30s %-30s %-13s %-6s %s"
    proc_names = {}
    
    while True:
        for p in psutil.process_iter(['pid', 'name']):
            proc_names[p.info['pid']] = p.info['name']
        for c in psutil.net_connections(kind='inet'):
            laddr = "%s:%s" % (c.laddr)
            raddr = ""
            if c.raddr:
                raddr = "%s:%s" % (c.raddr)
            
            encodedContent = json.dumps({
                    'PID': c.pid or AD,
                    'Program Name':proc_names.get(c.pid, '?')[:15],
                    'local_address': laddr,
                    'remote_address': raddr or AD,
                    'proto': proto_map[(c.family, c.type)],
                    'status': c.status
                    
                    
                })
            
            encodedLength = struct.pack('@I', len(encodedContent))
            encodedMessage = {'length': encodedLength, 'content': encodedContent}
            sys.stdout.buffer.write(encodedMessage['length'])
            sys.stdout.write(str(encodedMessage['content']))
            sys.stdout.flush()
           
        time.sleep(1)


if __name__ == '__main__':
    main()
