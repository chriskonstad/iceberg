#Iceberg python script
import json
import subprocess
import urllib
import urllib2
import sched, time
from time import strftime

s = sched.scheduler(time.time, time.sleep)

def runCmd(cmd):
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate();
    p.wait()
    output = output.rstrip('\n')
    return output

def updateData(sc):
    data = []

    #uptime = ms
    #ram = mb
    #disk = gb

    timestamp = runCmd("date +%s")
    uptime = runCmd("cat /proc/uptime | awk '{ print $1 }'")
    ramtotal = runCmd("free -t -m | grep buffers/cache | awk '{total += $4} END {total += $3} END {print total}'")
    ramfree = runCmd("free -t -m | grep buffers/cache | awk '{ print $4 }'")
    cpucount = runCmd("cat /proc/cpuinfo | grep \"cpu cores\" | awk '{ print $4 }' | awk '{s+=$1} END {print s}'")
    kernelversion = runCmd("cat /proc/version | awk '{print $3}'")
    distro = runCmd("lsb_release -a | grep Description | awk '{s=\"\"; for(i=2; i<NF; i++) s = s $i \" \"; print s }'")
    loadavg = runCmd("cat /proc/loadavg | awk '{ print $3}'")
    loadprocesses = runCmd("ps -eaf | wc -l")
    diskfree = runCmd("df -l | grep sda | awk '{print $4}' | awk '{s+=$1} END {print s/1024/1024}'")
    disktotal = runCmd("df -l | grep sda | awk '{print $2}' | awk '{s+=$1} END {print s/1024/1024}'")

    #Processes
    #TODO: Ignore python and sub processes somehow?
    procUser = 0
    procName = 3
    procPercentage = 1
    topproc0 = runCmd("ps -eo user,pcpu,pid,command | sort -r -k2 | head -2 | awk '/./{line=$0} END {print line}'")
    topproc0User = topproc0.split()[procUser]
    topproc0Name = topproc0.split()[procName]
    topproc0Percentage = topproc0.split()[procPercentage]
    topproc1 = runCmd("ps -eo user,pcpu,pid,command | sort -r -k2 | head -3 | awk '/./{line=$0} END {print line}'")
    topproc1User = topproc1.split()[procUser]
    topproc1Name = topproc1.split()[procName]
    topproc1Percentage = topproc1.split()[procPercentage]
    topproc2 = runCmd("ps -eo user,pcpu,pid,command | sort -r -k2 | head -4 | awk '/./{line=$0} END {print line}'")
    topproc2User = topproc2.split()[procUser]
    topproc2Name = topproc2.split()[procName]
    topproc2Percentage = topproc2.split()[procPercentage]

    data.append({"timestamp": timestamp,
                 "uptime": uptime,
                 "ram": { 
                     "total": ramtotal,
                     "free": ramfree
                 },
                 "cpucorecount": cpucount,
                 "kernelversion": kernelversion,
                 "distro": distro,
                 "cpuload": {
                     "proccount": loadprocesses,
                     "avg15": loadavg
                 },
                 "disk": {
                     "total": disktotal,
                     "free": diskfree
                 },
                 "proc0": {
                     "user": topproc0User,
                     "name": topproc0Name,
                     "load": topproc0Percentage
                 },
                 "proc1": {
                     "user": topproc1User,
                     "name": topproc1Name,
                     "load": topproc1Percentage
                 },
                 "proc2": {
                     "user": topproc2User,
                     "name": topproc2Name,
                     "load": topproc2Percentage
                 }
             })

    #print json.dumps(data)

    #update the database
    url = "https://api.mongolab.com/api/1/databases/iceberg/collections/Digger?apiKey=TLPNhHLyazSmXH3eaVOyhHQ8xP-vD_LL"
    stringdata = json.dumps(data)

    req = urllib2.Request(url, stringdata, {'Content-Type': 'application/json'})
    f = urllib2.urlopen(req)

    #if the http response doesn't work, then print the error code. Otherwise, be silent
    if f.getcode() != 200:
        print "FAILED with error code: " + f.getcode()
    else:
        print "Success (" + strftime("%Y-%m-%d %H:%M:%S") + ")"

    sc.enter(900, 1, updateData, (sc,))

s.enter(900, 1, updateData, (s,))
s.run()
