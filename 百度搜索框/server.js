var http = require('http');
var logger = require('morgan');
var fs = require('fs');
var datas = require('./data');

var connect = require('connect');

var server = connect.createServer();

var allowCrossDomain = function(req, res, next) {
        // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
   next();
}

server.use(connect.logger('dev'));

server.use(connect.static(__dirname+'/public'));

server.use(allowCrossDomain);
server.use(connect.bodyParser());

server.use(function(req, res, next) {
	if(req.method == 'GET' && req.url == '/') {
       
       res.writeHead(200, {'Content-Type': 'text/html'});
       fs.createReadStream(__dirname + '/index.html').pipe(res);
	} else {
		next();
	}
})

server.use(function(req, res, next) {
    
   var inputData,
       result;    
   if(req.method == 'POST' && req.url.substr(0,7) == '/search') {
        
        inputData = req.body.data;
        result = searchMatch(inputData);
        console.log(result);
        res.end(JSON.stringify(result));
        
   } else {
   	 next();
   }
});



function searchMatch(data) {
	var result = [];
    for(var i = 0, len = datas.length; i < len; i++) {
    	if(datas[i].indexOf(data) !== -1) {
            result.push(datas[i]);
    	}
    }

    return result;
}

server.listen(3000);