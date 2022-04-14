function displayCustom(){
    // custom start
    if($(tab+' input[name="start"]').is(':checked')){
        $('.startExp').show();
    } else {
        $('.startExp').hide();
    }
    // delta
    if($(tab+' input[name="centre"]').is(':checked')){
        $('.dia').show();
        $('.XY').hide();
    } else {
        $('.dia').hide();
        $('.XY').show();
    }
    // custom end
    if($(tab+' input[name="end"]').is(':checked')){
        $('.endExp').show();
    } else {
        $('.endExp').hide();
    }
    // firmware selector
    if($("#marlinSelector").prop("checked") == true){
        $('.marlinContent').show();
        $('.klipperContent').hide();
        $('.rrfContent').hide();
    }
    if($("#klipperSelector").prop("checked") == true){
        $('.marlinContent').hide();
        $('.klipperContent').show();
        $('.rrfContent').hide();
    }
    if($("#rrfSelector").prop("checked") == true){
        $('.marlinContent').hide();
        $('.klipperContent').hide();
        $('.rrfContent').show();
    }
    // acc firmware selector
    toggleAF();
    // slicer selector
    if($("#curaSelector").prop("checked") == true){
        $('.curaContent').show();
        $('.s3dContent').hide();
        $('.prusaslicerContent').hide();
        $('.superslicerContent').hide();
        $('.ideamakerContent').hide();
    }
    if($("#s3dSelector").prop("checked") == true){
        $('.curaContent').hide();
        $('.s3dContent').show();
        $('.prusaslicerContent').hide();
        $('.superslicerContent').hide();
        $('.ideamakerContent').hide();
    }
    if($("#prusaslicerSelector").prop("checked") == true){
        $('.curaContent').hide();
        $('.s3dContent').hide();
        $('.prusaslicerContent').show();
        $('.superslicerContent').hide();
        $('.ideamakerContent').hide();
    }
    if($("#superslicerSelector").prop("checked") == true){
        $('.curaContent').hide();
        $('.s3dContent').hide();
        $('.prusaslicerContent').hide();
        $('.superslicerContent').show();
        $('.ideamakerContent').hide();
    }
    if($("#ideamakerSelector").prop("checked") == true){
        $('.curaContent').hide();
        $('.s3dContent').hide();
        $('.prusaslicerContent').hide();
        $('.superslicerContent').hide();
        $('.ideamakerContent').show();
    }
}

var firmwareSelector = /*html*/ `<form name="firmwareSelect" class="firmwareSelector">
<p style="margin-left:20px;">Use the button to switch instructions for different firmwares:
<input name="firmware" id="marlinSelector" value="marlin" checked type="radio" onchange="displayCustom()"/>
<label for="marlinSelector">Marlin</label>
<input name="firmware" id="klipperSelector" value="klipper" type="radio" onchange="displayCustom()"/>
<label for="klipperSelector">Klipper</label>
<input name="firmware" id="rrfSelector" value="rrf" checked type="radio" onchange="displayCustom()"/>
<label for="rrfSelector">RRF</label>
</p>
</form>
`;

var slicerSelector = /*html*/ `<form name="slicerSelect" class="slicerSelector">
<p style="margin-left:20px;">Use the button to switch instructions for different slicers:</p>
<p><input name="slicer" id="curaSelector" value="cura" checked type="radio" onchange="displayCustom()"/>
<label for="curaSelector">Cura</label>
<input name="slicer" id="s3dSelector" value="s3d" type="radio" onchange="displayCustom()"/>
<label for="s3dSelector">Simplify3D</label>
<input name="slicer" id="prusaslicerSelector" value="prusaslicer" checked type="radio" onchange="displayCustom()"/>
<label for="prusaslicerSelector">PrusaSlicer</label>
<input name="slicer" id="superslicerSelector" value="superslicer" checked type="radio" onchange="displayCustom()"/>
<label for="superslicerSelector">SuperSlicer</label>
<input name="slicer" id="ideamakerSelector" value="ideamaker" checked type="radio" onchange="displayCustom()"/>
<label for="ideamakerSelector">ideaMaker</label>
</p>
</form>
`;

