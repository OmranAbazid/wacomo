var express = require('express');
var app = express();
var path = require('path');
var mobileApp = require('azure-mobile-apps')();

app.use(mobileApp);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get("/", function(req, res, err) {
  res.render("pages/index");
});

app.get("/data", function(req, res, err) {
  var query = {
    sql: 'Select * from wacomo',
    parameters: []        
  };         
  req.azureMobile.data.execute(query).then(function(results) {            
    res.json(results);        
  });
});


app.get("/devices", function(req, res, err) {
  var query = {
    sql: 'Select * from devices',
    parameters: []        
  };         
  req.azureMobile.data.execute(query).then(function(results) {            
    res.json(results);        
  });
});

app.get("/:page", function(req, res, err) {
  res.render(req.param.page);
});

app.listen(process.env.PORT || 3000);