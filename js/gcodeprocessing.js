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
    if(abl == 1){
        baseline = baseline.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        baseline =  baseline.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        baseline = baseline.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level")
        baseline = baseline.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling")
    }
    baseline = baseline.replace(/M140 S60/g, "M140 S"+bedTemp);
    baseline = baseline.replace(/M190 S60/g, "M140 S"+bedTemp);
    baseline = baseline.replace(/M104 S210/g, "M104 S"+hotendTemp);
    baseline = baseline.replace(/M109 S210/g, "M109 S"+hotendTemp);
    baseline = baseline.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed);
    baseline = baseline.replace(/G1 E0.0000 F2400/g, "G1 E0.0000 F"+retSpeed);

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
    retraction = retraction.replace(/M140 S60/g, "M140 S"+bedTemp);
    retraction = retraction.replace(/M190 S60/g, "M140 S"+bedTemp);
    retraction = retraction.replace(/M104 S210/g, "M104 S"+hotendTemp);
    retraction = retraction.replace(/M109 S210/g, "M109 S"+hotendTemp);
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
    temperature = temperature.replace(/M140 S60/g, "M140 S"+bedTemp);
    temperature = temperature.replace(/M190 S60/g, "M140 S"+bedTemp);
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
    temperature = temperature.replace(/M104 S190/g, "M104 S"+a1);
    temperature = temperature.replace(/M109 S190/g, "M109 S"+a1);
    temperature = temperature.replace(/M109 S195/g, "M109 S"+b1);
    temperature = temperature.replace(/M109 S200/g, "M109 S"+c1);
    temperature = temperature.replace(/M109 S205/g, "M109 S"+d1);
    temperature = temperature.replace(/M109 S210/g, "M109 S"+e1);
    downloadFile('temperature.gcode', temperature);
}