var nozzleLayer = /*html*/ `<h4>Nozzle Diameter / Layer Height</h4>
    <p>Select your nozzle diameter and layer height. If you have not changed your nozzle, it will likely be 0.4 mm. 0.2 mm is a typical layer height for this nozzle.</p>
    <p>25 options are available, however some of the tests don't work very well with the larger options.</p>
    <label for="nozzleLayer">Select nozzle diameter / layer height:</label>
    <select name="nozzleLayer" onchange="volumeCalc();">
        <option value="15_08">0.15 mm nozzle / 0.08 mm layer height</option>
        <option value="20_05">0.20 mm nozzle / 0.05 mm layer height</option>
        <option value="20_10">0.20 mm nozzle / 0.10 mm layer height</option>
        <option value="20_15">0.20 mm nozzle / 0.15 mm layer height</option>
        <option value="25_10">0.25 mm nozzle / 0.10 mm layer height</option>
        <option value="25_15">0.25 mm nozzle / 0.15 mm layer height</option>
        <option value="30_10">0.30 mm nozzle / 0.10 mm layer height</option>
        <option value="30_15">0.30 mm nozzle / 0.15 mm layer height</option>
        <option value="30_20">0.30 mm nozzle / 0.20 mm layer height</option>
        <option value="35_20">0.35 mm nozzle / 0.20 mm layer height</option>
        <option value="40_12">0.40 mm nozzle / 0.12 mm layer height</option>    
        <option value="40_16">0.40 mm nozzle / 0.16 mm layer height</option>
        <option value="40_20" selected>0.40 mm nozzle / 0.20 mm layer height</option>
        <option value="40_24">0.40 mm nozzle / 0.24 mm layer height</option>
        <option value="40_28">0.40 mm nozzle / 0.28 mm layer height</option>
        <option value="50_20">0.50 mm nozzle / 0.20 mm layer height</option>
        <option value="50_30">0.50 mm nozzle / 0.30 mm layer height</option>
        <option value="50_35">0.50 mm nozzle / 0.35 mm layer height</option>
        <option value="60_20">0.60 mm nozzle / 0.20 mm layer height</option>
        <option value="60_30">0.60 mm nozzle / 0.30 mm layer height</option>
        <option value="60_40">0.60 mm nozzle / 0.40 mm layer height</option>
        <option value="80_30">0.80 mm nozzle / 0.30 mm layer height</option>
        <option value="80_40">0.80 mm nozzle / 0.40 mm layer height</option>
        <option value="80_50">0.80 mm nozzle / 0.50 mm layer height</option>
        <option value="80_60">0.80 mm nozzle / 0.60 mm layer height</option>
        <option value="100_50">1.00 mm nozzle / 0.50 mm layer height</option>
        <option value="100_75">1.00 mm nozzle / 0.75 mm layer height</option>
    </select>`;

var startGcode = /*html*/ `<h4>Additional start gcode</h4>
            <p>If you have additional start commands, tick the box and enter the gcode. This can be used for an <b>extruder prime sequence</b>, overwriting the standard <b>flow rate</b>, compensating for <b>2.85/3.00 mm filament</b>, setting <b>K factor</b> and more. Tick the box for more details.</p>
            <label>Additional start gcode:<input name="start" type="checkbox" onchange="displayCustom();" value="extraStart"></label>
            <label>Add M80 to turn PSU on:<input name="psuon" type="checkbox" value="on"></label>
            <label>Remove <b>T0</b> from gcode (advanced users with MMU)<input name="removet0" type="checkbox"></label>
            <div class="startExp">
                <p>For the majority of users, you can skip this section. Any gcode entered here will be inserted after temperatures are set and homing is complete. Start gcode is saved by the browser, you should only have to enter it once. Example uses include:</p>
                <ul>
                    <li>Copying gcode commands from your slicer to draw an <b>intro/prime/purge line</b>. By default this is left out to accommodate delta printers.</li>
                    <li>Telling the firmware to alter the <b>flow rate</b> of the gcode to follow. This does not mean the exact flow rate you have set in your own slicer. For example, using <b><a href="https://marlinfw.org/docs/gcode/M221.html" target="_blank">M221</a> S120</b> would set the flow rate to 120% of what it was originally sliced as in Simpilfy3D. Use this to compensate for obvious over or under extrusion you may encounter with these tests. Additional information available at the base of the <a href="#flow">Flow Rate</a> tab.</li>
                    <li><b>M221 S38</b> can also be used to compensate for 2.85 mm filament and <b>M221 S34</b> for 3.00 mm filament instead of the default 1.75 mm.</li>
                    <li>Setting the K factor for <b>linear advance</b>. For example, <b>M900 K0.11</b></li>
                    <li><b>Custom ABL</b> sequence. By default, only G28 is present. This gcode will be inserted immediately afer that so custom commands can be used here.Useful for G34 auto stepper alignment and Klipper's Z_TILT_ADJUST.</li>
                    <li>Anything else you have in your start gcode, such as setting acceleration values, E-steps, etc.</li>
                </ul>
                <label>Strip <b>ALL</b> original start gcode and use only custom gcode instead: <input name="customStartOnly" type="checkbox"></label>
                <p class="warning">This option will remove all start gcode except what is entered in the box below. This means you are responsible for providing commands to home the machine and heat the bed/nozzle. Note: this gcode uses M82 absolute extrusion values, do not enter the M83 command (relative extrusion values) here. Advanced users only!</p>
                <textarea name="startgcode"></textarea>
            </div>`;

