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
    if(target == "first"){
        if(ticked == false){
            $("#firstlayerXY").show();
            $("#firstlayerdia").hide();
        } else {
            $("#firstlayerXY").hide();
            $("#firstlayerdia").show();
        }
    } else {
        if(ticked == true){
            $(target).hide();
        } else {
            $(target).show();
        }
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

function xyzsteps(){
    var targetAxis = document.xyzstepsForm.xyzAxis.value;
    var oldSteps = document.xyzstepsForm.oldXYZSteps.value;
    var requested = document.xyzstepsForm.requested.value;
    var measured = document.xyzstepsForm.measured.value;
    var newsteps = (oldSteps/measured*requested).toFixed(2);
    $("#xyzAxis1").html(targetAxis);
    $("#xyzAxis2").html(targetAxis);
    $("#xyz").html(newsteps);
    $("#xyz2").html(newsteps);
    $("#xyzstepsresult").show();
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

function updateFeeds(feedrate) {
    $('.perimFeed').html(Math.round(feedrate*0.6));
    $('.solidFeed').html(Math.round(feedrate*0.8));
    $('.travelFeed').html(Math.round(feedrate*1.67));
    $('.firstFeed').html(Math.round(feedrate*0.5));
}

function processGcode(formName) {
    var name = formName.name;
    var description = formName.description.value;
    var nozzleLayer = formName.nozzleLayer.value;
    var bedTemp = formName.bedtemp.value;
    var centre = formName.centre.checked;
    if(name == "firstlayerForm"){
        var bedX = formName.bedx.value - 60;
        var bedY = formName.bedy.value - 60;
        var bedRad = Math.round((formName.beddia.value)/2);
    } else {
        var bedX = Math.round((formName.bedx.value-120)/2);
        var bedY = Math.round((formName.bedy.value-120)/2);
    }
    var abl = formName.abl.value;
    var customStart = formName.startgcode.value;
    var customEnd = formName.endgcode.value;
    if(name != "firstlayerForm"){
        var fanLayer = formName.fanLayer.value;
        var fanPercentage = formName.fanSpeed.value;
        var fanSpeed = Math.round(fanPercentage*2.55);
    }
    if(name == "temperatureForm"){
        var hotendTemp = formName.temp_a0.value;
        var a1 = formName.temp_a1.value;
        var b1 = formName.temp_b1.value;
        var c1 = formName.temp_c1.value;
        var d1 = formName.temp_d1.value;
        var e1 = formName.temp_e1.value;
    } else {
        var hotendTemp = formName.hotendtemp.value;
    }
    // first layer test specifics
    if(name == "firstlayerForm"){
        var margin = parseInt(formName.margin.value);
        var offsets = [0,0,0,0,0,0,0,0,0,0];
        var delt = 30;
        var xy = 30;
        var squares;
        if(centre == true) {
            // left
            offsets[0] = (bedRad*-1) - 60 + delt + margin;
            offsets[1] = -60;
            // bottom
            offsets[2] = -60;
            offsets[3] = (bedRad*-1) - 60 + delt + margin;
            // centre
            offsets[4] = -60;
            offsets[5] = -60;
            // top
            offsets[6] = -60;
            offsets[7] = (bedRad - 60 - delt) - margin;
            //right
            offsets[8] = (bedRad - 60 - delt) - margin;
            offsets[9] = -60;
        } else {
            // bottom left
            offsets[0] = 0 + xy - 60 + margin;
            offsets[1] = 0 + xy - 60 + margin;
            // top left
            offsets[2] = 0 + xy - 60 + margin;
            offsets[3] = bedY - xy - margin;
            // centre
            offsets[4] = bedX/2 - 30;
            offsets[5] = bedY/2 - 30;
            // bottom right
            offsets[6] = bedX - xy - margin;
            offsets[7] = 0 + xy - 60 + margin;
            // top right
            offsets[8] = bedX - xy - margin;
            offsets[9] = bedY - xy - margin;
        }
    }
    // collect retraction inputs
    if(name == "retractionForm") {
        var a1 = formName.ret_a1.value;
        var a2 = formName.ret_a2.value*60;
        var a3 = formName.ret_a3.value;
        var a4 = formName.ret_a4.value*60;
        var a5 = formName.ret_a5.value;
        var b1 = formName.ret_b1.value;
        var b2 = formName.ret_b2.value*60;
        var b3 = formName.ret_b3.value;
        var b4 = formName.ret_b4.value*60;
        var b5 = formName.ret_b5.value;
        var c1 = formName.ret_c1.value;
        var c2 = formName.ret_c2.value*60;
        var c3 = formName.ret_c3.value;
        var c4 = formName.ret_c4.value*60;
        var c5 = formName.ret_c5.value;
        var d1 = formName.ret_d1.value;
        var d2 = formName.ret_d2.value*60;
        var d3 = formName.ret_d3.value;
        var d4 = formName.ret_d4.value*60;
        var d5 = formName.ret_d5.value;
        var e1 = formName.ret_e1.value;
        var e2 = formName.ret_e2.value*60;
        var e3 = formName.ret_e3.value;
        var e4 = formName.ret_e4.value*60;
        var e5 = formName.ret_e5.value;
        var f1 = formName.ret_f1.value;
        var f2 = formName.ret_f2.value*60;
        var f3 = formName.ret_f3.value;
        var f4 = formName.ret_f4.value*60;
        var f5 = formName.ret_f5.value;
    } else {
        var retDist = formName.retdist.value;
        var retDistExtra = formName.retdistextra.value;
        var retSpeed = formName.retspeed.value*60;
        var zhop = formName.zhop.value;
    }
    // collect acceleration inputs
    if(name == "accelerationForm"){
        var inner = formName.innerFeedrate.value*60;
        var outer = formName.outerFeedrate.value*60;
        var jerk_or_jd = formName.jerk_or_jd.value;
        var a1 = formName.accel_a1.value;
        var a2 = formName.accel_a2.value;
        var a3 = formName.accel_a3.value;
        var a4 = formName.accel_a4.value;
        var a5 = formName.accel_a5.value;
        var b1 = formName.accel_b1.value;
        var b2 = formName.accel_b2.value;
        var b3 = formName.accel_b3.value;
        var b4 = formName.accel_b4.value;
        var b5 = formName.accel_b5.value;
        var c1 = formName.accel_c1.value;
        var c2 = formName.accel_c2.value;
        var c3 = formName.accel_c3.value;
        var c4 = formName.accel_c4.value;
        var c5 = formName.accel_c5.value;
        var d1 = formName.accel_d1.value;
        var d2 = formName.accel_d2.value;
        var d3 = formName.accel_d3.value;
        var d4 = formName.accel_d4.value;
        var d5 = formName.accel_d5.value;
        var e1 = formName.accel_e1.value;
        var e2 = formName.accel_e2.value;
        var e3 = formName.accel_e3.value;
        var e4 = formName.accel_e4.value;
        var e5 = formName.accel_e5.value;
        var f1 = formName.accel_f1.value;
        var f2 = formName.accel_f2.value;
        var f3 = formName.accel_f3.value;
        var f4 = formName.accel_f4.value;
        var f5 = formName.accel_f5.value;
    } else {
        var feed = formName.baseFeedrate.value*60;
        var feedMod = feed/3600;
    }
    // process start gcode
    var gcode;
    if((formName.start.checked == true) && (formName.customStartOnly.checked == true)){
        gcode = ";customstart";    
    } else {
        gcode = commonStart;
    }    
    // bed temp
    if(bedTemp == 0){
         gcode = gcode.replace(/;bed0a/g, "; no heated bed");
         gcode = gcode.replace(/;bed0b/g, "; no heated bed");
    } else {
        gcode = gcode.replace(/;bed0a/g, "M140 S"+bedTemp+" ; custom bed temp");
        gcode = gcode.replace(/;bed0b/g, "M190 S"+bedTemp+" ; custom bed temp");
    }
    // start hot end emp
    if(abl != 4){
         gcode = gcode.replace(/;temp0a/g, "M104 S"+hotendTemp+" T0 ; custom hot end temp");
         gcode = gcode.replace(/;temp0b/g, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    } else {
        gcode = gcode.replace(/;temp0a/g, "; Prusa Mini");
        gcode = gcode.replace(/;temp0b\n/g, "");
     }
    // abl
    if(abl == 1){
         gcode = gcode.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
         gcode =  gcode.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        gcode = gcode.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level");
        gcode = gcode.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling");
    }
    if(abl == 4){
        gcode = gcode.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        gcode = gcode.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        gcode = gcode.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    }
    if(abl == 5){
        gcode = gcode.replace(/;G29 ; probe ABL/, "G29 L0 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }
    if(abl == 6){
        gcode = gcode.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }
    if(abl == 7){
        gcode = gcode.replace(/;G29 ; probe ABL/, "G29 L2 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }
    // firstlayer test square array
    if(name == "firstlayerForm"){
        var squares = "";
        var originalSquare = firstlayer[nozzleLayer];
        for(var i = 0; i <= 4; i++){
            var square = "\n; square "+(i+1)+originalSquare;
            var firstlayerArray = square.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            firstlayerArray.forEach(function(index, item){
                if(firstlayerArray[item].search(/X/) > -1){
                    var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2];
                    firstlayerArray[item] = firstlayerArray[item].replace(regexp, "X"+String(value.toFixed(4)));
                }
            });
            var regexp = /Y[0-9\.]+/;
            firstlayerArray.forEach(function(index, item){
                if(firstlayerArray[item].search(/Y/) > -1){
                    var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2+1];
                    firstlayerArray[item] = firstlayerArray[item].replace(regexp, "Y"+String(value.toFixed(4)))
                }
            });
            square = firstlayerArray.join("\n");
            squares += square;
        }
        gcode = gcode+squares;
        if(feedMod != 1){
            var gcodeArray = gcode.split(/\n/g);
            var regexp = /F[0-9]+/;
            gcodeArray.forEach(function(index, item){
                if(gcodeArray[item].search(/F/) > -1){
                    var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1));
                    if(value != 1200){
                        gcodeArray[item] = gcodeArray[item].replace(regexp, "F"+String(value*feedMod)+" ; custom feedrate")
                    }
                }
            });
            gcode = gcodeArray.join("\n");
        }
        gcode = gcode.replace(/;retract1\nG1 Z[0-9\.]+ F1200/g, ";retract1\n;zhop1");
            if(zhop > 0){
                gcode = gcode.replace(/;zhop1/g, "G91;\nG1 Z"+zhop+" F1200; custom z hop\nG90;");
            }  
        gcode = gcode.replace(/;retract1/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
        gcode = gcode.replace(/;unretract1/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");
    }
    // assign correct gcode source
    if(name == "baselineForm"){
        gcode += baseline[nozzleLayer];
    }
    if(name == "retractionForm"){
        gcode += retraction[nozzleLayer];
    }
    if(name == "temperatureForm"){
        gcode += temperature[nozzleLayer];
    }
    if(name == "accelerationForm"){
        gcode += acceleration[nozzleLayer];
    }
    // add end gcode
    if((formName.customEndOnly.checked == true) && (formName.end.checked == true)){
        gcode += ";customend\n";      
    } else {
        gcode += commonEnd;
    }    
    if(name != "firstlayerForm"){
        // strip original fan command
        gcode = gcode.replace(/M106 S3/, ";");
        // insert user fan starting layer and speed
        switch(fanLayer){
            case '2':
                gcode = gcode.replace(/;fan2;/, "M106 S"+fanSpeed+"; custom fan "+fanPercentage+"% from layer 2");
                break;
            case '3':
                gcode = gcode.replace(/;fan3;/, "M106 S"+fanSpeed+"; custom fan "+fanPercentage+"% from layer 3");
                break;
            case '5':
                gcode = gcode.replace(/;fan5;/, "M106 S"+fanSpeed+"; custom fan "+fanPercentage+"% from layer 5");
                break;
        }
        // insert user fan speed for resumption after 100% bridging
        gcode = gcode.replace(/M106 S3/g, "M106 S"+fanSpeed+"; custom fan "+fanSpeed+"%");
        // process gcode to suit bed size and type
        if(centre == true){
            var gcodeArray = gcode.split(/\n/g);
            var regexp = /X[0-9\.]+/;
            gcodeArray.forEach(function(index, item){
                if(gcodeArray[item].search(/X/) > -1){
                    var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1)) - 50;
                    gcodeArray[item] = gcodeArray[item].replace(regexp, "X"+String(value.toFixed(4)));
                }
            });
            var regexp = /Y[0-9\.]+/;
            gcodeArray.forEach(function(index, item){
                if(gcodeArray[item].search(/Y/) > -1){
                    var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1)) - 50;
                    gcodeArray[item] = gcodeArray[item].replace(regexp, "Y"+String(value.toFixed(4)))
                }
            });
            gcode = gcodeArray.join("\n");
        } else {
            if(bedX > 0){
                var gcodeArray = gcode.split(/\n/g);
                var regexp = /X[0-9\.]+/;
                gcodeArray.forEach(function(index, item){
                    if(gcodeArray[item].search(/X/) > -1){
                        var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1)) + bedX;
                        gcodeArray[item] = gcodeArray[item].replace(regexp, "X"+String(value.toFixed(4)));
                    }
                });
                gcode = gcodeArray.join("\n");
            }
            if(bedY > 0){  
                var gcodeArray = gcode.split(/\n/g);
                var regexp = /Y[0-9\.]+/;
                gcodeArray.forEach(function(index, item){
                    if(gcodeArray[item].search(/Y/) > -1){
                        var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1)) + bedY;
                        gcodeArray[item] = gcodeArray[item].replace(regexp, "Y"+String(value.toFixed(4)))
                    }
                });
                gcode = gcodeArray.join("\n");
            }   
        }
        // feedrate change
        if(name != "accelerationForm"){
            if(feedMod != 1){
                var gcodeArray = gcode.split(/\n/g);
                var regexp = /F[0-9]+/;
                gcodeArray.forEach(function(index, item){
                    if(gcodeArray[item].search(/F/) > -1){
                        var value = parseFloat(gcodeArray[item].match(regexp)[0].substring(1));
                        //alert(value);
                        if(value != 1200){
                            gcodeArray[item] = gcodeArray[item].replace(regexp, "F"+String(value*feedMod)+" ; custom feedrate")
                        }
                    }
                });
                gcode = gcodeArray.join("\n");
            }
        }

        // changes for acceleration test
        if(name == "accelerationForm"){
            // edit feedrates
            gcode = gcode.replace(/F3600/g, "F"+inner+" ; custom outer perimeter feedrate");
            gcode = gcode.replace(/F2880/g, "F"+inner+" ; custom outer perimeter feedrate");
            gcode = gcode.replace(/F2160/g, "F"+outer+" ; custom inner perimeter feedrate");
            // add acceleration segments
            gcode = gcode.replace(/;process Process-1/, "M201 X50000 Y50000 Z50000; custom raise acceleration limits\nM204 P"+a1+" T"+a1+" ; custom acceleration - A\n;j1");
            gcode = gcode.replace(/;process Process-2/, "M204 P"+b1+" T"+b1+" ; custom acceleration - B\n;j2");
            gcode = gcode.replace(/;process Process-3/, "M204 P"+c1+" T"+c1+" ; custom acceleration - C\n;j3");
            gcode = gcode.replace(/;process Process-4/, "M204 P"+d1+" T"+d1+" ; custom acceleration - D\n;j4");
            gcode = gcode.replace(/;process Process-5/, "M204 P"+e1+" T"+e1+" ; custom acceleration - E\n;j5");
            gcode = gcode.replace(/;process Process-6/, "M204 P"+f1+" T"+f1+" ; custom acceleration - F\n;j6");
            // add jerk/junction deviation segments
            if(jerk_or_jd == "jerk"){
                gcode = gcode.replace(/;j1/, "M205 X"+a2+" Y"+a3+" Z"+a5+" ; custom jerk - A");
                gcode = gcode.replace(/;j2/, "M205 X"+b2+" Y"+b3+" Z"+b5+" ; custom jerk - B");
                gcode = gcode.replace(/;j3/, "M205 X"+c2+" Y"+c3+" Z"+c5+" ; custom jerk - C");
                gcode = gcode.replace(/;j4/, "M205 X"+d2+" Y"+d3+" Z"+d5+" ; custom jerk - D");
                gcode = gcode.replace(/;j5/, "M205 X"+e2+" Y"+e3+" Z"+e5+" ; custom jerk - E");
                gcode = gcode.replace(/;j6/, "M205 X"+f2+" Y"+f3+" Z"+f5+" ; custom jerk - F");
            } else {
                gcode = gcode.replace(/;j1/, "M205 J"+a4+" ; custom junction deviation - A");
                gcode = gcode.replace(/;j2/, "M205 J"+b4+" ; custom junction deviation - B");
                gcode = gcode.replace(/;j3/, "M205 J"+c4+" ; custom junction deviation - C");
                gcode = gcode.replace(/;j4/, "M205 J"+d4+" ; custom junction deviation - D");
                gcode = gcode.replace(/;j5/, "M205 J"+e4+" ; custom junction deviation - E");
                gcode = gcode.replace(/;j6/, "M205 J"+f4+" ; custom junction deviation - F");
            }
        }
        // process user retraction
        if(name == "retractionForm"){
            // A section
            gcode = gcode.replace(/;retract1\nG1 Z[0-9\.]+ F1200/g, ";retract1\n;zhop1");
            if(a5 > 0){
                gcode = gcode.replace(/;zhop1/g, "G91\nG1 Z"+a5+" F1200 ; custom z hop - A\nG90");
            }
            gcode = gcode.replace(/;retract1/g, "G1 E-"+a1+" F"+a2+" ; custom retraction - A");
            gcode = gcode.replace(/;unretract1/g, "G1 E"+a3+" F"+a4+" ; custom un-retraction/prime - A");
            // B section
            gcode = gcode.replace(/;retract2\nG1 Z[0-9\.]+ F1200/g, ";retract2\n;zhop2");
            if(b5 > 0){
                gcode = gcode.replace(/;zhop2/g, "G91\nG1 Z"+b5+" F1200 ; custom z hop - B\nG90");
            }
            gcode = gcode.replace(/;retract2/g, "G1 E-"+b1+" F"+b2+" ; custom retraction - B");
            gcode = gcode.replace(/;unretract2/g, "G1 E"+b3+" F"+b4+" ; custom un-retraction/prime - B");
            // C section
            gcode = gcode.replace(/;retract3\nG1 Z[0-9\.]+ F1200/g, ";retract3\n;zhop3");
            if(c5 > 0){
                gcode = gcode.replace(/;zhop3/g, "G91\nG1 Z"+c5+" F1200 ; custom z hop - C\nG90");
            }   
            gcode = gcode.replace(/;retract3/g, "G1 E-"+c1+" F"+c2+" ; custom retraction - C");
            gcode = gcode.replace(/;unretract3/g, "G1 E"+c3+" F"+c4+" ; custom un-retraction/prime - C");
            // D section
            gcode = gcode.replace(/;retract4\nG1 Z[0-9\.]+ F1200/g, ";retract4\n;zhop4");
            if(d5 > 0){
                gcode = gcode.replace(/;zhop4/g, "G91\nG1 Z"+d5+" F1200 ; custom z hop - D\nG90");
            }    
            gcode = gcode.replace(/;retract4/g, "G1 E-"+d1+" F"+d2+" ; custom retraction - D");
            gcode = gcode.replace(/;unretract4/g, "G1 E"+d3+" F"+d4+" ; custom un-retraction/prime - D");
            // E section
            gcode = gcode.replace(/;retract5\nG1 Z[0-9\.]+ F1200/g, ";retract5\n;zhop5");
            if(e5 > 0){
                gcode = gcode.replace(/;zhop5/g, "G91\nG1 Z"+e5+" F1200 ; custom z hop - E\nG90");
            } 
            gcode = gcode.replace(/;retract5/g, "G1 E-"+e1+" F"+e2+" ; custom retraction - E");
            gcode = gcode.replace(/;unretract5/g, "G1 E"+e3+" F"+e4+" ; custom un-retraction/prime - E");
            // F section
            gcode = gcode.replace(/;retract6\nG1 Z[0-9\.]+ F1200/g, ";retract6\n;zhop6");
            if(f5 > 0){
                gcode = gcode.replace(/;zhop6/g, "G91\nG1 Z"+f5+" F1200 ; custom z hop - F\nG90");
            } 
            gcode = gcode.replace(/;retract6/g, "G1 E-"+f1+" F"+f2+" ; custom retraction - F");
            gcode = gcode.replace(/;unretract6/g, "G1 E"+f3+" F"+f4+" ; custom un-retraction/prime - F");
        } else {
            gcode = gcode.replace(/;retract1\nG1 Z[0-9\.]+ F1200/g, ";retract1\n;zhop1");
            if(zhop > 0){
                gcode = gcode.replace(/;zhop1/g, "G91;\nG1 Z"+zhop+" F1200; custom z hop\nG90;");
            }  
            gcode = gcode.replace(/;retract1/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
            gcode = gcode.replace(/;unretract1/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");
        }
        // temperature test user inputs
        if(name == "temperatureForm"){
            gcode = gcode.replace(/;layer 2(.*?)\n/, "M104 S"+a1+" T0 ; custom hot end temp - A\n");
            gcode = gcode.replace(/;process Process-2/, "M104 S"+b1+" T0 ; custom hot end temp - B");
            gcode = gcode.replace(/;process Process-3/, "M104 S"+c1+" T0 ; custom hot end temp - C");
            gcode = gcode.replace(/;process Process-4/, "M104 S"+d1+" T0 ; custom hot end temp - D");
            gcode = gcode.replace(/;process Process-5/, "M104 S"+e1+" T0 ; custom hot end temp - E");
        }
    }

    // final tweaks for start and end gcode
    if(formName.psuon.checked == true) {
        gcode = gcode.replace(/;M80/, "M80");
    }
    if(formName.removet0.checked == true) {
        gcode = gcode.replace(/T0\n/, ";T0\n");
    }
    if(formName.start.checked == true) {
        gcode = gcode.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    if(formName.end.checked == true) {
        gcode = gcode.replace(/;customend/, "; custom end gcode\n"+customEnd);
    }
    if(formName.deltaHome.checked == true) {
        gcode = gcode.replace(/G28 X0 ; home X axis/, "G28 ; home all on delta");
    }
    
    // process finished gcode file
    downloadFile(description+'.gcode', gcode);
}

function outputSettings(formName) {
    var fileName;
    var string = "Settings for ";
    switch(formName.name) {
        case "firstlayerForm":
            string += "first layer"
            fileName = "firstlayersettings.txt";
            break;
        case "baselineForm":
            string += "baseline print"
            fileName = "baselinesettings.txt";
            break;
        case "retractionForm":
            string += "retraction tuning"
            fileName = "retractionsettings.txt";
            break;
        case "temperatureForm":
            string += "temperature tuning"
            fileName = "temperaturesettings.txt";
            break;
        case "accelerationForm":
            string += "acceleration and jerk/junction deviation tuning"
            fileName = "accelerationsettings.txt";
            break;
    }
    string += " form\n_________________________________________________________________________\n\n";
    string += "G-Code originally generated by Simplify3D(R) Version 4.1.2\nThis calibration test gcode modified by the Teaching Tech Calibration website: https://teachingtechyt.github.io/calibration.html\n";
    string += "All changes are marked in the gcode with 'custom' at the end of each line. Open the gcode in a text editor and search for this to your check inputs if needed.\n\n";
    
    // Get selected value
    var nozzleLayer = formName.nozzleLayer.value;
    // Split Nozzle/Layer value
    const nozzleLayerArr = nozzleLayer.split("_");
    // Parse both values
    string += "\nNozzle diameter: " + nozzleLayerArr[0]/100+" mm";
    string += "\nLayer height: " + nozzleLayerArr[1]/100+" mm\n";

    if(formName.psuon.checked == true) {
        string += "Turn on PSU with M80 active\n"
    }
    if(formName.removet0.checked == true) {
        string += "T0 command removed\n"
    }
    if(formName.start.checked == true) {
        string += "Custom start gcode:\n";
        string += formName.startgcode.value+"\n";
    }
    string += "\nBed: ";
    if(formName.centre.checked == false) {
        string += formName.bedx.value+" x "+formName.bedy.value+" mm";
    } else {
        string += "0,0 at centre";
        if(formName.name == "firstlayerForm"){
            string += ", "+formName.beddia.value+" mm diameter";
        }
    }

    if(formName.baseFeedrate != undefined){
        string += "\n\nBase feedrate: "+formName.baseFeedrate.value+" mm/sec";
        string += "\nPerimeters: "+document.querySelector( ".perimFeed" ).innerText+" mm/sec";
        string += "\nSolid infill: "+document.querySelector( ".solidFeed" ).innerText+" mm/sec";
        string += "\nTravel moves: "+document.querySelector( ".travelFeed" ).innerText+" mm/sec";
        string += "\nFirst layer: "+document.querySelector( ".firstFeed" ).innerText+" mm/sec";
    }

    if(formName.name == "firstlayerForm") {
        string += "\nExtra margin from edge: "+formName.margin.value+" mm";
    }
    string += "\n\nTemperatures:\n";
    if(formName.name == "temperatureForm") {
        string += "Bed: "+formName.bedtemp.value+" deg C\n";
        string += "Segment E: "+formName.temp_e1.value+" deg C\n";
        string += "Segment D: "+formName.temp_d1.value+" deg C\n";
        string += "Segment C: "+formName.temp_c1.value+" deg C\n";
        string += "Segment B: "+formName.temp_b1.value+" deg C\n";
        string += "Segment A: "+formName.temp_a1.value+" deg C\n";
        string += "First Layer: "+formName.temp_a0.value+" deg C\n";
    } else {
        string += "Bed: "+formName.bedtemp.value+" deg C\n";
        string += "Hot end: "+formName.hotendtemp.value+" deg C\n";
    }
    if(formName.name != "firstlayerForm") {
        var fanSpeed = formName.fanSpeed.value;
        var fanLayer = formName.fanLayer.value
        string += "\n\nPart Cooling: "+fanSpeed+"% from layer "+fanLayer+"\n";
    }
    var ablSelected = formName.abl.value;
    string += "\n\nABL: "+formName.abl[ablSelected].text;
    if(formName.name == "retractionForm") {
        string += "\n\nSegment | Retraction distance | Retraction speed | Extra restart distance | Unretract speed | Z hop\n";
        string += "   F    |          "+formName.ret_f1.value+" mm       |     "+formName.ret_f2.value+" mm/sec    |        "+formName.ret_f3.value+"       mm      | "+formName.ret_f4.value+" mm/sec       |  "+formName.ret_f5.value+" mm\n";
        string += "   E    |          "+formName.ret_e1.value+" mm       |     "+formName.ret_e2.value+" mm/sec    |        "+formName.ret_e3.value+"       mm      | "+formName.ret_e4.value+" mm/sec       |  "+formName.ret_e5.value+" mm\n";
        string += "   D    |          "+formName.ret_d1.value+" mm       |     "+formName.ret_d2.value+" mm/sec    |        "+formName.ret_d3.value+"       mm      | "+formName.ret_d4.value+" mm/sec       |  "+formName.ret_d5.value+" mm\n";
        string += "   C    |          "+formName.ret_c1.value+" mm       |     "+formName.ret_c2.value+" mm/sec    |        "+formName.ret_c3.value+"       mm      | "+formName.ret_c4.value+" mm/sec       |  "+formName.ret_c5.value+" mm\n";
        string += "   B    |          "+formName.ret_b1.value+" mm       |     "+formName.ret_b2.value+" mm/sec    |        "+formName.ret_b3.value+"       mm      | "+formName.ret_b4.value+" mm/sec       |  "+formName.ret_b5.value+" mm\n";
        string += "   A    |          "+formName.ret_a1.value+" mm       |     "+formName.ret_a2.value+" mm/sec    |        "+formName.ret_a3.value+"       mm      | "+formName.ret_a4.value+" mm/sec       |  "+formName.ret_a5.value+" mm\n";
    } else {
        string += "\n\nRetraction distance: "+formName.retdist.value+" mm\n";
        string += "Retraction speed: "+formName.retspeed.value+" mm/sec\n";
        string += "Extra restart distance: "+formName.retdistextra.value+" mm\n";
        string += "Z hop: "+formName.zhop.value+" mm\n";
    }
    if(formName.name == "accelerationForm") {
        string += "\nInner perimeter feedrate: "+formName.innerFeedrate.value+" mm/s";
        string += "\nOuter perimeter feedrate: "+formName.outerFeedrate.value+" mm/s\n\n";
        var jjd = formName.jerk_or_jd.value;
        if(jjd == "jerk") {
            string += "Segment | M204 P Acceleration |  M205 Jerk X  |  M205 Jerk Y|  M205 Jerk Z   \n";
            string += "   F    |    "+formName.accel_f1.value+" mm/sec/sec   |     "+formName.accel_f2.value+" mm      |     "+formName.accel_f3.value+" mm      |     "+formName.accel_f5.value+" mm\n";
            string += "   E    |    "+formName.accel_e1.value+" mm/sec/sec   |     "+formName.accel_e2.value+" mm      |     "+formName.accel_e3.value+" mm      |     "+formName.accel_e5.value+" mm\n";
            string += "   D    |    "+formName.accel_d1.value+" mm/sec/sec   |     "+formName.accel_d2.value+" mm      |     "+formName.accel_d3.value+" mm      |     "+formName.accel_d5.value+" mm\n";
            string += "   C    |    "+formName.accel_c1.value+" mm/sec/sec   |     "+formName.accel_c2.value+" mm      |     "+formName.accel_c3.value+" mm      |     "+formName.accel_c5.value+" mm\n";
            string += "   B    |    "+formName.accel_b1.value+" mm/sec/sec   |     "+formName.accel_b2.value+" mm      |     "+formName.accel_b3.value+" mm      |     "+formName.accel_b5.value+" mm\n";
            string += "   A    |    "+formName.accel_a1.value+" mm/sec/sec   |     "+formName.accel_a2.value+" mm      |     "+formName.accel_a3.value+" mm      |     "+formName.accel_a5.value+" mm\n";
        } else {
            string += "Segment | M204 P Acceleration |  M205 Junction Deviation\n";
            string += "   F    |    "+formName.accel_f1.value+" mm/sec/sec   |          "+formName.accel_f4.value+"\n";
            string += "   E    |    "+formName.accel_e1.value+" mm/sec/sec   |          "+formName.accel_e4.value+"\n";
            string += "   D    |    "+formName.accel_d1.value+" mm/sec/sec   |          "+formName.accel_d4.value+"\n";
            string += "   C    |    "+formName.accel_c1.value+" mm/sec/sec   |          "+formName.accel_c4.value+"\n";
            string += "   B    |    "+formName.accel_b1.value+" mm/sec/sec   |          "+formName.accel_b4.value+"\n";
            string += "   A    |    "+formName.accel_a1.value+" mm/sec/sec   |          "+formName.accel_a4.value+"\n";
        }
    }  
    downloadFile(fileName, string);
}
