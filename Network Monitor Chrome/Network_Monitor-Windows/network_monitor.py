import time
import psutil
import sys
import struct
import json
def main():
    old_up = 0
    old_down = 0 

    while True:
        new_up = psutil.net_io_counters().bytes_sent 
        new_down = psutil.net_io_counters().bytes_recv

        if old_up or old_down:
            send_stat(new_up - old_up, new_down - old_down)

        old_up = new_up
        old_down = new_down

        time.sleep(1)

def convert_to_gbit(up, down):
    return up/(1024), down/(1024)

def send_stat(up, down):
    up, down = convert_to_gbit(up,down)
    text = '{"text": "' + str(round(up, 2)) + " " + str(round(down, 2)) + '"}'
    encodedContent = text
    encodedLength = struct.pack('@I', len(encodedContent))
    encodedMessage = {'length': encodedLength, 'content': encodedContent}
    sys.stdout.buffer.write(encodedMessage['length'])
    sys.stdout.write(encodedMessage['content'])
    sys.stdout.flush()

main()