var bedDims =  /*html*/ `<h4>Bed dimensions</h4>
            <p>Inputting the correct number will attempt to move the print into the centre of the bed. If the 0,0 at centre button is checked for a delta, also enter your bed diameter. Please check the gcode to ensure it will fit on your bed. For unusual 3D printers, apply X/Y offsets to shift the gcode on the build platform. 99.9% of users will leave this on 0,0. Please ensure you check a gcode preview before printing if you use this feature.</p>
            <label>0,0 at centre of bed (most deltas):<input name="centre" type="checkbox" onchange="displayCustom();" value="centre"></label>
            <span class="XY"><label>Bed X dimension (mm): <input type="number" name="bedx" value="100" min="100" max="600" step="1"></label>
            <label>Bed Y dimension (mm): <input type="number" name="bedy" value="100" min="100" max="600" step="1"></label><br /></span>
            <span class="dia"><label>Bed diameter dimension (mm): <input type="number" name="beddia" value="100" min="100" max="600" step="1"></label></span>
            <label>X offset (mm): <input type="number" name="offsetx" value="0" min="-1000" max="1000" step="1"></label> <label>Y offset (mm): <input type="number" name="offsety" value="0" min="-1000" max="1000" step="1"></label>`;

var extraMargin = /*html*/ `<p>You may add extra margin for clearing bed clips, etc. Caution! If this is too large on small printers the squares will overlap. You may also use a negative value to space the squares further apart. Make sure to preview the gcode before printing!</p>
            <label>Extra margin from edge (mm): <input type="number" name="margin" value="0" min="0" max="100" step="1"></label>`;

var tempReg = /*html*/ `<h4>Temperatures</h4>
<p>For the hot end and bed respectively, typical PLA temperatures are 200 and 60, PETG 235 and 80, ABS 250 and 100, TPU 230 and 5 (effectively off). Note: Homing and ABL sequence will be completed with a hot end temperature 50 degrees below what is set.</p>
<label>Hot end temperature (deg C): <input type="number" name="hotendtemp" value="200" min="160" max="450"></label>
<label>Bed temperature (deg C): <input type="number" name="bedtemp" value="60" min="0" max="150"></label> (use 0 for a non heated bed)<br />`;

var tempTower = /*html*/ `<h4>Bed Temperature</h4>
<p>For bed, typical PLA temperatures are 60, PETG 80, ABS 100, TPU 5 (effectively off).  Note: Homing and ABL sequence will be completed with a hot end temperature 50 degrees below what is set.</p>
<label>Bed temperature (deg C): <input type="number" name="bedtemp" value="60" min="0" max="150"></label> (use 0 for a non heated bed)
<h4>Hot end temperature</h4>
<p>Typically, filament comes with a recommended hot end temperature. It is recommended to use values either side of this. For instance, if a PLA filament asked for 200 degrees, you may vary the temperature from 190, 195, 200, 205, 210 (the default values of the form). Typically, the first layer temperature will be elevated to increase adhesion with the bed, especially if a lower than usual temperature is being trialled for segment A. <span class="sug">Suggested increments for how much to vary the value for each segment are shown in green.</span></p>
<table>
    <thead>
        <tr>
            <th>Reference Diagram</th>
            <th>Segment</th>
            <th>Hot end temperature<p class="sug">&#177; 5 - 10</p></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="6" style="text-align: center;">
                <img src="img/temperaturediagram.jpg" />
            </td>
            <td style="text-align: center;">E</td>
            <td><input type="number" min="150" max="450" name="temp_e1" value="210"></td>
        </tr>
        <tr>
            <td style="text-align: center;">D</td>
            <td><input type="number" min="150" max="450" name="temp_d1" value="205"></td>
        </tr>
        <tr>
            <td style="text-align: center;">C</td>
            <td><input type="number" min="150" max="450" name="temp_c1" value="200"></td>
        </tr>
        <tr>
            <td style="text-align: center;">B</td>
            <td><input type="number" min="150" max="450" name="temp_b1" value="195"></td>
        </tr>
        <tr>
            <td style="text-align: center;">A</td>
            <td><input type="number" min="150" max="450" name="temp_a1" value="190"></td>
        </tr>
        <tr>
            <td style="text-align: center;">First layer</td>
            <td><input type="number" min="150" max="450" name="temp_a0" value="200"></td>
        </tr>
    </tbody>
</table>`;

