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

function toggle(ticked, target){
    if(ticked == true){
        $(target).hide();
    } else {
        $(target).show();
    }
}

function esteps(){
    var oldSteps = document.estepsForm.oldSteps.value;
    var remainingFil = document.estepsForm.remainingFil.value;
    var actualExtrusion = 120 - remainingFil;
    var newSteps = (oldSteps/actualExtrusion*100).toFixed(2);
    $("#e1").html(remainingFil);
    $("#e2").html(actualExtrusion);
    $("#e3").html(newSteps);
    $("#e4").html(newSteps);
    $("#estepsresult").show();
}

function flowCalc1(){
    var oldflow = document.flow1.oldFlow1.value;
    var targetwall = document.flow1.targetWall.value;
    var measuredwall = document.flow1.measuredWall.value;
    var newsteps = (oldflow/measuredwall*targetwall).toFixed(2);
    $("#f1").html(newsteps);
    $("#flow1result").show();
}

function flowCalc2(){
    var oldflow = document.flow2.oldFlow2.value;
    var targetwall = document.flow2.targetWall.value;
    var measuredwall = document.flow2.measuredWall.value;
    var newsteps = (oldflow/measuredwall*targetwall).toFixed(2);
    $("#f2").html(newsteps);
    $("#flow2result").show();
}

var maxExtVol = 7.22;
var maxFeedRate = 100;
function maxExt(){
    var dia = document.maxExtrusion.filDia.value;
    var max = document.maxExtrusion.maxFeed.value;
    var result = ((Math.pow(dia/2, 2))*Math.PI)*(max/60);
    var str = result.toFixed(2);
    maxExtVol = parseFloat(str);
    $('#maxExt').html(maxExtVol);
}

function maxFee(){
    var layH = document.maxExtrusion.layerH.value;
    var layW = document.maxExtrusion.layerW.value;
    var maxFeedRate = Math.floor(maxExtVol/(layH*layW));
    $('#maxFee').html(maxFeedRate);
}

function toggleJ() {
    var value = document.accelerationForm.jerk_or_jd.value;
    if(value == "jerk"){
        $(".jdtd").hide();
        $(".jerktd").show();
    } else {
        $(".jdtd").show();
        $(".jerktd").hide();
    }
}

function processBaseline(){
    var hotendTemp = document.baselineForm.hotendtemp.value;
    var bedTemp = document.baselineForm.bedtemp.value;
    var centre = document.baselineForm.centre.checked;
    var bedX = Math.round((document.baselineForm.bedx.value-100)/2);
    var bedY = Math.round((document.baselineForm.bedy.value-100)/2);
    var retDist = document.baselineForm.retdist.value;
    var retSpeed = document.baselineForm.retspeed.value*60;
    var abl = document.baselineForm.abl.value;
    var pc = document.baselineForm.pc.value;
    var customStart = document.baselineForm.startgcode.value;
    var baseline = originalBaseline;
    if(pc == 1){
        baseline = baseline.replace(/M106 S255/, "M106 S130 ; custom fan 50%");
    }
    if(pc == 2){
        baseline =  baseline.replace(/M106 S255/, ";M106 S255 ; custom fan off");
    }
    baseline = baseline.replace(/M140 S60/g, "M140 S"+bedTemp+" ; custom bed temp");
    baseline = baseline.replace(/M190 S60/g, "M190 S"+bedTemp+" ; custom bed temp");
    if(abl != 4){
        baseline = baseline.replace(/M104 S210 T0/g, "M104 S"+hotendTemp+" T0 ; custom hot end temp");
        baseline = baseline.replace(/M109 S210 T0/g, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    } else {
        baseline = baseline.replace(/M104 S210 T0/g, "; Prusa Mini");
        baseline = baseline.replace(/M109 S210 T0/g, "; Prusa Mini");
    }
    baseline = baseline.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
    baseline = baseline.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed+" ; custom un-retraction/prime");
    if(abl == 1){
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        baseline =  baseline.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        baseline = baseline.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level");
        baseline = baseline.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling");
    }
    if(abl == 4){
        baseline = baseline.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        baseline = baseline.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    }
    if(abl == 5){
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var baselineArray = baseline.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/X/) > -1){
                var value = parseFloat(baselineArray[item].match(regexp)[0].substring(1)) - 50;
                baselineArray[item] = baselineArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/Y/) > -1){
                var value = parseFloat(baselineArray[item].match(regexp)[0].substring(1)) - 50;
                baselineArray[item] = baselineArray[item].replace(regexp, "Y"+String(value))
            }
        });
        baseline = baselineArray.join("\n");
    } else {
        if(bedX > 0){
            var baselineArray = baseline.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            baselineArray.forEach(function(index, item){
                if(baselineArray[item].search(/X/) > -1){
                    var value = parseFloat(baselineArray[item].match(regexp)[0].substring(1)) + bedX;
                    baselineArray[item] = baselineArray[item].replace(regexp, "X"+String(value));
                }
            });
            baseline = baselineArray.join("\n");
        }
        if(bedY > 0){  
            var baselineArray = baseline.split(/\n/g);
            var regexp = /Y[0-9\.]+/;
            baselineArray.forEach(function(index, item){
                if(baselineArray[item].search(/Y/) > -1){
                    var value = parseFloat(baselineArray[item].match(regexp)[0].substring(1)) + bedY;
                    baselineArray[item] = baselineArray[item].replace(regexp, "Y"+String(value))
                }
            });
            baseline = baselineArray.join("\n");
        }   
    }
    if(document.baselineForm.start.checked == true) {
        baseline = baseline.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    downloadFile('baseline.gcode', baseline);
}

