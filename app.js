var app = require('express')(); // Create an instance of an Express app
var mobileApp = require('azure-mobile-apps')();
app.use(mobileApp);
app.get("/", function(req, res, err) {
    res.send("hello world");
});
app.get("/test", function(req, res, err) {
    var query = {            
        sql: 'Select * from wacomo',
                    parameters: []        
    };         
    req.azureMobile.data.execute(query).then(function(results) {            
        res.json(results);        
    });
});
app.listen(process.env.PORT || 3000);