var pcReg = /*html*/ `<h4>Part Cooling Fan</h4>
<p>Printing with PLA typically has the part cooling fan come on from layer 2. Alter this default behaviour here. A zero speed value disables the fan apart from bridging.</p>
<label>Part cooling fan speed:</label> <input type="number" name="fanSpeed" value="100" min="0" max="100" step="5"> % </label><label for="fanLayer">starting on: </label>
<select name="fanLayer">
    <option value="2">layer 2</option>
    <option value="3">layer 3</option>
    <option value="5">layer 5</option>
</select>`;

var pcFirstlayer = /*html*/ `<h4>Part Cooling Fan</h4>
<p>Part cooling fans typically don't activate until at least layer 2. Since this print is only one layer thick, part cooling is not applicable.</p>`;

var abl = /*html*/ `<h4>Auto Bed Levelling</h4>
<label for="abl">Select which method of ABL is in place.</label>
<select name="abl">
    <option value="0">No ABL</option>
    <option value="1">Probe new mesh at the start of print - G29 (BLtouch,EZABL,etc)</option>
    <option value="2">Restore saved ABL/manual mesh - M420 S1</option>
    <option value="3">Prusa MK3 - G28 W followed by G80</option>
    <option value="4">Prusa Mini - Only heat nozzle to 170, then G29</option>
    <option value="5">Unified Bed Leveling - Load Saved Mesh (slot 0) then 3 Probe Tilt </option>
    <option value="6">Unified Bed Leveling - Load Saved Mesh (slot 1) then 3 Probe Tilt </option>
    <option value="7">Unified Bed Leveling - Load Saved Mesh (slot 2) then 3 Probe Tilt </option>
</select>`;

var retractionReg = /*html*/ `<h4>Retraction</h4>
<p>If you don't know what to enter here, you can leave the retraction speed at 40 mm/sec. For a bowden tube printer, 6mm is a likely retraction distance. For direct drive, a starting value of 1mm may be suitable. If you are not sure about extra restart distance, leave this as 0.</p>
<p><label>Retraction distance (mm): <input type="number" name="retdist" value="5" min="0" max="20" step="0.1"></label>
    <label>Retraction speed (mm/sec): <input type="number" name="retspeed" value="40" min="5" max="150" step="1"></label></p>
    <p><label>Extra restart distance (mm): <input type="number" name="retdistextra" min="-10" max="10" value="0" step="0.1"></label>
    <label>Z hop (mm): <input type="number" name="zhop" min="0" max="10" value="0" step="0.1"></label> (zero disables Z hop)</p>`;

