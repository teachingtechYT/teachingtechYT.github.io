// adapted from a python script written by WiseroOrb here: https://github.com/teachingtechYT/teachingtechYT.github.io/issues/126

function processMinimumLength() {
    var distance = 100;//document.minlengthForm.distance.value;
    var startInc = 1;//document.minlengthForm.startinc.value;
    var endInc = 0.1;//document.minlengthForm.endinc.value;
    var step = 0.1;//document.minlengthForm.step.value;
    var feedrate = 60*60;//document.minlengthForm.feedrate.value*60;
    var accel = 500;//document.minlengthForm.acceleration.value;
    var xpos = 10;
    var ypos = 10;

    if(startInc < endInc) {
        alert("Starting increment must be greater than ending increment. Please alter your inputs.");
        return false;
    }
    if(step < 0) {
        alert("Step value must be positive. Please alter your input.");
        return false;
    }
    var gcode = "; adapted from a python script written by WiseroOrb here: https://github.com/teachingtechYT/teachingtechYT.github.io/issues/126\n; User input parameters:";
    gcode += "; Distance: "+distance+" mm\n";
    gcode += "; Starting increment: "+startInc+"\n";
    gcode += "; Ending increment: "+endInc+"\n";
    gcode += "; Step: "+step+"\n";
    gcode += "; Feedrate: "+feedrate+" mm/sec\n";
    gcode += "; M204 Print acceleration: "+accel+" mm/sec/sec\n"
    gcode += "; Start gcode\nG21\nG90\nG28\nT0\nG1 Z5 F100";
    gcode += "M204 T"+accel+"\n";
    gcode += "G0 F"+feedrate+"\n";
    var cycles = parseInt((startInc - endInc) / step) +1;
    for(var i = 0; i < cycles; i++) {
        var inc = startInc - i*step;
        var n_lines = parseInt(distance/inc);
        gcode += "G0 X"+xpos+" Y"+ypos+"\nM400\n";
        gcode += "; increment = "+inc+"\n";
        gcode += "M117 "+inc+"\n";
        for(var j = 0; j < n_lines; j++) {
            gcode += "G0 X"+parseFloat(xpos + inc*j)+"\n";
        }
    }
    gcode += "M117 Complete";
    downloadFile('minimumlength.gcode', gcode);
}