function processRetraction(){
    var hotendTemp = document.retractionForm.hotendtemp.value;
    var bedTemp = document.retractionForm.bedtemp.value;
    var centre = document.retractionForm.centre.checked;
    var bedX = Math.round((document.retractionForm.bedx.value-100)/2);
    var bedY = Math.round((document.retractionForm.bedy.value-100)/2);
    var abl = document.retractionForm.abl.value;
    var pc = document.retractionForm.pc.value;
    var a1 = document.retractionForm.ret_a1.value;
    var a2 = document.retractionForm.ret_a2.value*60;
    var a3 = document.retractionForm.ret_a3.value;
    var a5 = document.retractionForm.ret_a5.value;
    var b1 = document.retractionForm.ret_b1.value;
    var b2 = document.retractionForm.ret_b2.value*60;
    var b3 = document.retractionForm.ret_b3.value;
    var b5 = document.retractionForm.ret_b5.value;
    var c1 = document.retractionForm.ret_c1.value;
    var c2 = document.retractionForm.ret_c2.value*60;
    var c3 = document.retractionForm.ret_c3.value;
    var c5 = document.retractionForm.ret_c5.value;
    var d1 = document.retractionForm.ret_d1.value;
    var d2 = document.retractionForm.ret_d2.value*60;
    var d3 = document.retractionForm.ret_d3.value;
    var d5 = document.retractionForm.ret_d5.value;
    var e1 = document.retractionForm.ret_e1.value;
    var e2 = document.retractionForm.ret_e2.value*60;
    var e3 = document.retractionForm.ret_e3.value;
    var e5 = document.retractionForm.ret_e5.value;
    var f1 = document.retractionForm.ret_f1.value;
    var f2 = document.retractionForm.ret_f2.value*60;
    var f3 = document.retractionForm.ret_f3.value;
    var f5 = document.retractionForm.ret_f5.value;
    var customStart = document.retractionForm.startgcode.value;
    var retraction = originalRetraction;
    if(pc == 1){
        retraction = retraction.replace(/M106 S255/, "M106 S130 ; custom fan 50%");
    }
    if(pc == 2){
        retraction =  retraction.replace(/M106 S255/, ";M106 S255 ; custom fan off");
    }
    retraction = retraction.replace(/M140 S60/g, "M140 S"+bedTemp+" ; custom bed temp");
    retraction = retraction.replace(/M190 S60/g, "M190 S"+bedTemp+" ; custom bed temp");
    if(abl != 4){
        retraction = retraction.replace(/M104 S210 T0/g, "M104 S"+hotendTemp+" T0 ; custom hot end temp");
        retraction = retraction.replace(/M109 S210 T0/g, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    } else {
        retraction = retraction.replace(/M104 S210/g, "; Prusa Mini");
        retraction = retraction.replace(/M109 S210/g, "; Prusa Mini");
    }
    if(abl == 1){
        retraction = retraction.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        retraction =  retraction.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        retraction = retraction.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level")
        retraction = retraction.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling")
    }
    if(abl == 4){
        retraction = retraction.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        retraction = retraction.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        retraction = retraction.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    }
    if(abl == 5){
        retraction = retraction.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var retractionArray = retraction.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        retractionArray.forEach(function(index, item){
            if(retractionArray[item].search(/X/) > -1){
                var value = parseFloat(retractionArray[item].match(regexp)[0].substring(1)) - 50;
                retractionArray[item] = retractionArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        retractionArray.forEach(function(index, item){
            if(retractionArray[item].search(/Y/) > -1){
                var value = parseFloat(retractionArray[item].match(regexp)[0].substring(1)) - 50;
                retractionArray[item] = retractionArray[item].replace(regexp, "Y"+String(value))
            }
        });
        retraction = retractionArray.join("\n");
    } else {
        if(bedX > 0){
            var retractionArray = retraction.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            retractionArray.forEach(function(index, item){
                if(retractionArray[item].search(/X/) > -1){
                    var value = parseFloat(retractionArray[item].match(regexp)[0].substring(1)) + bedX;
                    retractionArray[item] = retractionArray[item].replace(regexp, "X"+String(value));
                }
            });
            retraction = retractionArray.join("\n");
        }
        if(bedY > 0){  
            var retractionArray = retraction.split(/\n/g);
            var regexp = /Y[0-9\.]+/;
            retractionArray.forEach(function(index, item){
                if(retractionArray[item].search(/Y/) > -1){
                    var value = parseFloat(retractionArray[item].match(regexp)[0].substring(1)) + bedY;
                    retractionArray[item] = retractionArray[item].replace(regexp, "Y"+String(value))
                }
            });
            retraction = retractionArray.join("\n");
        }   
    }
    // A section
    retraction = retraction.replace(/;retractionA/g, "G1 E-"+a1+" F"+a2+" ; custom retraction - A");
    retraction = retraction.replace(/;unretractionA/g, "G1 E"+a3+" F"+a2+" ; custom un-retraction/prime - A");
    if(a5 > 0){
        retraction = retraction.replace(/;zhopupA/g, "G91\nG1 Z"+a5+" F1200 ; custom z hop - A\nG90");
    }
    // B section
    retraction = retraction.replace(/;retractionB/g, "G1 E-"+b1+" F"+b2+" ; custom retraction - B");
    retraction = retraction.replace(/;unretractionB/g, "G1 E"+b3+" F"+b2+" ; custom un-retraction/prime - B");
    if(b5 > 0){
        retraction = retraction.replace(/;zhopupB/g, "G91\nG1 Z"+b5+" F1200 ; custom z hop - B\nG90");
    }
    // C section
    retraction = retraction.replace(/;retractionC/g, "G1 E-"+c1+" F"+c2+" ; custom retraction - C");
    retraction = retraction.replace(/;unretractionC/g, "G1 E"+c3+" F"+c2+" ; custom un-retraction/prime - C");
    if(c5 > 0){
        retraction = retraction.replace(/;zhopupC/g, "G91\nG1 Z"+c5+" F1200 ; custom z hop - C\nG90");
    }
    // D section
    retraction = retraction.replace(/;retractionD/g, "G1 E-"+d1+" F"+d2+" ; custom retraction - D");
    retraction = retraction.replace(/;unretractionD/g, "G1 E"+d3+" F"+d2+" ; custom un-retraction/prime - D");
    if(d5 > 0){
        retraction = retraction.replace(/;zhopupD/g, "G91\nG1 Z"+d5+" F1200 ; custom z hop - D\nG90");
    }
    // E section
    retraction = retraction.replace(/;retractionE/g, "G1 E-"+e1+" F"+e2+" ; custom retraction - E");
    retraction = retraction.replace(/;unretractionE/g, "G1 E"+e3+" F"+e2+" ; custom un-retraction/prime - E");
    if(e5 > 0){
        retraction = retraction.replace(/;zhopupE/g, "G91\nG1 Z"+e5+" F1200 ; custom z hop - E\nG90");
    }
    // F section
    retraction = retraction.replace(/;retractionF/g, "G1 E-"+f1+" F"+f2+" ; custom retraction - F");
    retraction = retraction.replace(/;unretractionF/g, "G1 E"+f3+" F"+f2+" ; custom un-retraction/prime - F");
    if(document.retractionForm.start.checked == true) {
        retraction = retraction.replace(/;customstart/, "; custom start gcode\n"+customStart);
        if(f5 > 0){
            retraction = retraction.replace(/;zhopupF/g, "G91\nG1 Z"+f5+" F1200 ; custom z hop - F\nG90");
        }
    }
    downloadFile('retraction.gcode', retraction);
}

function processTemperature(){
    var bedTemp = document.temperatureForm.bedtemp.value;
    var centre = document.temperatureForm.centre.checked;
    var bedX = Math.round((document.temperatureForm.bedx.value-100)/2);
    var bedY = Math.round((document.temperatureForm.bedy.value-100)/2);
    var retDist = document.temperatureForm.retdist.value;
    var retSpeed = document.temperatureForm.retspeed.value*60;
    var abl = document.temperatureForm.abl.value;
    var pc = document.temperatureForm.pc.value;
    var a0 = document.temperatureForm.temp_a0.value;
    var a1 = document.temperatureForm.temp_a1.value;
    var b1 = document.temperatureForm.temp_b1.value;
    var c1 = document.temperatureForm.temp_c1.value;
    var d1 = document.temperatureForm.temp_d1.value;
    var e1 = document.temperatureForm.temp_e1.value;
    var customStart = document.temperatureForm.startgcode.value;
    var temperature = originalTemperature;
    if(pc == 1){
        temperature = temperature.replace(/M106 S255/, "M106 S130 ; custom fan 50%");
    }
    if(pc == 2){
        temperature =  temperature.replace(/M106 S255/, ";M106 S255 ; custom fan off");
    }
    if(abl == 1){
        temperature = temperature.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        temperature =  temperature.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        temperature = temperature.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level")
        temperature = temperature.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling")
    }
    if(abl == 4){
        temperature = temperature.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        temperature = temperature.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        temperature = temperature.replace(/;M420 S1 ; restore ABL mesh/, "tempmini");
    }
    if(abl == 5){
        temperature = temperature.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }
    temperature = temperature.replace(/M140 S60/, "M140 S"+bedTemp+" ; custom bed temp");
    temperature = temperature.replace(/M190 S60/, "M190 S"+bedTemp+" ; custom bed temp");
    temperature = temperature.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
    temperature = temperature.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed+" ; custom unretraction/prime");

    if(centre == true){
        var temperatureArray = temperature.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        temperatureArray.forEach(function(index, item){
            if(temperatureArray[item].search(/X/) > -1){
                var value = parseFloat(temperatureArray[item].match(regexp)[0].substring(1)) - 50;
                temperatureArray[item] = temperatureArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        temperatureArray.forEach(function(index, item){
            if(temperatureArray[item].search(/Y/) > -1){
                var value = parseFloat(temperatureArray[item].match(regexp)[0].substring(1)) - 50;
                temperatureArray[item] = temperatureArray[item].replace(regexp, "Y"+String(value))
            }
        });
        temperature = temperatureArray.join("\n");
    } else {
        if(bedX > 0){
            var temperatureArray = temperature.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            temperatureArray.forEach(function(index, item){
                if(temperatureArray[item].search(/X/) > -1){
                    var value = parseFloat(temperatureArray[item].match(regexp)[0].substring(1)) + bedX;
                    temperatureArray[item] = temperatureArray[item].replace(regexp, "X"+String(value));
                }
            });
            temperature = temperatureArray.join("\n");
        }
        if(bedY > 0){  
            var temperatureArray = temperature.split(/\n/g);
            var regexp = /Y[0-9\.]+/;
            temperatureArray.forEach(function(index, item){
                if(temperatureArray[item].search(/Y/) > -1){
                    var value = parseFloat(temperatureArray[item].match(regexp)[0].substring(1)) + bedY;
                    temperatureArray[item] = temperatureArray[item].replace(regexp, "Y"+String(value))
                }
            });
            temperature = temperatureArray.join("\n");
        }   
    }
    if(abl != 4){
        temperature = temperature.replace(/temp0a/, "M104 S"+a0+" T0 ; custom hot end temp - first layer");
        temperature = temperature.replace(/temp0b/, "M109 S"+a0+" T0 ; custom hot end temp - first layer");
    } else {
        temperature = temperature.replace(/temp0a/, "; Prusa Mini");
        temperature = temperature.replace(/temp0b/, "; Prusa Mini");
        temperature = temperature.replace(/tempmini/, "M109 S"+a0+" T0 ; custom hot end temp - first layer");
    }
    temperature = temperature.replace(/temp1/, "M104 S"+a1+" T0 ; custom hot end temp - A");
    temperature = temperature.replace(/temp2/, "M104 S"+b1+" T0 ; custom hot end temp - B");
    temperature = temperature.replace(/temp3/, "M104 S"+c1+" T0 ; custom hot end temp - C");
    temperature = temperature.replace(/temp4/, "M104 S"+d1+" T0 ; custom hot end temp - D");
    temperature = temperature.replace(/temp5/, "M104 S"+e1+" T0 ; custom hot end temp - E");
    if(document.temperatureForm.start.checked == true) {
        temperature = temperature.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    downloadFile('temperature.gcode', temperature);
}

function processAcceleration(){
    var hotendTemp = document.accelerationForm.hotendtemp.value;
    var bedTemp = document.accelerationForm.bedtemp.value;
    var centre = document.accelerationForm.centre.checked;
    var bedX = Math.round((document.accelerationForm.bedx.value-100)/2);
    var bedY = Math.round((document.accelerationForm.bedy.value-100)/2);
    var retDist = document.accelerationForm.retdist.value;
    var retSpeed = document.accelerationForm.retspeed.value*60;
    var abl = document.accelerationForm.abl.value;
    var pc = document.accelerationForm.pc.value;
    var feed = document.accelerationForm.feedrate.value*60;
    var jerk_or_jd = document.accelerationForm.jerk_or_jd.value;
    var a1 = document.accelerationForm.accel_a1.value;
    var a2 = document.accelerationForm.accel_a2.value;
    var a3 = document.accelerationForm.accel_a3.value;
    var a4 = document.accelerationForm.accel_a4.value;
    var b1 = document.accelerationForm.accel_b1.value;
    var b2 = document.accelerationForm.accel_b2.value;
    var b3 = document.accelerationForm.accel_b3.value;
    var b4 = document.accelerationForm.accel_b4.value;
    var c1 = document.accelerationForm.accel_c1.value;
    var c2 = document.accelerationForm.accel_c2.value;
    var c3 = document.accelerationForm.accel_c3.value;
    var c4 = document.accelerationForm.accel_c4.value;
    var d1 = document.accelerationForm.accel_d1.value;
    var d2 = document.accelerationForm.accel_d2.value;
    var d3 = document.accelerationForm.accel_d3.value;
    var d4 = document.accelerationForm.accel_d4.value;
    var e1 = document.accelerationForm.accel_e1.value;
    var e2 = document.accelerationForm.accel_e2.value;
    var e3 = document.accelerationForm.accel_e3.value;
    var e4 = document.accelerationForm.accel_e4.value;
    var f1 = document.accelerationForm.accel_f1.value;
    var f2 = document.accelerationForm.accel_f2.value;
    var f3 = document.accelerationForm.accel_f3.value;
    var f4 = document.accelerationForm.accel_f4.value;
    var customStart = document.accelerationForm.startgcode.value;
    var acceleration = originalAcceleration;
    if(pc == 1){
        acceleration = acceleration.replace(/M106 S255/, "M106 S130 ; custom fan 50%");
    }
    if(pc == 2){
        acceleration =  acceleration.replace(/M106 S255/, ";M106 S255 ; custom fan off");
    }
    acceleration = acceleration.replace(/M140 S60/g, "M140 S"+bedTemp+" ; custom bed temp");
    acceleration = acceleration.replace(/M190 S60/g, "M190 S"+bedTemp+" ; custom bed temp");
    if(abl != 4){
        acceleration = acceleration.replace(/M104 S210 T0/g, "M104 S"+hotendTemp+" T0 ; custom hot end temp");
        acceleration = acceleration.replace(/M109 S210 T0/g, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    } else {
        acceleration = acceleration.replace(/M104 S210/g, "; Prusa Mini");
        acceleration = acceleration.replace(/M109 S210/g, "; Prusa Mini");
    }
    acceleration = acceleration.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
    acceleration = acceleration.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed+" ; custom un-retraction/prime");
    if(abl == 1){
        acceleration = acceleration.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        acceleration =  acceleration.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        acceleration = acceleration.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level")
        acceleration = acceleration.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling")
    }
    if(abl == 4){
        acceleration = acceleration.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        acceleration = acceleration.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        acceleration = acceleration.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    }
    if(abl == 5){
        acceleration = acceleration.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var accelerationArray = acceleration.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        accelerationArray.forEach(function(index, item){
            if(accelerationArray[item].search(/X/) > -1){
                var value = parseFloat(accelerationArray[item].match(regexp)[0].substring(1)) - 50;
                accelerationArray[item] = accelerationArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        accelerationArray.forEach(function(index, item){
            if(accelerationArray[item].search(/Y/) > -1){
                var value = parseFloat(accelerationArray[item].match(regexp)[0].substring(1)) - 50;
                accelerationArray[item] = accelerationArray[item].replace(regexp, "Y"+String(value))
            }
        });
        acceleration = accelerationArray.join("\n");
    } else {
        if(bedX > 0){
            var accelerationArray = acceleration.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            accelerationArray.forEach(function(index, item){
                if(accelerationArray[item].search(/X/) > -1){
                    var value = parseFloat(accelerationArray[item].match(regexp)[0].substring(1)) + bedX;
                    accelerationArray[item] = accelerationArray[item].replace(regexp, "X"+String(value));
                }
            });
            acceleration = accelerationArray.join("\n");
        }
        if(bedY > 0){  
            var accelerationArray = acceleration.split(/\n/g);
            var regexp = /Y[0-9\.]+/;
            accelerationArray.forEach(function(index, item){
                if(accelerationArray[item].search(/Y/) > -1){
                    var value = parseFloat(accelerationArray[item].match(regexp)[0].substring(1)) + bedY;
                    accelerationArray[item] = accelerationArray[item].replace(regexp, "Y"+String(value))
                }
            });
            acceleration = accelerationArray.join("\n");
        }   
    }

    acceleration = acceleration.replace(/F3720/g, "F"+feed+" ; custom feedrate - full");
    acceleration = acceleration.replace(/F2790/g, "F"+feed+" ; custom feedrate - full");
    acceleration = acceleration.replace(/F1860/g, "F"+feed/2+" ; custom feedrate - half");

    acceleration = acceleration.replace(/raise/g, "M201 X5000 Y5000 ; custom raise acceleration limits");
    acceleration = acceleration.replace(/accel1/g, "M204 P"+a1+" ; custom acceleration - A");
    acceleration = acceleration.replace(/accel2/g, "M204 P"+b1+" ; custom acceleration - B");
    acceleration = acceleration.replace(/accel3/g, "M204 P"+c1+" ; custom acceleration - C");
    acceleration = acceleration.replace(/accel4/g, "M204 P"+d1+" ; custom acceleration - D");
    acceleration = acceleration.replace(/accel5/g, "M204 P"+e1+" ; custom acceleration - E");
    acceleration = acceleration.replace(/accel6/g, "M204 P"+f1+" ; custom acceleration - F");

    if(jerk_or_jd == "jerk"){
        acceleration = acceleration.replace(/j1/g, "M205 X"+a2+" Y"+a3+" ; custom jerk - A");
        acceleration = acceleration.replace(/j2/g, "M205 X"+b2+" Y"+b3+" ; custom jerk - B");
        acceleration = acceleration.replace(/j3/g, "M205 X"+c2+" Y"+c3+" ; custom jerk - C");
        acceleration = acceleration.replace(/j4/g, "M205 X"+d2+" Y"+d3+" ; custom jerk - D");
        acceleration = acceleration.replace(/j5/g, "M205 X"+e2+" Y"+e3+" ; custom jerk - E");
        acceleration = acceleration.replace(/j6/g, "M205 X"+f2+" Y"+f3+" ; custom jerk - F");
    } else {
        acceleration = acceleration.replace(/j1/g, "M205 J"+a4+" ; custom junction deviation - A");
        acceleration = acceleration.replace(/j2/g, "M205 J"+b4+" ; custom junction deviation - B");
        acceleration = acceleration.replace(/j3/g, "M205 J"+c4+" ; custom junction deviation - C");
        acceleration = acceleration.replace(/j4/g, "M205 J"+d4+" ; custom junction deviation - D");
        acceleration = acceleration.replace(/j5/g, "M205 J"+e4+" ; custom junction deviation - E");
        acceleration = acceleration.replace(/j6/g, "M205 J"+f4+" ; custom junction deviation - F");
    }
    if(document.accelerationForm.start.checked == true) {
        acceleration = acceleration.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    downloadFile('acceleration.gcode', acceleration);
}
