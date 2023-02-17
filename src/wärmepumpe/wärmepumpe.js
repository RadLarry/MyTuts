// Midas Poolheizung
// v0.0.4
// Changelog:
// 0.0.4: Tokenverfall jetzt 60min nach Skriptstart und nicht zu jeder vollen Stunde (Dank an dering)
// 0.0.3: Datenpunkte beim Start automatisch anlegen (Dank an Andy200877)
// 0.0.2: Token bei jedem Set-Vorgang prüfen und ggf. neu anfordern (Dank an dering)

const username = "MAILADRESSE";
const password = "KENNWORT";
const interval = 30;

const cloudURL = "https://cloud.linked-go.com/cloudservice/api";

const dpRoot = "0_userdata.0.Poolheizung";

var token = "";
var tokenRefreshTimer;
var device = "";
var reachable = false;

function clearValues() {
    saveValue("error", true, "boolean");
    saveValue("consumption", 0, "number");
    saveValue("state", false, "boolean");
}

function saveValue(key, value, sType) {
    var dp = dpRoot + "." + key;

    if ( !existsState(dp )) {
        createState(dp,value,{name: key,  type: 'number', role: 'value'}, function () {});
    } else {
        setState(dp,value,true);
    }
}

function findCodeVal(result, code) {
    //log(code);
    for(var i=0; i<result.length; i++) {
        //log(result[i].code);

        if(result[i].code.indexOf(code) >= 0) {
            return result[i].value;
        }
    }
    return "";
}

function createobjects() {
    log ("erstelle Objekte");
    createState(dpRoot + '.ambient', {read: true, write: false,  type: "number", unit:"°C", name: "Umgebungstemperatur"});
    createState(dpRoot + '.connection', {read: true, write: false,  type: "boolean", role: "state", name: "Verbindung", def: "false"});
    createState(dpRoot + '.consumption', {read: true, write: false,  type: "number", unit:"W", name: "Stromverbrauch", def: 0});
    createState(dpRoot + '.error', {read: true, write: false,  type: "boolean", role: "state", name: "Fehler", def: "false"});
    createState(dpRoot + '.errorCode', {read: true, write: false,  type: "string", name: "Fehlercode", def: ""});
    createState(dpRoot + '.errorLevel', {read: true, write: false,  type: "number", name: "Fehlerlevel"});
    createState(dpRoot + '.errorMessage', {read: true, write: false,  type: "string", name: "Fehlermeldung", def: ""});
    createState(dpRoot + '.mode', {read: true, write: true,  type: "string", states: "-1:off;0:cool;1:heat;2:auto", name: "Modus", def: ""});
    createState(dpRoot + '.silent', {read: true, write: true,  type: "boolean", role: "state", name: "Silent", def: "false"});
    createState(dpRoot + '.state', {read: true, write: false,  type: "boolean", role: "state", name: "Status", def: "false"});
    createState(dpRoot + '.tempIn', {read: true, write: false,  type: "number", unit:"°C", name: "Eingangstemperatur"});
    createState(dpRoot + '.tempOut', {read: true, write: false,  type: "number", unit:"°C", name: "Ausgangstemperatur"});
    createState(dpRoot + '.tempSet', {read: true, write: true,  type: "number", unit:"°C", name: "Solltemperatur"});
}

function updateToken() {

    if(token=="") {
        log("Token Neuanforderung");
        var request = require('request');

        var options = {
            url: cloudURL + '/app/user/login.json',
            method: 'POST',
            json: { "user_name": username, "password": password, "type": "2" }
        };

        request(options,function (error, response, body){

            //log(JSON.stringify(response));
            if(parseInt(body.error_code)==0) {

                token = body.object_result["x-token"];
                //log("Login ok! Token " + token);
                updateDeviceID();
            } else {
                // Login-Fehler
                log(body.error_msg);
                token = "";
            }

        });
    } else {
        updateDeviceID();
    }





}

function updateDeviceID() {
    if(token!="") {
        var optionsDev = {
            url: cloudURL + '/app/device/deviceList.json',
            headers: { "x-token": token },
            method: 'POST',
            json: true
        };

        var request = require('request');

        request(optionsDev,function (error, response, body){

            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {

                //token = body.object_result["x-token"];
                //log("Login ok! Token " + token);
                device = body.object_result[0].device_code;
                reachable = (body.object_result[0].device_status=="ONLINE");
                if(reachable) {
                    saveValue("connection", true, "boolean");
                    if(device!="") updateDeviceStatus(device);
                } else {
                    // offline
                    device = "";
                    saveValue("connection", false, "boolean");
                }

            } else {
                // Login-Fehler
                log(body.error_msg);
                token = "";
                device = "";
                reachable = false;
                saveValue("connection", false, "boolean");
            }

        });
    }
}

