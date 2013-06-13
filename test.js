var jp = require('./index.js')
  , http = require('http')

var opts = {
  tag : "</head>"
, payload: "...payload..."
}

var cb = function(){}

var jelly = jp(opts, cb, 1066)
jelly.listen(1077);

var contentServer = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello World </head>');
}) 
contentServer.listen(1066)



// GET -> JellyProxy:1077 -> ContentServer:1066
http.get("http://localhost:1077/foo", function(res){
  var pageData = ""
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    pageData += chunk
  })

  res.on('end', function(){
    console.log("Response:", pageData)
    var expected = "Hello World ...payload...</head>"

    if (pageData != expected){
      throw "Response did not match:" + expected
    }
    contentServer.close()
    jelly.close()
  })
}).on("error", function(e){
 throw e;
})





