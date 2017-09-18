let livingSDK = require('./scripts/livingSDK.js');
let md5 = require('blueimp-md5');
let Alexa = require('alexa-sdk');

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
}


let handlers = {
    anwesend: function () {
        var intentObj = this.event.request.intent;
        let hoo = this;
        let lsdk= new livingSDK("https://my.living-apps.de", "your username", "your password");
        let data = lsdk.get("your appid");
        return data.then((res) => {
            let globals = res.globals;
            let datasources = res.datasources;
            let app = datasources.get('basic').app;
            let r = app.records.values();
            let Anwesenheit = false;
            // get last record
            for (let d of r) {
                if (d.fields.get('name').value.toLowerCase() === intentObj.slots.Name.value.toLowerCase() && d.fields.get('anwesend').value) {
                    Anwesenheit = true;
                }
            }
            hoo.emit(':tell', `Der Mitarbeiter ${intentObj.slots.Name.value} ist ${Anwesenheit ? '': ' nicht '} anwesend` );
        })
        .catch((err) => {
            console.log(err.message);
        })
    },
    Unhandled: function () {
        this.emit(':ask', 'Ich habe dich leider nicht verstanden.', 'Wiederhole bitte deine Eingabe');
    }
}