function updateDeviceStatus(devicecode) {
    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/getDeviceStatus.json',
            headers: { "x-token": token },
            json: { "device_code": devicecode },
            method: 'POST',

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){

            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {

                if(body.object_result["is_fault"]==true) {
                    // TODO: Fehlerbeschreibung abrufen
                    //clearValues();
                    saveValue("error", true, "boolean");
                    updateDeviceDetails(devicecode);
                    updateDeviceErrorMsg(devicecode);
                } else {
                    // kein Fehler
                    saveValue("error", false, "boolean");
                    saveValue("errorMessage", "", "string");
                    saveValue("errorCode", "", "string");
                    saveValue("errorLevel", 0, "number");
                    updateDeviceDetails(devicecode);
                }

                //token = body.object_result["x-token"];
                //log("Login ok! Token " + token);

            } else {
                // Login-Fehler
                log(body.error_msg);
                token = "";
                device = "";
            }

        });
    }
}

function updateDeviceErrorMsg(devicecode) {
    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/getFaultDataByDeviceCode.json',
            headers: { "x-token": token },
            json: { "device_code": devicecode },
            method: 'POST',
            //headers: {"content-type": "application/json"},
            //charset: 'utf8',
            //json: true

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){

            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {


                saveValue("error", true, "boolean");
                saveValue("errorMessage", body.object_result[0].description, "string");
                saveValue("errorCode", body.object_result[0].fault_code, "string");
                saveValue("errorLevel", body.object_result[0].error_level, "string");

            } else {
                // Login-Fehler
                log(body.error_msg);
                token = "";
                device = "";
            }

        });
    }
}

function updateDeviceDetails(devicecode) {
    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/getDataByCode.json',
            headers: { "x-token": token },
            json: { "device_code": devicecode, "protocal_codes":["Power","Mode","Manual-mute","T01","T02","2074","2075","2076","2077","H03","Set_Temp","R08","R09","R10","R11","R01","R02","R03","T03","1158","1159","F17","H02","T04","T05","T07","T14"] },
            // "protocal_codes":["Power","Mode","Manual-mute","T01","T02","2074","2075","2076","2077","H03","Set_Temp","R08","R09","R10","R11","R01","R02","R03","T03","1158","1159","F17","H02","T04","T05"]
            method: 'POST',

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){


            if(parseInt(body.error_code)==0) {
                // Stromverbrauch T07 x T14 in Watt
                if(findCodeVal(body.object_result, "Power")=="1") {
                    saveValue("consumption", parseFloat(findCodeVal(body.object_result, "T07")) * parseFloat(findCodeVal(body.object_result, "T14")), "number");
                } else {
                    saveValue("consumption", 0, "number");
                }

                // Inlet-Temperatur T02
                saveValue("tempIn", parseFloat(findCodeVal(body.object_result, "T02")), "number");

                // outlet-Temperatur T03
                saveValue("tempOut", parseFloat(findCodeVal(body.object_result, "T03")), "number");

                // Ziel-Temperatur Set_Temp
                saveValue("tempSet", parseFloat(findCodeVal(body.object_result, "Set_Temp")), "number");

                // Umgebungs-Temperatur T05
                saveValue("ambient", parseFloat(findCodeVal(body.object_result, "T05")), "number");

                // Flüstermodus Manual-mute
                if(findCodeVal(body.object_result, "Manual-mute")=="1") {
                    saveValue("silent", true, "boolean");
                } else {
                    saveValue("silent", false, "boolean");
                }

                // Zustand Power
                if(findCodeVal(body.object_result, "Power")=="1") {
                    saveValue("state", true, "boolean");
                    saveValue("mode", findCodeVal(body.object_result,"Mode"), "string");
                } else {
                    saveValue("state", false, "boolean");
                    saveValue("mode", "-1", "string");
                }



                //log(findCodeVal(body.object_result, "T07"));

            } else {
                // Login-Fehler
                log(body.error_msg);
                token = "";
                device = "";
            }

        });
    }
}

