const livingSDK = require('./scripts/livingSDK');
let express = require('express');
let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const md5 = require('blueimp-md5');

let lsdk = new livingSDK('https://my.living-apps.de', 'your username', 'your password');


let oldres = undefined;
setInterval(() => {
    dataPromise()
        .then((res) => {
            if (md5(res) !== md5(oldres))
                io.emit('data', res);
        })
        .catch((err) => {
            console.error(err.message);
        })
}, 5000);


io.on('connection', (socket) => {
    console.log('user connected');
    dataPromise().then((res) => {
        socket.emit('data', res);
    });

    socket.on('update', (name, anwesenheit) => {

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

                return recordToUpdate.update({anwesend: anwesenheit}).then ((res) => {

                    if (res.Record) {
                        console.log('success');
                    }

                })

            }



        })
        .then (() => {
            dataPromise().then((res) => {
                io.emit('data', res);
            });
        })
        .catch((err) => {
            console.error(err.message);
        })

    })

})


http.listen(3000, function () {
    console.log('listening on *:3000');
});



// return data promise to client
function dataPromise () {
    return new Promise((resolve, reject) => {
        lsdk.get('your appid').then((res) => {

            let globals = res.globals;
            let datasources = res.datasources;
            let app = datasources.get('basic').app;
            let r = app.records.values();
            let k = [];
            let counter = 0;

            for (let d of r) {
                k[counter] = {};
                for (let ident of app.controls.keys()) {
                    k[counter][ident] = d.fields.get(ident).value;
                }
                counter++;
            }

            resolve(k);

        })
    });
}