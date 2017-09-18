const five = require('johnny-five');
const livingSDK = require('./scripts/livingSDK');
const io = require('socket.io-client');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();


let lsdk = new livingSDK('https://my.living-apps.de', 'your username', 'your password');
const name = "Rene";

let board = five.Board({
    port: '/dev/ttyACM0'
});

let anwesend = false;

// check anwesenheit
setInterval(() => {
    dataPromise().then((res) => {
        anwesend = res.fields.get('anwesend').value;
        console.log(anwesend);
        myEmitter.emit('changecolor');
    })
}, 10000)

board.on('ready', () => {

    let button = new five.Button(2);
    
    button.on('press', () => {
        lsdk.get('your appid').then((res) => {

            let globals = res.globals;
            let datasources = res.datasources;
            let app = datasources.get('basic').app;
            let r = app.records.values();
            let recordToUpdate;

            for (let d of r) {

                if (d.fields.get('name').value === name) {
                    recordToUpdate = d;
                }

            }

            if (recordToUpdate === undefined) {

                return;

            } else {

                return recordToUpdate.update({ anwesend: anwesend }).then((res) => {

                    if (res.Record) {
                        console.log('success');
                        anwesend = !anwesend;
                        myEmitter.emit('changeColor');
                    }

                })

            }
        })


        let led = new five.Led.RGB([9, 10, 11]);
        led.on();
        led.color(anwesend ? "green" : "red");
        myEmitter.on('changecolor', (color) => {
            led.color(anwesend ? "green" : "red");
        });
    })


})


function dataPromise () {
    return new Promise((resolve, reject) => {
        lsdk.get('your appid').then((res) => {

            let globals = res.globals;
            let datasources = res.datasources;
            let app = datasources.get('basic').app;
            let r = app.records.values();
            let k;
            let counter = 0;

            for (let d of r) {

                if (d.fields.get('name').value === name) {
                    k = d;
                }

            }
            if (k === undefined){
                reject('unknown user')
            } else {
                resolve(k);
            }
        })
    });
}