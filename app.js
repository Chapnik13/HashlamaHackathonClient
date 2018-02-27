var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
//var AsyncLock = require('async-lock');
var fs = require('fs');
//var lock = new AsyncLock();
var imageAddr;
var ardunioAddr;
var jsonMessage = 'No Data';
var image;
var rawJsonData;
var blackBoxesImageDict = []; 
var blackBoxesArduinoDict = [];
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
 
app.get('/IDS', function(req, res) {
  var idKeys = Object.keys(blackBoxesImageDict);
  var current;
  var jsonItem = [];
    idKeys.forEach(function(Id) 
    {
      current = {
        id: Id.toString(),
        name: 'Input ' + Id.toString()
      };
      jsonItem.push(current);
    });
    var ret = {
      availableOptions: jsonItem,
      selectedOption: current,
    }
  res.send(ret);
});

app.get('/image/:imageId', function(req, res) {
    console.log('Image sent!!!!!');
    res.send(blackBoxesImageDict[req.params.imageId]);
  });
app.get('/arduino/:arduinoId', function(req, res) {
    console.log('arduino data sent!!!!!', rawJsonData);
    res.send(blackBoxesArduinoDict[req.params.arduinoId]);
});

app.get('/image', function(req, res) {
  // console.log('Image sent!!!!!');
  // res.send(image);
});
app.get('/arduino', function(req, res) {
  // console.log('arduino data sent!!!!!', rawJsonData);
  // res.send(rawJsonData);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//UDP Socket
var udp = require('dgram');

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message',function(msg,info){
 
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
 

  console.log(msg);
  jsonMessage = JSON.parse(msg);
  console.log(jsonMessage);

  if(jsonMessage.Type === 'Image') {
    console.log("accessed!");
      imageAddr = '/image' + jsonMessage.Id;
      image64 = jsonMessage.Bitmap;
      // var imageBuffer = Buffer.from(image64, 'base64');
      // fs.writeFile('mynewfile3.jpeg', imageBuffer, function (err) {
      //   if (err) throw err;
      //   console.log('Saved!');
      // });
      image= image64;
      blackBoxesImageDict[jsonMessage.Id] = image64;
  }
  else if(jsonMessage.Type === 'Arduino') {
    ardunioAddr = '/arduino' + jsonMessage.Id;
    rawJsonData = jsonMessage;
    //console.log('initial', rawJsonData)
    blackBoxesArduinoDict[jsonMessage.Id] = rawJsonData;
  }
});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port: ' + port);
  console.log('Server IP: ' + ipaddr);
  console.log('Server is IP4/IP6: ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed! ');
});

server.bind(2222);

module.exports = app;
