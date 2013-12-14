var fs = require('fs');
var express = require('express');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(express.bodyParser({uploadDir:'./public/uploads'}));
app.use(express.json());
app.use(app.router);
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/midi-up', function(req, res, next){
    var files = req.files;
    var path = files.upload.path;
    var name = path.substring(15);
    return res.send(name);
});

app.get('/download-mp3', function(req, res, next){
    var dir = './public/uploads';
    var data = [];
    fs.readdir(dir, function(err, files){
        if(err) throw err;
        var url = "/uploads/";
        files.forEach(function(file){
            var href = url + file; 
            data.push({link : href, name : file});
        });
        console.log(data)
        res.render('download', {data:data});
    });
    return;
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

  fs.writeFile(__dirname + '/start.log', 'started');
});