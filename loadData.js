var url = "https://api.mongolab.com/api/1/databases/iceberg/collections/Digger?apiKey=TLPNhHLyazSmXH3eaVOyhHQ8xP-vD_LL";

var loadArray = new Array();
var kernalVersion = new Array();
var ramFree = new Array();
var ramTotal = new Array();
var cpuCoreCount = new Array();
var procCount = new Array();
var kernalVersion = new Array();
var distroVersion = new Array();
var diskTotal = new Array();
var diskFree = new Array();
var procZeroUser = new Array();
var procZeroName = new Array();
var procZeroLoad = new Array();
var procOneUser = new Array();
var procOneName = new Array();
var procOneLoad = new Array();
var procTwoUser = new Array();
var procTwoName = new Array();
var procTwoLoad = new Array();


function loadData(array, data, field0, field1) {
    for(var i=0; i<data.length; i++) {
        array.push({
            x: new Date(
                getFullYear(Number(data[i].timestamp),
                getMonth(Number(data[i].timestamp)
                getDate(Number(data[i].timestamp)
                getHours(Number(data[i].timestamp)
                getMinutes(Number(data[i].timestamp)),
            y: field1 ? Number(data[i][field0][field1]) : Number(data[i][field0])
        });
    }
}

$.ajax( { url: url,
         async: false,
          type: "GET",
         contentType: "application/json" } ).done(function(data){ 
    loadData(ramTotal, data, "ram", "total");
    loadData(ramFree, data, "ram", "free");
    loadData(cpuCoreCount, data, "cpucorecount", "");
    loadData(kernalVersion, data, "kernalversion", "");
    loadData(distroVersion, data, "distro", "");
    loadData(loadArray, data, "cpuload", "avg15");
    loadData(procCount, data, "cpuload", "proccount");
    loadData(diskTotal, data, "disk", "total");
    loadData(diskFree, data, "disk", "free");
    loadData(procZeroUser, data, "proc0", "user");
    loadData(procZeroName, data, "proc0", "name");
    loadData(procZeroLoad, data, "proc0", "load");
    loadData(procOneUser, data, "proc1", "user");
    loadData(procOneName, data, "proc1", "name");
    loadData(procOneLoad, data, "proc1", "load");
    loadData(procTwoUser, data, "proc2", "user");
    loadData(procTwoName, data, "proc2", "name");
    loadData(procTwoLoad, data, "proc2", "load");
});



       
// so we don't forget later
//setInterval(function(){alert("Hello")},900000);
// every 15 minutes.
//The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).