function updateDevicePower(devicecode, power) {
    var powerOpt;
    var powerMode = 2;

    if(power==-1) {
        // aus
        powerOpt = 0;
        powerMode = -1;
    } else if(power==0) {
        // an und kühlen
        powerOpt = 1;
        powerMode = 0;
    } else if(power==1) {
        // an und heizen
        powerOpt = 1;
        powerMode = 1;
    } else if(power==2) {
        // an und auto
        powerOpt = 1;
        powerMode = 2;
    } else {
        log("ungülter Zustand!");
        return;
    }

    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/control.json',
            headers: { "x-token": token },
            json: {"param":[{ "device_code": devicecode, "protocol_code": "Power","value": powerOpt }]},
            method: 'POST',
        };

        var request = require('request');

        request(optionsDev,function (error, response, body){
            //log(devicecode);
            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {
                saveValue("mode", power, "string");
                if(power>=0) updateDeviceMode(device, power);

            } else {
                log("Zustandsänderung fehlgeschlagen!");
            }

        });
    }
}

function updateDeviceMode(devicecode, mode) {


    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/control.json',
            headers: { "x-token": token },
            json: {"param":[{ "device_code": devicecode, "protocol_code": "mode","value": mode }]},
            method: 'POST',
            //headers: {"content-type": "application/json"},
            //charset: 'utf8',
            //json: true

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){
            //log(devicecode);
            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {
                saveValue("mode", mode, "string");


            } else {
                log("Zustandsänderung fehlgeschlagen!");
            }

        });
    }
}

function updateDeviceSilent(devicecode, silent) {

    var silentMode;

    if(silent) {
        silentMode = "1";
    } else {
        silentMode = "0";
    }

    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/control.json',
            headers: { "x-token": token },
            json: {"param":[{ "device_code": devicecode, "protocol_code": "Manual-mute","value": silentMode }]},
            method: 'POST',
            //headers: {"content-type": "application/json"},
            //charset: 'utf8',
            //json: true

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){
            //log(devicecode);
            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {
                saveValue("silent", silent, "boolean");


            } else {
                log("Zustandsänderung fehlgeschlagen!");
            }

        });
    }
}

function updateDeviceSetTemp(devicecode, temperature) {

    var sTemperature = temperature.toString().replace(",", ".");
    var sMode = getState(dpRoot + ".mode").val;
    if(sMode=="-1") {
        //log("Gerät einschalten um Temperatur zu ändern!", 'warn');
        return;
    } else if(sMode=="0") {
        sMode = "R01"; // Kühlen
    } else if(sMode=="1") {
        sMode = "R02"; // Heizen
    } else if(sMode=="2") {
        sMode = "R03"; // Auto
    }




    if(token!="") {

        var optionsDev = {
            url: cloudURL + '/app/device/control.json',
            headers: { "x-token": token },
            json: {"param":[{ "device_code": devicecode, "protocol_code": "R01","value": sTemperature },{ "device_code": devicecode, "protocol_code": "R02","value": sTemperature },{ "device_code": devicecode, "protocol_code": "R03","value": sTemperature },{ "device_code": devicecode, "protocol_code": "Set_Temp","value": sTemperature }]},
            method: 'POST',
            //headers: {"content-type": "application/json"},
            //charset: 'utf8',
            //json: true

        };

        var request = require('request');

        request(optionsDev,function (error, response, body){
            //log(devicecode);
            //log(JSON.stringify(response));
            //log(JSON.stringify(body.object_result));

            if(parseInt(body.error_code)==0) {
                saveValue("tempSet", temperature, "number");


            } else {
                log("Zustandsänderung fehlgeschlagen!");
                log(JSON.stringify(response));
            }

        });
    }
}

// Beginn des Skripts

createobjects(); // DPs anlegen

updateToken(); // Zugriffstoken erfragen und aktuelle Werte lesen

schedule('*/' + interval + ' * * * * *', function () {
    // regelmäßig Token und Zustand abfragen
    updateToken();

    // gewünschte Änderungen ausführen
    if(!getState(dpRoot + ".mode").ack) {
        updateDevicePower(device, getState(dpRoot + ".mode").val);
    }
    if(!getState(dpRoot + ".silent").ack) {
        updateDevicePower(device, getState(dpRoot + ".silent").val);
    }
});

tokenRefreshTimer = setInterval(async function () {
    // Token verfällt nach 60min
    token = "";
    //log("Token nach Intervall verworfen.")
    updateToken();
}, 3600000);

on({id: dpRoot + ".mode", change: "ne", ack: false}, async function (obj) {
    updateToken();
    updateDevicePower(device, getState(dpRoot + ".mode").val);
});

on({id: dpRoot + ".silent", change: "ne", ack: false}, async function (obj) {
    updateToken();
    updateDeviceSilent(device, getState(dpRoot + ".silent").val);
});

on({id: dpRoot + ".tempSet", change: "ne", ack: false}, async function (obj) {
    updateToken();
    updateDeviceSetTemp(device, getState(dpRoot + ".tempSet").val);
});