var retractionTower = /*html*/ `<h4>Retraction</h4>
<p>For initial tests, you can leave the retraction speed at 40 mm/sec. For a bowden tube printer, 6mm is a likely retraction distance. For direct drive, a starting value of 1mm may be suitable. Vary either side of this for each segment. <span class="sug">Suggested increments for how much to vary the value for each segment are shown in green.</span>.</p>
<table>
    <thead>
        <tr>
            <th>Reference Diagram</th>
            <th>Segment</th>
            <th>Retraction distance (mm)<p class="sug">&#177; 0.5 - 1 (bowden tube)</p><p class="sug">&#177; 0.1 - 0.2 (direct drive)</p></th>
            <th>Retraction speed (mm/sec)<p class="sug">&#177; 5</p></th>
            <th>Extra restart distance (mm)<p class="sug">&#177; 0.2</p></th>
            <th>Prime (unretract) speed (mm/sec)<p class="sug">&#177; 5</p></th>
            <th>Z hop (mm)<p class="sug">&#177; 0.1</p></th>
        </tr>
    </thead>
    <tbody>
         <tr>
            <td rowspan="6">
                <img src="img/retractiondiagram.jpg" />
            </td>
            <td style="text-align: center;">F</td>
            <td><input type="number" min="0" max="20" name="ret_f1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_f2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_f3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_f4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_f5" value="0" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">E</td>
            <td><input type="number" min="0" max="20" name="ret_e1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_e2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_e3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_e4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_e5" value="0" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">D</td>
            <td><input type="number" min="0" max="20" name="ret_d1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_d2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_d3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_d4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_d5" value="0" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">C</td>
            <td><input type="number" min="0" max="20" name="ret_c1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_c2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_c3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_c4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_c5" value="0" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">B</td>
            <td><input type="number" min="0" max="20" name="ret_b1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_b2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_b3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_b4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_b5" value="0" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">A</td>
            <td><input type="number" min="0" max="20" name="ret_a1" value="6" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_a2" value="40" step="1"></td>
            <td><input type="number" min="-10" max="10" name="ret_a3" value="0" step="0.1"></td>
            <td><input type="number" min="5" max="200" name="ret_a4" value="40" step="1"></td>
            <td><input type="number" min="0" max="5" name="ret_a5" value="0" step="0.1"></td>
        </tr>
    </tbody>
</table>`;

var feedrateReg = /*html*/ `<h4>Feedrate</h4>
<p>The default printing speed is 60 mm/sec, with modifiers including 60% for perimeters, 80% for solid infill, travel moves 166%, and 50% of these for the first layer. Modify the base feedrate here and the generated gcode will be modified using the same proportions (<b>calculated feedrates shown in grey</b>). Please note extruder retraction/unretraction and Z-hop speeds will be unaffected by this.</p>
<p><label>Base feedrate (mm/sec): <input type="number" name="baseFeedrate" value="60" min="5" max="1000" step="1" onchange="updateFeeds(this.value);"></label>
<span  class="summary">Perimeters: <b><span class="perimFeed">36</span> mm/s</b></span><span class="summary">Solid infill: <b><span class="solidFeed">48</span> mm/s</b></span><span class="summary">Travel moves: <b><span class="travelFeed">100</span> mm/s</b></span><span class="summary">First layer: <b><span class="firstFeed">30</span> mm/s</b></span></p>
`;

var feedrateTower = /*html*/ `<h4>Feedrate/speed</h4>
<p>The default printing speed is modified with 100% for perimeters, 166% for travel moves, and 50% of these for the first layer. For segment A, generated gcode will be modified using these proportions (<b>calculated feedrates shown in grey</b>). Please note extruder retraction/unretraction and Z-hop speeds will be unaffected by this.</p>
<p>In this test the feedrate you enter is for the single, outer perimeter. Select a safe feedrate for segment A to ensure good adhesion with the bed. Increase feedrate for segments B to E to your liking. As this print is completed in vase mode, there are no retractions.</p>
<p>This website uses an extrusion width of 1.2 x nozzle width. The volumetric flow value is calculated using this width, layer height and feedrate. This value can be used to get a practical idea of hot end volumetric flow at a given temperature.
<p><span class="sug">Suggested increments for how much to vary the value for each segment are shown in green.</span></p>
<table>
    <thead>
        <tr>
            <th>Reference diagram</th>
            <th>Segment</th>
            <th>Feedrate (mm/sec) <span class="sug">&#177; 5-20</span></th>
            <th>Calculated volumetric flow (mm³/sec)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="5"><img src="img/speeddiagram.jpg" /></td>
            <td style="text-align: center;">E</td>
            <td>Perimeter feedrate:  <input type="number" name="feedrateE" onchange="volumeCalc()" value="60" min="5" max="1000" step="1"></td>
            <td><span id="volE" class="volumetric">5.76</span> mm³/sec</td>
        </tr>
        <tr>
            <td style="text-align: center;">D</td>
            <td>Perimeter feedrate:  <input type="number" name="feedrateD" onchange="volumeCalc()" value="50" min="5" max="1000" step="1"></td>
            <td><span id="volD" class="volumetric">4.80</span> mm³/sec</td>
        </tr>
        <tr>
            <td style="text-align: center;">C</td>
            <td>Perimeter feedrate:  <input type="number" name="feedrateC" onchange="volumeCalc()" value="40" min="5" max="1000" step="1"></td>
            <td><span id="volC" class="volumetric">3.84</span> mm³/sec</td>
        </tr>
        <tr>
            <td style="text-align: center;">B</td>
            <td>Perimeter feedrate:  <input type="number" name="feedrateB" onchange="volumeCalc()" value="30" min="5" max="1000" step="1"></td>
            <td><span id="volB" class="volumetric">2.40</span> mm³/sec</td>
        </tr>
        <tr>
            <td style="text-align: center;">A</td>
            <td>Perimeter feedrate:  <input type="number" name="baseFeedrate" value="20" min="5" max="1000" step="1" onchange="updateFeedsTower(this.value); volumeCalc()">
            <p><span class="summary">Solid infill: <b><span class="solidFeedTower">48</span> mm/s</b></span><span class="summary">Travel moves: <b><span class="travelFeedTower">100</span> mm/s</b></span><span class="summary">First layer: <b><span class="firstFeedTower">30</span> mm/s</b></span></p><p>The above feedrate modifiers only apply to the first layer.</p></td>
            <td style="vertical-align:top"><span id="volA" class="volumetric">1.92</span> mm³/sec</td>            
        </tr>
    </tbody>
</table>
`;

