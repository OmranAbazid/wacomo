var express = require('express');
var app = express();
var path = require('path');
var mobileApp = require('azure-mobile-apps')();
var request = require('request');

/*==================================
=            Middleware            =
==================================*/
app.use(mobileApp);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');



/*==============================
=            Routes            =
==============================*/

app.get("/data", function(req, res, err) {
    var query = {
        sql: 'Select * from wacomo',
        parameters: []
    };         
    req.azureMobile.data.execute(query).then(function(results) {         
        return res.json(results);
    });
});

app.get("/devices", function(req, res, err) {
    var query = {
        sql: 'Select * from devices',
        parameters: []        
    };         
    req.azureMobile.data.execute(query).then(function(results) {            
        return res.json(results);
    });
});

app.get("/devices/:id", function(req, res, err) {
    var query = {
        sql: 'Select * from wacomo where device_id == @device',
        parameters: [{
            name: 'device',
            value: req.params.id
        }]        
    };         
    req.azureMobile.data.execute(query).then(function(results) {            
        return res.json(results);
    }).catch(function(err) {
        return res.send("404: NOT found");
    });
});

app.get("/", function(req, res, err) {
    request.get('http://wacomo2.azurewebsites.net/devices',
        function(err, response, body) {
            res.render("pages/index", {
                "devices": JSON.parse(body)
            });
        });
});

app.get("/:device", function(req, res, err) {
    //TO-DO: check if device in the list of devices
    request.get('http://wacomo2.azurewebsites.net/devices',
        function(err, response, body) {
            res.render("pages/device", {
                "devices": JSON.parse(body),
                "device": req.params.device
            });
        });
});

/*=====  End  ======*/


app.listen(process.env.PORT || 3000, function() {
    console.log("listening on port 3000");
});