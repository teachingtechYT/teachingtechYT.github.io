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
    var oldflow = document.flow1.oldFlow.value;
    var targetwall = document.flow1.targetWall.value;
    var measuredwall = document.flow1.measuredWall.value;
    var newsteps = (oldflow/measuredwall*targetwall).toFixed(2);
    $("#f1").html(newsteps);
    $("#flow1result").show();
}

function flowCalc2(){
    var oldflow = document.flow2.oldFlow.value;
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
    var value = document.accelerationForm.selector.value;
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
    var baseline = originalBaseline;
    if(pc == 1){
        baseline = baseline.replace(/M106 S255/, "M106 S130");
    }
    if(pc == 2){
        baseline =  baseline.replace(/M106 S255/, ";M106 S255");
    }
    baseline = baseline.replace(/M140 S60/g, "M140 S"+bedTemp);
    baseline = baseline.replace(/M190 S60/g, "M190 S"+bedTemp);
    if(abl != 4){
        baseline = baseline.replace(/M104 S210/g, "M104 S"+hotendTemp);
        baseline = baseline.replace(/M109 S210/g, "M109 S"+hotendTemp);
    } else {
        baseline = baseline.replace(/M104 S210/g, "; Prusa Mini");
        baseline = baseline.replace(/M109 S210/g, "; Prusa Mini");
    }
    baseline = baseline.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed);
    baseline = baseline.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed);
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
        baseline = baseline.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0");
    }
    if(abl == 5){
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 L1 Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var baselineArray = baseline.split(/\n/g);
        var regexp = /X\d+/;
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/X/) > -1){
                var value = parseInt(baselineArray[item].match(regexp)[0].substring(1)) - 50;
                baselineArray[item] = baselineArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y\d+/;
        baselineArray.forEach(function(index, item){
            if(baselineArray[item].search(/Y/) > -1){
                var value = parseInt(baselineArray[item].match(regexp)[0].substring(1)) - 50;
                baselineArray[item] = baselineArray[item].replace(regexp, "Y"+String(value))
            }
        });
        baseline = baselineArray.join("\n");
    } else {
        if(bedX > 0){
            var baselineArray = baseline.split(/\n/g);
            var regexp = /X\d+/;
            baselineArray.forEach(function(index, item){
                if(baselineArray[item].search(/X/) > -1){
                    var value = parseInt(baselineArray[item].match(regexp)[0].substring(1)) + bedX;
                    baselineArray[item] = baselineArray[item].replace(regexp, "X"+String(value));
                }
            });
            baseline = baselineArray.join("\n");
        }
        if(bedY > 0){  
            var baselineArray = baseline.split(/\n/g);
            var regexp = /Y\d+/;
            baselineArray.forEach(function(index, item){
                if(baselineArray[item].search(/Y/) > -1){
                    var value = parseInt(baselineArray[item].match(regexp)[0].substring(1)) + bedY;
                    baselineArray[item] = baselineArray[item].replace(regexp, "Y"+String(value))
                }
            });
            baseline = baselineArray.join("\n");
        }   
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
    var a1 = document.retractionForm.a1.value;
    var a2 = document.retractionForm.a2.value*60;
    var a3 = document.retractionForm.a3.value;
    var b1 = document.retractionForm.b1.value;
    var b2 = document.retractionForm.b2.value*60;
    var b3 = document.retractionForm.b3.value;
    var c1 = document.retractionForm.c1.value;
    var c2 = document.retractionForm.c2.value*60;
    var c3 = document.retractionForm.c3.value;
    var d1 = document.retractionForm.d1.value;
    var d2 = document.retractionForm.d2.value*60;
    var d3 = document.retractionForm.d3.value;
    var e1 = document.retractionForm.e1.value;
    var e2 = document.retractionForm.e2.value*60;
    var e3 = document.retractionForm.e3.value;
    var f1 = document.retractionForm.f1.value;
    var f2 = document.retractionForm.f2.value*60;
    var f3 = document.retractionForm.f3.value;
    var retraction = originalRetraction;
    if(pc == 1){
        retraction = retraction.replace(/M106 S255/, "M106 S130");
    }
    if(pc == 2){
        retraction =  retraction.replace(/M106 S255/, ";M106 S255");
    }
    retraction = retraction.replace(/M140 S60/g, "M140 S"+bedTemp);
    retraction = retraction.replace(/M190 S60/g, "M190 S"+bedTemp);
    if(abl != 4){
        retraction = retraction.replace(/M104 S210/g, "M104 S"+hotendTemp);
        retraction = retraction.replace(/M109 S210/g, "M109 S"+hotendTemp);
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
        retraction = retraction.replace(/G28 ; home all axes/, "M109 S170 ; probing temperature\nG28 ; home all");
        retraction = retraction.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        retraction = retraction.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0");
    }
    if(abl == 5){
        retraction = retraction.replace(/;G29 ; probe ABL/, "G29 L1 Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var retractionArray = retraction.split(/\n/g);
        var regexp = /X\d+/;
        retractionArray.forEach(function(index, item){
            if(retractionArray[item].search(/X/) > -1){
                var value = parseInt(retractionArray[item].match(regexp)[0].substring(1)) - 50;
                retractionArray[item] = retractionArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y\d+/;
        retractionArray.forEach(function(index, item){
            if(retractionArray[item].search(/Y/) > -1){
                var value = parseInt(retractionArray[item].match(regexp)[0].substring(1)) - 50;
                retractionArray[item] = retractionArray[item].replace(regexp, "Y"+String(value))
            }
        });
        retraction = retractionArray.join("\n");
    } else {
        if(bedX > 0){
            var retractionArray = retraction.split(/\n/g);
            var regexp = /X\d+/;
            retractionArray.forEach(function(index, item){
                if(retractionArray[item].search(/X/) > -1){
                    var value = parseInt(retractionArray[item].match(regexp)[0].substring(1)) + bedX;
                    retractionArray[item] = retractionArray[item].replace(regexp, "X"+String(value));
                }
            });
            retraction = retractionArray.join("\n");
        }
        if(bedY > 0){  
            var retractionArray = retraction.split(/\n/g);
            var regexp = /Y\d+/;
            retractionArray.forEach(function(index, item){
                if(retractionArray[item].search(/Y/) > -1){
                    var value = parseInt(retractionArray[item].match(regexp)[0].substring(1)) + bedY;
                    retractionArray[item] = retractionArray[item].replace(regexp, "Y"+String(value))
                }
            });
            retraction = retractionArray.join("\n");
        }   
    }
    // A section
    retraction = retraction.replace(/G1 E-6.0000 F900/g, "G1 E-"+a1+" F"+a2);
    retraction = retraction.replace(/G1 E0.4000 F900/g, "G1 E"+a3+" F"+a2);
    // B section
    retraction = retraction.replace(/G1 E-7.0000 F1200/g, "G1 E-"+b1+" F"+b2);
    retraction = retraction.replace(/G1 E0.6000 F1200/g, "G1 E"+b3+" F"+b2);
    // C section
    retraction = retraction.replace(/G1 E-8.0000 F1500/g, "G1 E-"+c1+" F"+c2);
    retraction = retraction.replace(/G1 E0.8000 F1500/g, "G1 E"+c3+" F"+c2);
    // D section
    retraction = retraction.replace(/G1 E-9.0000 F1800/g, "G1 E-"+d1+" F"+d2);
    retraction = retraction.replace(/G1 E1.0000 F1800/g, "G1 E"+d3+" F"+d2);
    // E section
    retraction = retraction.replace(/G1 E-10.0000 F2100/g, "G1 E-"+e1+" F"+e2);
    retraction = retraction.replace(/G1 E1.2000 F2100/g, "G1 E"+e3+" F"+e2);
    // F section
    retraction = retraction.replace(/G1 E-11.0000 F2400/g, "G1 E-"+f1+" F"+f2);
    retraction = retraction.replace(/G1 E1.4000 F2400/g, "G1 E"+f3+" F"+f2);
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
    var a1 = document.temperatureForm.a1.value;
    var b1 = document.temperatureForm.b1.value;
    var c1 = document.temperatureForm.c1.value;
    var d1 = document.temperatureForm.d1.value;
    var e1 = document.temperatureForm.e1.value;
    var temperature = originalTemperature;
    if(pc == 1){
        temperature = temperature.replace(/M106 S255/, "M106 S130");
    }
    if(pc == 2){
        temperature =  temperature.replace(/M106 S255/, ";M106 S255");
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
        temperature = temperature.replace(/;M420 S1 ; restore ABL mesh/, "M109 S500 T0");
    }
    if(abl == 5){
        temperature = temperature.replace(/;G29 ; probe ABL/, "G29 L1 Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }
    temperature = temperature.replace(/M140 S60/g, "M140 S"+bedTemp);
    temperature = temperature.replace(/M190 S60/g, "M190 S"+bedTemp);
    temperature = temperature.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed);
    temperature = temperature.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed);

    if(centre == true){
        var temperatureArray = temperature.split(/\n/g);
        var regexp = /X\d+/;
        temperatureArray.forEach(function(index, item){
            if(temperatureArray[item].search(/X/) > -1){
                var value = parseInt(temperatureArray[item].match(regexp)[0].substring(1)) - 50;
                temperatureArray[item] = temperatureArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y\d+/;
        temperatureArray.forEach(function(index, item){
            if(temperatureArray[item].search(/Y/) > -1){
                var value = parseInt(temperatureArray[item].match(regexp)[0].substring(1)) - 50;
                temperatureArray[item] = temperatureArray[item].replace(regexp, "Y"+String(value))
            }
        });
        temperature = temperatureArray.join("\n");
    } else {
        if(bedX > 0){
            var temperatureArray = temperature.split(/\n/g);
            var regexp = /X\d+/;
            temperatureArray.forEach(function(index, item){
                if(temperatureArray[item].search(/X/) > -1){
                    var value = parseInt(temperatureArray[item].match(regexp)[0].substring(1)) + bedX;
                    temperatureArray[item] = temperatureArray[item].replace(regexp, "X"+String(value));
                }
            });
            temperature = temperatureArray.join("\n");
        }
        if(bedY > 0){  
            var temperatureArray = temperature.split(/\n/g);
            var regexp = /Y\d+/;
            temperatureArray.forEach(function(index, item){
                if(temperatureArray[item].search(/Y/) > -1){
                    var value = parseInt(temperatureArray[item].match(regexp)[0].substring(1)) + bedY;
                    temperatureArray[item] = temperatureArray[item].replace(regexp, "Y"+String(value))
                }
            });
            temperature = temperatureArray.join("\n");
        }   
    }
    if(abl != 4){
        temperature = temperature.replace(/M104 S190/g, "M104 S"+a1);
        temperature = temperature.replace(/M109 S190/g, "M109 S"+a1);
    } else {
        temperature = temperature.replace(/M104 S190/g, "; Prusa Mini");
        temperature = temperature.replace(/M109 S190/g, "; Prusa Mini");
        temperature = temperature.replace(/M109 S500/g, "M109 S"+a1);
    }
    temperature = temperature.replace(/M104 S195/g, "M104 S"+b1);
    temperature = temperature.replace(/M104 S200/g, "M104 S"+c1);
    temperature = temperature.replace(/M104 S205/g, "M104 S"+d1);
    temperature = temperature.replace(/M104 S210/g, "M104 S"+e1);
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
    var selector = document.accelerationForm.selector.value;
    var a1 = document.accelerationForm.a1.value;
    var a2 = document.accelerationForm.a2.value;
    var a3 = document.accelerationForm.a3.value;
    var a4 = document.accelerationForm.a4.value;
    var b1 = document.accelerationForm.b1.value;
    var b2 = document.accelerationForm.b2.value;
    var b3 = document.accelerationForm.b3.value;
    var b4 = document.accelerationForm.b4.value;
    var c1 = document.accelerationForm.c1.value;
    var c2 = document.accelerationForm.c2.value;
    var c3 = document.accelerationForm.c3.value;
    var c4 = document.accelerationForm.c4.value;
    var d1 = document.accelerationForm.d1.value;
    var d2 = document.accelerationForm.d2.value;
    var d3 = document.accelerationForm.d3.value;
    var d4 = document.accelerationForm.d4.value;
    var e1 = document.accelerationForm.e1.value;
    var e2 = document.accelerationForm.e2.value;
    var e3 = document.accelerationForm.e3.value;
    var e4 = document.accelerationForm.e4.value;
    var f1 = document.accelerationForm.f1.value;
    var f2 = document.accelerationForm.f2.value;
    var f3 = document.accelerationForm.f3.value;
    var f4 = document.accelerationForm.f4.value;
    var acceleration = originalAcceleration;
    if(pc == 1){
        acceleration = acceleration.replace(/M106 S255/, "M106 S130");
    }
    if(pc == 2){
        acceleration =  acceleration.replace(/M106 S255/, ";M106 S255");
    }
    acceleration = acceleration.replace(/M140 S60/g, "M140 S"+bedTemp);
    acceleration = acceleration.replace(/M190 S60/g, "M140 S"+bedTemp);
    if(abl != 4){
        acceleration = acceleration.replace(/M104 S210/g, "M104 S"+hotendTemp);
        acceleration = acceleration.replace(/M109 S210/g, "M109 S"+hotendTemp);
    } else {
        acceleration = acceleration.replace(/M104 S210/g, "; Prusa Mini");
        acceleration = acceleration.replace(/M109 S210/g, "; Prusa Mini");
    }
    acceleration = acceleration.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed);
    acceleration = acceleration.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed);
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
        acceleration = acceleration.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0");
    }
    if(abl == 5){
        acceleration = acceleration.replace(/;G29 ; probe ABL/, "G29 L1 Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    if(centre == true){
        var accelerationArray = acceleration.split(/\n/g);
        var regexp = /X\d+/;
        accelerationArray.forEach(function(index, item){
            if(accelerationArray[item].search(/X/) > -1){
                var value = parseInt(accelerationArray[item].match(regexp)[0].substring(1)) - 50;
                accelerationArray[item] = accelerationArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y\d+/;
        accelerationArray.forEach(function(index, item){
            if(accelerationArray[item].search(/Y/) > -1){
                var value = parseInt(accelerationArray[item].match(regexp)[0].substring(1)) - 50;
                accelerationArray[item] = accelerationArray[item].replace(regexp, "Y"+String(value))
            }
        });
        acceleration = accelerationArray.join("\n");
    } else {
        if(bedX > 0){
            var accelerationArray = acceleration.split(/\n/g);
            var regexp = /X\d+/;
            accelerationArray.forEach(function(index, item){
                if(accelerationArray[item].search(/X/) > -1){
                    var value = parseInt(accelerationArray[item].match(regexp)[0].substring(1)) + bedX;
                    accelerationArray[item] = accelerationArray[item].replace(regexp, "X"+String(value));
                }
            });
            acceleration = accelerationArray.join("\n");
        }
        if(bedY > 0){  
            var accelerationArray = acceleration.split(/\n/g);
            var regexp = /Y\d+/;
            accelerationArray.forEach(function(index, item){
                if(accelerationArray[item].search(/Y/) > -1){
                    var value = parseInt(accelerationArray[item].match(regexp)[0].substring(1)) + bedY;
                    accelerationArray[item] = accelerationArray[item].replace(regexp, "Y"+String(value))
                }
            });
            acceleration = accelerationArray.join("\n");
        }   
    }

    acceleration = acceleration.replace(/F3720/g, "F"+feed);
    acceleration = acceleration.replace(/F2790/g, "F"+feed);
    acceleration = acceleration.replace(/F1860/g, "F"+feed/2);

    acceleration = acceleration.replace(/raise/g, "M201 X5000 Y5000");
    acceleration = acceleration.replace(/accel1/g, "M204 P"+a1);
    acceleration = acceleration.replace(/accel2/g, "M204 P"+b1);
    acceleration = acceleration.replace(/accel3/g, "M204 P"+c1);
    acceleration = acceleration.replace(/accel4/g, "M204 P"+d1);
    acceleration = acceleration.replace(/accel5/g, "M204 P"+e1);
    acceleration = acceleration.replace(/accel6/g, "M204 P"+f1);

    if(selector == "jerk"){
        acceleration = acceleration.replace(/j1/g, "M205 X"+a2+" Y"+a3);
        acceleration = acceleration.replace(/j2/g, "M205 J"+b2+" Y"+b3);
        acceleration = acceleration.replace(/j3/g, "M205 J"+c2+" Y"+c3);
        acceleration = acceleration.replace(/j4/g, "M205 J"+d2+" Y"+d3);
        acceleration = acceleration.replace(/j5/g, "M205 J"+e2+" Y"+e3);
        acceleration = acceleration.replace(/j6/g, "M205 J"+f2+" Y"+f3);
    } else {
        acceleration = acceleration.replace(/j1/g, "M205 J"+a4);
        acceleration = acceleration.replace(/j2/g, "M205 J"+b4);
        acceleration = acceleration.replace(/j3/g, "M205 J"+c4);
        acceleration = acceleration.replace(/j4/g, "M205 J"+d4);
        acceleration = acceleration.replace(/j5/g, "M205 J"+e4);
        acceleration = acceleration.replace(/j6/g, "M205 J"+f4);
    }
    downloadFile('acceleration.gcode', acceleration);
}