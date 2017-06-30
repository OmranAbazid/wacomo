var app = require('express')(); // Create an instance of an Express app

app.get("/", function(req, res, err){
    res.send("hello world");
});



app.listen(process.env.PORT || 3000);