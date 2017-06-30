
module.exports = {
    "get": function (req, res, next) {
        var query = {
            sql: 'Select * from wacomo',
            parameters: []
        };
 
        req.azureMobile.data.execute(query).then(function (results) {
            res.json(results);
        });
        
    }
}
