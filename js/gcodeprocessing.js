function downloadFile(filename, contents) {
    var blob = new Blob([contents], {type: 'text/plain'});
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else{
        var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
}

function processBaseline(){
    var hotendTemp = document.baselineForm.hotendtemp.value;
    var bedTemp = document.baselineForm.bedtemp.value;
    var bedX = Math.round((document.baselineForm.bedx.value-100)/2);
    var bedY = Math.round((document.baselineForm.bedy.value-100)/2);
    var retDist = document.baselineForm.retdist.value;
    var retSpeed = document.baselineForm.retspeed.value*60;
    var abl = document.baselineForm.abl.value;
    var baseline = originalBaseline;
    if(abl == 1){
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        baseline =  baseline.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    baseline = baseline.replace(/M140 S60/g, "M140 S"+bedTemp);
    baseline = baseline.replace(/M190 S60/g, "M140 S"+bedTemp);
    baseline = baseline.replace(/M104 S210/g, "M104 S"+hotendTemp);
    baseline = baseline.replace(/M109 S210/g, "M109 S"+hotendTemp);
    baseline = baseline.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed);
    baseline = baseline.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed);

    if(bedX > 0){
        var baselineArray = baseline.split(/\n/g);
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/X/) > -1){
                var value = parseInt(baselineArray[item].match(/X\d+/)[0].substring(1)) + bedX
                baselineArray[item] = baselineArray[item].replace(/X\d+/, "X"+String(value));
            }
        });
        baseline = baselineArray.join("\n");
    }
    if(bedY > 0){  
        var baselineArray = baseline.split(/\n/g);
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/Y/) > -1){
                var value = parseInt(baselineArray[item].match(/Y\d+/)[0].substring(1)) + bedY
                baselineArray[item] = baselineArray[item].replace(/Y\d+/, "Y"+String(value))
            }
        });
        baseline = baselineArray.join("\n");
    }
    downloadFile('baseline.gcode', baseline);
}