var feedrateWarning = /*html*/ `
<p class="warning">Some users have experienced printing failures with gcode generated by this site when their regular slicer is able to create a successful print with the same STL. The gcode on this site does not use any slow down for short layers to aid cooling, whereas default profiles in some slicers do. This means that your regular slicer may be printing this file a fair bit slower than you realise. To match this on this site, simply lower the default feedrate in the form above.</p>`

var accel = /*html*/ `<h4>Base feedrate/speed</h4>
<p>You can specify the feedrate for X and Y movements. Both the inner and outer perimeter speed can be specified. It is recommend to follow the process above to calculate safe limits for feedrate.</p>
<p><label>Inner perimeter feedrate (mm/sec): <input type="number" name="innerFeedrate" value="60" min="5" max="1000" step="1"></label></p>
<p><label>Outer perimeter feedrate (mm/sec): <input type="number" name="outerFeedrate" value="60" min="5" max="1000" step="1"></label></p>
<h4>Delta printer</h4>
<p>Delta printers require X, Y and Z acceleration limits to be raised at the start of the test, whereas cartesian and coreXY only need X and Y limits raised. Tick the box if you are printing this test on a delta printer in order to set the correct behaviour.</p>
<p><label>Delta printer: <input name="deltaAcc" type="checkbox" value="off"></label></p>
<h4>Firmware</h4>
<p>I am running this test on a printer with:</p>
    <label>Marlin: <input type="radio" value="accMarlin" name="accFirmware" checked="checked" onchange="toggleAF()"></label>
    <label>Klipper: <input type="radio" value="accKlipper" name="accFirmware" onchange="toggleAF()"></label>
    <label>RepRapFirmware: <input type="radio" value="accRRF" name="accFirmware" onchange="toggleAF()"></label>
<div class="accMarlinContent">
    <h4>Acceleration and jerk/junction deviation</h4>
    <p>After entering <b>M503</b>, I have determined my 3D printer firmware uses:</p>
    <label>Jerk: <input type="radio" value="jerk" name="jerk_or_jd" checked="checked" onchange="toggleJ()"></label>
    <label>Junction deviation: <input type="radio" value="jd" name="jerk_or_jd" onchange="toggleJ()"></label>
    <p>Based on the values you saw from <b>M503</b>, enter variables around this below.</p>
    <p>Junction deviation requires a single value, whereas jerk has separate values for X and Y. You can leave them the same or enter independent values.</p>
</div>
<p>You should only change either acceleration or jerk/junction deviation/SCV/MISC for each test print, otherwise it will be impossible to know which parameter is responsible for any changes.</p>
<p><span class="sug">Suggested increments for how much to vary the value for each segment are shown in green.</span></p>
<table>
    <thead>
        <tr>
            <th>Reference diagram</th>
            <th>Segment</th>
            <th>Acceleration (mm/sec/sec)<p class="sug">&#177; 100 (moving bed i3)</p><p class="sug">&#177; 500 (coreXY / delta)</p></th>
                <th class="accMarlinContent jerktd">Jerk X<p class="sug">&#177; 1</p></th>
                <th class="accMarlinContent jerktd">Jerk Y<p class="sug">&#177; 1</p></th>
                <th class="accMarlinContent jerktd">Jerk Z (delta only)<p class="sug">&#177; 1</p></th>
                <th class="accMarlinContent jdtd">Junction deviation<p class="sug">&#177; 0.01 - 0.05</p></th>
                <th class="accKlipperContent">Squarer corner velocity (mm/sec)<p class="sug">&#177; 1</p></th>
                <th class="accRrfContent">Maximum Instantaneous Speed change X (mm/sec)<p class="sug">&#177; 1</p></th>
                <th class="accRrfContent">Maximum Instantaneous Speed change Y (mm/sec)<p class="sug">&#177; 1</p></th>
                <th class="accRrfContent">Maximum Instantaneous Speed change Z (mm/sec) (delta only)<p class="sug">&#177; 1</p></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="6" style="text-align: center;"><img src="img/accelerationdiagram.jpg" /></td>
            <td style="text-align: center;">F</td>
            <td><input type="number" name="accel_f1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_f2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_f3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_f5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_f4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_f6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_f7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_f8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_f9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">E</td>
            <td><input type="number" name="accel_e1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_e2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_e3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_e5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_e4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_e6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_e7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_e8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_e9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">D</td>
            <td><input type="number" name="accel_d1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_d2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_d3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_d5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_d4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_d6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_d7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_d8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_d9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">C</td>
            <td><input type="number" name="accel_c1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_c2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_c3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_c5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_c4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_c6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_c7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_c8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_c9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">B</td>
            <td><input type="number" name="accel_b1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_b2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_b3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_b5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_b4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_b6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_b7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_b8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_b9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
        <tr>
            <td style="text-align: center;">A</td>
            <td><input type="number" name="accel_a1" value="500" min="10" max="50000" step="10"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_a2" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_a3" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jerktd"><input type="number" name="accel_a5" value="8" min="1" max="30" step="1"></td>
            <td class="accMarlinContent jdtd"><input type="number" name="accel_a4" value="0.050" min="0.01" max="20" step="0.001"></td>
            <td class="accKlipperContent"><input type="number" name="accel_a6" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_a7" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_a8" value="5" min="0.1" max="50" step="0.1"></td>
            <td class="accRrfContent"><input type="number" name="accel_a9" value="5" min="0.1" max="50" step="0.1"></td>
        </tr>
    </tbody>
</table>`;

