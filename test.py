import json
import subprocess

def runCmd(cmd):
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate();
    p.wait()
    output = output.rstrip('\n')
    return output

response = []

#Get uptime
uptime = runCmd("cat /proc/uptime | awk '{ print $1 }'")
response.append({"uptime": uptime})

print json.dumps(response)
