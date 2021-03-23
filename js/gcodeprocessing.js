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

function processFirstlayer(){
    var hotendTemp = document.firstlayerForm.hotendtemp.value;
    var bedTemp = document.firstlayerForm.bedtemp.value;
    var centre = document.firstlayerForm.centre.checked;
    var bedX = document.firstlayerForm.bedx.value - 50;
    var bedY = document.firstlayerForm.bedy.value - 50;
    var bedRad = Math.round((document.firstlayerForm.beddia.value)/2);
    var retDist = document.firstlayerForm.retdist.value;
    var retDistExtra = document.firstlayerForm.retdistextra.value;
    var retSpeed = document.firstlayerForm.retspeed.value*60;
    var abl = document.firstlayerForm.abl.value;
    var customStart = document.firstlayerForm.startgcode.value;
    var firstlayer = "";
    var firstlayerStart = originalFirstlayerStart;
    var skirts = "";
    var squares = "";
    var firstlayerEnd = originalFirstlayerEnd;
    var offsets = [0,0,0,0,0,0,0,0,0,0];
    var delt = 30;
    var xy = 30;
    var margin = parseInt(document.firstlayerForm.margin.value);
    if(centre == true) {
        // left
        offsets[0] = (bedRad*-1) - 50 + delt + margin;
        offsets[1] = -50;
        // bottom
        offsets[2] = -50;
        offsets[3] = (bedRad*-1) - 50 + delt + margin;
        // centre
        offsets[4] = -50;
        offsets[5] = -50;
        // top
        offsets[6] = -50;
        offsets[7] = (bedRad - 50 - delt) - margin;
        //right
        offsets[8] = (bedRad - 50 - delt) - margin;
        offsets[9] = -50;
    } else {
        // bottom left
        offsets[0] = 0 + xy - 50 + margin;
        offsets[1] = 0 + xy - 50 + margin;
        // top left
        offsets[2] = 0 + xy - 50 + margin;
        offsets[3] = bedY - xy - margin;
        // centre
        offsets[4] = bedX/2 - 25;
        offsets[5] = bedY/2 - 25;
        // bottom right
        offsets[6] = bedX - xy - margin;
        offsets[7] = 0 + xy - 50 + margin;
        // top right
        offsets[8] = bedX - xy - margin;
        offsets[9] = bedY - xy - margin;
    }
    firstlayerStart = firstlayerStart.replace(/M140 S60/g, "M140 S"+bedTemp+" ; custom bed temp");
    firstlayerStart = firstlayerStart.replace(/M190 S60/g, "M190 S"+bedTemp+" ; custom bed temp");
    if(abl != 4){
        firstlayerStart = firstlayerStart.replace(/M104 S210 T0/g, "M104 S"+hotendTemp+" T0 ; custom hot end temp");
        firstlayerStart = firstlayerStart.replace(/M109 S210 T0/g, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    } else {
        firstlayerStart = firstlayerStart.replace(/M104 S210 T0/g, "; Prusa Mini");
        firstlayerStart = firstlayerStart.replace(/M109 S210 T0/g, "; Prusa Mini");
    }
    if(abl == 1){
        firstlayerStart = firstlayerStart.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
    }
    if(abl == 2){
        firstlayerStart =  firstlayerStart.replace(/;M420 S1 ; restore ABL mesh/, "M420 S1 ; restore ABL mesh");
    }
    if(abl == 3){
        firstlayerStart = firstlayerStart.replace(/G28 ; home all axes/, "G28 W ; home all without mesh bed level");
        firstlayerStart = firstlayerStart.replace(/;G29 ; probe ABL/, "G80 ; mesh bed leveling");
    }
    if(abl == 4){
        firstlayerStart = firstlayerStart.replace(/G28 ; home all axes/, "M109 S170 T0 ; probing temperature\nG28 ; home all");
        firstlayerStart = firstlayerStart.replace(/;G29 ; probe ABL/, "G29 ; probe ABL");
        firstlayerStart = firstlayerStart.replace(/;M420 S1 ; restore ABL mesh/, "M109 S"+hotendTemp+" T0 ; custom hot end temp");
    }
    if(abl == 5){
        firstlayerStart = firstlayerStart.replace(/;G29 ; probe ABL/, "G29 L1 ; Load the mesh stored in slot 1\nG29 J ; Probe 3 points to tilt mesh");
    }

    for(var i = 0; i <= 4; i++){
        var skirt = "; skirt "+(i+1)+"\n"+originalskirt;
        var firstlayerArray = skirt.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        firstlayerArray.forEach(function(index, item){
            if(firstlayerArray[item].search(/X/) > -1){
                var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2];
                firstlayerArray[item] = firstlayerArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        firstlayerArray.forEach(function(index, item){
            if(firstlayerArray[item].search(/Y/) > -1){
                var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2+1];
                firstlayerArray[item] = firstlayerArray[item].replace(regexp, "Y"+String(value))
            }
        });
        skirt = firstlayerArray.join("\n");
        skirts += skirt;
        var square = "; square "+(i+1)+"\n"+originalSquare;
        var firstlayerArray = square.split(/\n/g);
        var regexp = /X[0-9\.]+/;
        firstlayerArray.forEach(function(index, item){
            if(firstlayerArray[item].search(/X/) > -1){
                var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2];
                firstlayerArray[item] = firstlayerArray[item].replace(regexp, "X"+String(value));
            }
        });
        var regexp = /Y[0-9\.]+/;
        firstlayerArray.forEach(function(index, item){
            if(firstlayerArray[item].search(/Y/) > -1){
                var value = parseFloat(firstlayerArray[item].match(regexp)[0].substring(1)) + offsets[i*2+1];
                firstlayerArray[item] = firstlayerArray[item].replace(regexp, "Y"+String(value))
            }
        });
        square = firstlayerArray.join("\n");
        squares += square;
    }
    var firstlayer = firstlayerStart+skirts+squares+firstlayerEnd;
    firstlayer = firstlayer.replace(/G1 E-5.0000 F2400/g, "G1 E-"+retDist+" F"+retSpeed+" ; custom retraction");
    firstlayer = firstlayer.replace(/G1 E0.0000 F2400/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");
    if(document.firstlayerForm.psuon.checked == true) {
        firstlayer = firstlayer.replace(/;M80/, "M80");
    }
    if(document.firstlayerForm.removet0.checked == true) {
        firstlayer = firstlayer.replace(/T0\n/, ";T0\n");
    }
    if(document.firstlayerForm.start.checked == true) {
        firstlayer = firstlayer.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    downloadFile('firstlayer.gcode', firstlayer);
}

function processBaseline(){
    var hotendTemp = document.baselineForm.hotendtemp.value;
    var bedTemp = document.baselineForm.bedtemp.value;
    var centre = document.baselineForm.centre.checked;
    var bedX = Math.round((document.baselineForm.bedx.value-100)/2);
    var bedY = Math.round((document.baselineForm.bedy.value-100)/2);
    var retDist = document.baselineForm.retdist.value;
    var retDistExtra = document.baselineForm.retdistextra.value;
    var retSpeed = document.baselineForm.retspeed.value*60;
    var abl = document.baselineForm.abl.value;
    var pc = document.baselineForm.pc.value;
    var pcResume = 255;
    var customStart = document.baselineForm.startgcode.value;
    var baseline = originalBaseline;
    switch(pc){
        case '0':
            baseline = baseline.replace(/;fan2/, "M106 S255 ; custom fan 100% from layer 2");
            break;
        case '1':
            baseline = baseline.replace(/;fan3/, "M106 S255 ; custom fan 100% from layer 3");
            break;
        case '2':
            baseline = baseline.replace(/;fan5/, "M106 S255 ; custom fan 100% from layer 5");
            break;
        case '3':
            baseline = baseline.replace(/;fan2/, "M106 S130 ; custom fan 50% from layer 2");
            pcResume = 130;
            break;
        case '4':
            baseline = baseline.replace(/;fan3/, "M106 S130 ; custom fan 50% from layer 3");
            pcResume = 130;
            break;
        case '5':
            baseline = baseline.replace(/;fan5/, "M106 S130 ; custom fan 50% from layer 5");
            pcResume = 130;
            break;
        case '6':
            baseline = baseline.replace(/;fan2/, "; custom fan off");
            pcResume = 0;
            break;
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
    baseline = baseline.replace(/G1 E0.0000 F2400/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");
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
    if(document.baselineForm.psuon.checked == true) {
        baseline = baseline.replace(/;M80/, "M80");
    }
    if(document.baselineForm.removet0.checked == true) {
        baseline = baseline.replace(/T0\n/, ";T0\n");
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
    var pcResume = 255;
    var a1 = document.retractionForm.ret_a1.value;
    var a2 = document.retractionForm.ret_a2.value*60;
    var a3 = document.retractionForm.ret_a3.value;
    var a4 = document.retractionForm.ret_a4.value*60;
    var a5 = document.retractionForm.ret_a5.value;
    var b1 = document.retractionForm.ret_b1.value;
    var b2 = document.retractionForm.ret_b2.value*60;
    var b3 = document.retractionForm.ret_b3.value;
    var b4 = document.retractionForm.ret_b4.value*60;
    var b5 = document.retractionForm.ret_b5.value;
    var c1 = document.retractionForm.ret_c1.value;
    var c2 = document.retractionForm.ret_c2.value*60;
    var c3 = document.retractionForm.ret_c3.value;
    var c4 = document.retractionForm.ret_c4.value*60;
    var c5 = document.retractionForm.ret_c5.value;
    var d1 = document.retractionForm.ret_d1.value;
    var d2 = document.retractionForm.ret_d2.value*60;
    var d3 = document.retractionForm.ret_d3.value;
    var d4 = document.retractionForm.ret_d4.value*60;
    var d5 = document.retractionForm.ret_d5.value;
    var e1 = document.retractionForm.ret_e1.value;
    var e2 = document.retractionForm.ret_e2.value*60;
    var e3 = document.retractionForm.ret_e3.value;
    var e4 = document.retractionForm.ret_e4.value*60;
    var e5 = document.retractionForm.ret_e5.value;
    var f1 = document.retractionForm.ret_f1.value;
    var f2 = document.retractionForm.ret_f2.value*60;
    var f3 = document.retractionForm.ret_f3.value;
    var f4 = document.retractionForm.ret_f4.value*60;
    var f5 = document.retractionForm.ret_f5.value;
    var customStart = document.retractionForm.startgcode.value;
    var retraction = originalRetraction;
    switch(pc){
        case '0':
            retraction = retraction.replace(/;fan2/, "M106 S255 ; custom fan 100% from layer 2");
            break;
        case '1':
            retraction = retraction.replace(/;fan3/, "M106 S255 ; custom fan 100% from layer 3");
            break;
        case '2':
            retraction = retraction.replace(/;fan5/, "M106 S255 ; custom fan 100% from layer 5");
            break;
        case '3':
            retraction = retraction.replace(/;fan2/, "M106 S130 ; custom fan 50% from layer 2");
            pcResume = 130;
            break;
        case '4':
            retraction = retraction.replace(/;fan3/, "M106 S130 ; custom fan 50% from layer 3");
            pcResume = 130;
            break;
        case '5':
            retraction = retraction.replace(/;fan5/, "M106 S130 ; custom fan 50% from layer 5");
            pcResume = 130;
            break;
        case '6':
            retraction = retraction.replace(/;fan2/, "; custom fan off");
            pcResume = 0;
            break;
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
    retraction = retraction.replace(/;unretractionA/g, "G1 E"+a3+" F"+a4+" ; custom un-retraction/prime - A");
    if(a5 > 0){
        retraction = retraction.replace(/;zhopupA/g, "G91\nG1 Z"+a5+" F1200 ; custom z hop - A\nG90");
    }
    // B section
    retraction = retraction.replace(/;retractionB/g, "G1 E-"+b1+" F"+b2+" ; custom retraction - B");
    retraction = retraction.replace(/;unretractionB/g, "G1 E"+b3+" F"+b4+" ; custom un-retraction/prime - B");
    if(b5 > 0){
        retraction = retraction.replace(/;zhopupB/g, "G91\nG1 Z"+b5+" F1200 ; custom z hop - B\nG90");
    }
    // C section
    retraction = retraction.replace(/;retractionC/g, "G1 E-"+c1+" F"+c2+" ; custom retraction - C");
    retraction = retraction.replace(/;unretractionC/g, "G1 E"+c3+" F"+c4+" ; custom un-retraction/prime - C");
    if(c5 > 0){
        retraction = retraction.replace(/;zhopupC/g, "G91\nG1 Z"+c5+" F1200 ; custom z hop - C\nG90");
    }
    // D section
    retraction = retraction.replace(/;retractionD/g, "G1 E-"+d1+" F"+d2+" ; custom retraction - D");
    retraction = retraction.replace(/;unretractionD/g, "G1 E"+d3+" F"+d4+" ; custom un-retraction/prime - D");
    if(d5 > 0){
        retraction = retraction.replace(/;zhopupD/g, "G91\nG1 Z"+d5+" F1200 ; custom z hop - D\nG90");
    }
    // E section
    retraction = retraction.replace(/;retractionE/g, "G1 E-"+e1+" F"+e2+" ; custom retraction - E");
    retraction = retraction.replace(/;unretractionE/g, "G1 E"+e3+" F"+e4+" ; custom un-retraction/prime - E");
    if(e5 > 0){
        retraction = retraction.replace(/;zhopupE/g, "G91\nG1 Z"+e5+" F1200 ; custom z hop - E\nG90");
    }
    // F section
    retraction = retraction.replace(/;retractionF/g, "G1 E-"+f1+" F"+f2+" ; custom retraction - F");
    retraction = retraction.replace(/;unretractionF/g, "G1 E"+f3+" F"+f4+" ; custom un-retraction/prime - F");
    if(f5 > 0){
        retraction = retraction.replace(/;zhopupF/g, "G91\nG1 Z"+f5+" F1200 ; custom z hop - F\nG90");
    }
    if(document.retractionForm.psuon.checked == true) {
        retraction = retraction.replace(/;M80/, "M80");
    }
    if(document.retractionForm.removet0.checked == true) {
        retraction = retraction.replace(/T0\n/, ";T0\n");
    }
    if(document.retractionForm.start.checked == true) {
        retraction = retraction.replace(/;customstart/, "; custom start gcode\n"+customStart); 
    }
    downloadFile('retraction.gcode', retraction);
}

function processTemperature(){
    var bedTemp = document.temperatureForm.bedtemp.value;
    var centre = document.temperatureForm.centre.checked;
    var bedX = Math.round((document.temperatureForm.bedx.value-100)/2);
    var bedY = Math.round((document.temperatureForm.bedy.value-100)/2);
    var retDist = document.temperatureForm.retdist.value;
    var retDistExtra = document.temperatureForm.retdistextra.value;
    var retSpeed = document.temperatureForm.retspeed.value*60;
    var abl = document.temperatureForm.abl.value;
    var pc = document.temperatureForm.pc.value;
    var pcResume = 255;
    var a0 = document.temperatureForm.temp_a0.value;
    var a1 = document.temperatureForm.temp_a1.value;
    var b1 = document.temperatureForm.temp_b1.value;
    var c1 = document.temperatureForm.temp_c1.value;
    var d1 = document.temperatureForm.temp_d1.value;
    var e1 = document.temperatureForm.temp_e1.value;
    var customStart = document.temperatureForm.startgcode.value;
    var temperature = originalTemperature;
    switch(pc){
        case '0':
            temperature = temperature.replace(/;fan2/, "M106 S255 ; custom fan 100% from layer 2");
            break;
        case '1':
            temperature = temperature.replace(/;fan3/, "M106 S255 ; custom fan 100% from layer 3");
            break;
        case '2':
            temperature = temperature.replace(/;fan5/, "M106 S255 ; custom fan 100% from layer 5");
            break;
        case '3':
            temperature = temperature.replace(/;fan2/, "M106 S130 ; custom fan 50% from layer 2");
            pcResume = 130;
            break;
        case '4':
            temperature = temperature.replace(/;fan3/, "M106 S130 ; custom fan 50% from layer 3");
            pcResume = 130;
            break;
        case '5':
            temperature = temperature.replace(/;fan5/, "M106 S130 ; custom fan 50% from layer 5");
            pcResume = 130;
            break;
        case '6':
            temperature = temperature.replace(/;fan2/, "; custom fan off");
            pcResume = 0;
            break;
    }
    temperature = temperature.replace(/;fanrestore/g, "M106 S"+pcResume+" ; restore previous fan speed");
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
    temperature = temperature.replace(/G1 E0.0000 F2400/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");

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
    if(document.temperatureForm.psuon.checked == true) {
        temperature = temperature.replace(/;M80/, "M80");
    }
    if(document.temperatureForm.removet0.checked == true) {
        temperature = temperature.replace(/T0\n/, ";T0\n");
    }
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
    var retDistExtra = document.accelerationForm.retdistextra.value;
    var retSpeed = document.accelerationForm.retspeed.value*60;
    var abl = document.accelerationForm.abl.value;
    var pc = document.accelerationForm.pc.value;
    var pcResume = 255;
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
    switch(pc){
        case '0':
            acceleration = acceleration.replace(/;fan2/, "M106 S255 ; custom fan 100% from layer 2");
            break;
        case '1':
            acceleration = acceleration.replace(/;fan3/, "M106 S255 ; custom fan 100% from layer 3");
            break;
        case '2':
            acceleration = acceleration.replace(/;fan5/, "M106 S255 ; custom fan 100% from layer 5");
            break;
        case '3':
            acceleration = acceleration.replace(/;fan2/, "M106 S130 ; custom fan 50% from layer 2");
            pcResume = 130;
            break;
        case '4':
            acceleration = acceleration.replace(/;fan3/, "M106 S130 ; custom fan 50% from layer 3");
            pcResume = 130;
            break;
        case '5':
            acceleration = acceleration.replace(/;fan5/, "M106 S130 ; custom fan 50% from layer 5");
            pcResume = 130;
            break;
        case '6':
            acceleration = acceleration.replace(/;fan2/, "; custom fan off");
            pcResume = 0;
            break;
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
    acceleration = acceleration.replace(/G1 E0.0000 F2400/g, "G1 E"+retDistExtra+" F"+retSpeed+" ; custom un-retraction/prime");
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
    if(document.accelerationForm.psuon.checked == true) {
        acceleration = acceleration.replace(/;M80/, "M80");
    }
    if(document.accelerationForm.removet0.checked == true) {
        acceleration = acceleration.replace(/T0\n/, ";T0\n");
    }
    if(document.accelerationForm.start.checked == true) {
        acceleration = acceleration.replace(/;customstart/, "; custom start gcode\n"+customStart);
    }
    downloadFile('acceleration.gcode', acceleration);
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
    string += "All changes are marked in the gcode with 'custom' at the end of each line. Open the gcode in a text editor and search for this to your inputs if needed.\n\n";
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
    if(formName.name == "firstlayerForm") {
        string += "\nExtra margin from edge: "+formName.margin.value+" mm";
    }
    string += "\n\nTemperatures:\n";
    if(formName.name == "temperatureForm") {
        string += "Bed: "+formName.bedtemp.value+" deg C\n";
        string += "Segement E: "+formName.temp_e1.value+" deg C\n";
        string += "Segement D: "+formName.temp_d1.value+" deg C\n";
        string += "Segement C: "+formName.temp_c1.value+" deg C\n";
        string += "Segement B: "+formName.temp_b1.value+" deg C\n";
        string += "Segement A: "+formName.temp_a1.value+" deg C\n";
        string += "First Layer: "+formName.temp_a0.value+" deg C\n";
    } else {
        string += "Bed: "+formName.bedtemp.value+" deg C\n";
        string += "Hot end: "+formName.hotendtemp.value+" deg C\n";
    }
    if(formName.name != "firstlayerForm") {
        var pcSelected = formName.pc.value;
        string += "\n\nPart Cooling: "+formName.pc[pcSelected].text;
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
        //string += "Extra restart distance: "+formName.hotendtemp.value+" mm\n";
    }
    if(formName.name == "accelerationForm") {
        string += "\nBase feedrate: "+formName.feedrate.value+" mm/s\n\n";
        var jjd = formName.jerk_or_jd.value;
        if(jjd == "jerk") {
            string += "Segment | M204 P Acceleration |  M205 Jerk X  |  M205 Jerk Y   (jerk Z is set the same as X to suit deltas)\n";
            string += "   F    |    "+formName.accel_f1.value+" mm/sec/sec   |     "+formName.accel_f2.value+" mm      |     "+formName.accel_f2.value+" mm\n";
            string += "   E    |    "+formName.accel_e1.value+" mm/sec/sec   |     "+formName.accel_e2.value+" mm      |     "+formName.accel_e2.value+" mm\n";
            string += "   D    |    "+formName.accel_d1.value+" mm/sec/sec   |     "+formName.accel_d2.value+" mm      |     "+formName.accel_d2.value+" mm\n";
            string += "   C    |    "+formName.accel_c1.value+" mm/sec/sec   |     "+formName.accel_c2.value+" mm      |     "+formName.accel_c2.value+" mm\n";
            string += "   B    |    "+formName.accel_b1.value+" mm/sec/sec   |     "+formName.accel_b2.value+" mm      |     "+formName.accel_b2.value+" mm\n";
            string += "   A    |    "+formName.accel_f1.value+" mm/sec/sec   |     "+formName.accel_a2.value+" mm      |     "+formName.accel_a2.value+" mm\n";
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