var endGcode = /*html*/ `<h4>Additional end gcode</h4>
<p>If you have additional end commands, tick the box and enter the gcode.</p>
<label>Additional end gcode:<input name="end" type="checkbox" onchange="displayCustom();" value="extraEnd"></label>
<label>Home all axes with G28 at the end (delta)<input name="deltaHome" type="checkbox" value="off"></label>
<div class="endExp">
    <p>For the majority of users, you can skip this section. Any gcode entered here will be inserted at the very end of the file.</p>
    <label>Strip <b>ALL</b> original end gcode and use only custom gcode instead: <input name="customEndOnly" type="checkbox"></label>
    <p class="warning">This option will remove all end gcode except what is entered in the box below. This means you are responsible for providing commands to shut down all heaters, fans, motors, etc. Advanced users only!</p>
    <textarea name="endgcode"></textarea>
</div>`;

var preview = /*html*/ `<p>It is advised to preview the generated gcode through your slicer or <a href="http://zupfe.velor.ca" target="_blank">Zupfe GCode Viewer</a> before printing.`;

function createForm(n){
    document.write('<input type="hidden" name="description" value="'+n+'">')
    document.write(nozzleLayer);
    document.write(startGcode);
    document.write(abl);
    document.write(bedDims);
    if(n == "firstlayer"){
        document.write(extraMargin);
    }
    if(n == "temperature"){
        document.write(tempTower)
    } else {
        document.write(tempReg)
    }
    if(n == "firstlayer"){
        document.write(pcFirstlayer);
    } else {
        document.write(pcReg);
    }
    if(n == "retraction"){
        document.write(retractionTower);
    } else {
        document.write(retractionReg);
    }
    if(n == "acceleration"){
        document.write(accel);
    } else if(n == "speed"){
        document.write(feedrateTower);
    } else {
        document.write(feedrateReg);
    }
    if(n == "temperature") {
        document.write(feedrateWarning);
    }
    document.write(endGcode);
    document.write(preview);
}      