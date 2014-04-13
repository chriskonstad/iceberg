var url = "https://api.mongolab.com/api/1/databases/iceberg/collections/Digger?apiKey=TLPNhHLyazSmXH3eaVOyhHQ8xP-vD_LL";

var loadArray = new Array();
var ramFree = new Array();
var ramTotal = new Array();
var ramUsed = new Array();
var cpuCoreCount = new Array();
var procCount = new Array();
var kernelVersion = new Array();
var distroVersion = new Array();
var diskTotal = new Array();
var diskFree = new Array();
var diskUsed = new Array();
var procZeroUser = new Array();
var procZeroName = new Array();
var procZeroLoad = new Array();
var procOneUser = new Array();
var procOneName = new Array();
var procOneLoad = new Array();
var procTwoUser = new Array();
var procTwoName = new Array();
var procTwoLoad = new Array();

var testArray = new Array();
for(var i=0; i<10; i++) {
    testArray.push({
	x: i,
	y: i*2
    });
}

function loadData(array, data, field0, field1, isNum) {
    for(var i=0; i<data.length; i++) {
        if(isNum) {
	    array.push({
            x: Number(data[i].timestamp),
		y: field1 ? Number(data[i][field0][field1]) : Number(data[i][field0])
	    });
	} else {
	    array.push({
		x: Number(data[i].timestamp),
		y: field1 ? data[i][field0][field1] : data[i][field0]
            });
	}
    }
}

$.ajax( { url: url,
         async: true,
          type: "GET",
         contentType: "application/json" } ).done(function(data){ 
    loadData(ramTotal, data, "ram", "total", true);
    loadData(ramFree, data, "ram", "free", true);
    calcDiff(ramTotal, ramFree, ramUsed);
    loadData(cpuCoreCount, data, "cpucorecount", "", true);
    loadData(kernelVersion, data, "kernelversion", "", false);
    loadData(distroVersion, data, "distro", "", false);
    loadData(loadArray, data, "cpuload", "avg15", true);
    loadData(procCount, data, "cpuload", "proccount", true);
    loadData(diskTotal, data, "disk", "total", true);
    loadData(diskFree, data, "disk", "free", true);
    loadData(procZeroUser, data, "proc0", "user", false);
    loadData(procZeroName, data, "proc0", "name", false);
    loadData(procZeroLoad, data, "proc0", "load", true);
    loadData(procOneUser, data, "proc1", "user", false);
    loadData(procOneName, data, "proc1", "name", false);
    loadData(procOneLoad, data, "proc1", "load", true);
    loadData(procTwoUser, data, "proc2", "user", false);
    loadData(procTwoName, data, "proc2", "name", false);
    loadData(procTwoLoad, data, "proc2", "load", true);
    console.log("Done loading data");
    displayConfig(document.getElementById("distroVersionDiv"), "Distro: ", distroVersion);
    displayConfig(document.getElementById("kernelVersionDiv"), "Kernel: ", kernelVersion);
    displayConfig(document.getElementById("cpuCoreCountDiv"), "CPU Cores: ", cpuCoreCount);
    displayData("cpuLoadContainer", loadArray, "CPU Load");
    displayData("procCountContainer", procCount, "Process Count");
    displayData("ramUsedContainer", ramUsed, "RAM Usage");
});

function calcDiff(array1, array2, outputArray) {
    for(var i=0; i<array1.length; i++) {
	outputArray.push({
	    x:Number(array1[i]["x"]),
	    y:Number(Number(array1[i]["y"]) - Number(array2[i]["y"]))
	    });
    }
}

function displayData(container, array, title) {
    var chart = new CanvasJS.Chart(container, {
        theme: "theme2",//theme1
        title:{
            text: title              
        },
        data: [              
            {
		// Change type to "bar", "splineArea", "area", "spline", "pie",etc.
                type: "line",
                dataPoints: array
            }
        ]
    });

    console.log("Rendering chart...");
    chart.render();
}

function displayKernelVersion(textDiv) {
    textDiv.textContent = "Kernel: " + kernalVersion[kernalVersion.length-1]["y"];
}

function displayDistro(textDiv) {
    textDiv.textContent = "Distro: " + distroVersion[distroVersion.length-1]["y"];
}

function displayConfig(textDiv, title, array) {
    textDiv.textContent = title + array[array.length-1]["y"];
}

       
// so we don't forget later
//setInterval(function(){alert("Hello")},900000);
// every 15 minutes.
//The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
