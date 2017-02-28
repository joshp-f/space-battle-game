var express = require('express');
var socket = require('socket.io');
var universe = require('./universe.js');
var user = require('./user.js');
console.log("starting");
var universe = new universe(400,400,10);
console.log("finished");
var users = {};
var onlineUsers = {};
var app = express();
var server = app.listen(8000);
app.use(express.static('public'));

var io = socket(server);

io.sockets.on('connection', newConnection);

updateUniverse();
function newConnection(socket){
	socket.on('requestLogin',function(data){requestLogin(data,socket);});

}

function updateUniverse(){
	for(var name in onlineUsers){
		var user = users[name];
		if(Date.now()-user.timeActive > 10000){//timeout period
			delete onlineUsers[name];
			user.socket.emit('endGame',"forfeit via timeout");
		}
		//lost control of all planets
		else if(Object.keys(universe.planetOwners[name]).length === 0){
			delete onlineUsers[name];
			user.socket.emit('endGame',"you have been defeated");
		}
		else{
			var pid = user.current;
			var data = universe.collectPlanetData(pid);
			for(var i = 0; i < data.scores.length;i++){
				data.scores[i].name = users[data.scores[i].name].name;
			}
			user.socket.emit('universe',data);

		}
	}
	universe.ticks++;
	setTimeout(function(){updateUniverse();},universe.updateFrequency);
}
//FROM CLIENT DANGER!!!
function updateScreen(data,id){
	//checks input is numric
	if(!isNaN(data)){
		if(universe.findPlanet(data)){
			users[id].current = data;
			users[id].timeActive = Date.now();
		}
	}
}
//checks is an enemy planet when attacking
function requestLink(data,id){
	var from = universe.findPlanet(data.from);
	var to = universe.findPlanet(data.to);
	if(from && to && from.getOwner() === id){
		universe.createLink(data);
	}
	users[id].timeActive = Date.now();

}function requestLogin(data,socket){
	console.log("login attempt:"+data);
	//valid username
	//regex checks for 1-16 alpha numeric characters
	var rightchars = /^[a-z0-9]{1,16}$/i;
	if(rightchars.test(data)){
		users[socket.id] = new user(universe.chooseHomePlanet(socket.id),data,socket);
		//states user is online
		onlineUsers[socket.id] = true;

		var id = users[socket.id].home;
		var planet = universe.findPlanet(id);

		socket.on('updateScreen',function(data){updateScreen(data,socket.id);});
		socket.on('requestLink',function(data){requestLink(data,socket.id);});
		socket.emit('initialise',{success:true,home:id,x:planet.x,y:planet.y,userid:socket.id});
	}
	else{
		socket.emit('initialise',{success:false});
	}

}
