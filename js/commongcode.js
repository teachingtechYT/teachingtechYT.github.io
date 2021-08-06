var commonStart = `;M80 ; power supply on
G90
M82
M106 S0
;bed0a
;bed0b
;temp0a
;temp0b
G28 ; home all axes
;G29 ; probe ABL
;M420 S1 ; restore ABL mesh 
;customstart
G0 Z3; fix for delta printers that home at max`;

var commonEnd = `
G28 X0 ; home X axis
M106 S0 ; turn off cooling fan
M104 S0 ; turn off extruder
M140 S0 ; turn off bed
M84 ; disable motors
M501 ; restore previous EEPROM values
;customend
`;