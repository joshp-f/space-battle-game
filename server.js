var express = require('express');
var socket = require('socket.io');
var universe = require('./universe.js');
var user = require('./user.js');
console.log("starting");
var universe = new universe(1000,1000,20);
console.log("finished");
var users = {};
var onlineUsers = {};
var app = express();

var server = app.listen(80);
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
		user.requestFrequency = (user.requestFrequency <= 20)?0:user.requestFrequency-20;
		if(Date.now()-user.timeActive > 120000 || user.requestFreqency > 1000){//timeout period and ddos stopper
			delete onlineUsers[name];
			//this loop changes all planets to wild
			for(var planet in universe.planetOwners[name]){
				universe.changeOwner(planet,name,universe.wildID);
			}
			user.socket.emit('endGame',"forfeit via timeout");
		}
		//lost control of all planets
		else if(Object.keys(universe.planetOwners[name]).length === 0){
			delete onlineUsers[name];
			user.socket.emit('endGame',"you have been defeated");
		}
		else{
			var pid = user.current;
			//putting users here isnt great but eh
			var data = universe.collectPlanetData(pid,users);
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
	users[id].requestFrequency++;

}
//checks is an enemy planet when attacking
function requestLink(data,id){
	var from = universe.findPlanet(data.from);
	var to = universe.findPlanet(data.to);
	//findplanet checks valid data format
	if(from && to && from.getOwner() === id){
		universe.createLink(data.from,data.to);
	}
	users[id].timeActive = Date.now();
	users[id].requestFrequency++;
}
function requestLogin(data,socket){
	console.log("login attempt:"+data);
	//valid username
	//regex checks for 1-16 alpha numeric characters
	var rightchars = /^[a-z0-9]{1,16}$/i;
	//typeof attempts to stop shadiness
	if( typeof data === 'string' && rightchars.test(data)){
		var newp = universe.chooseHomePlanet(socket.id);
		if(!newp){
			socket.emit('initialise',{success:false,message:'there are currently no free planets to take control of, try again later'});
		}
		else{
			users[socket.id] = new user(newp,data,socket);
			//states user is online
			onlineUsers[socket.id] = true;

			var id = users[socket.id].home;
			var planet = universe.findPlanet(id);

			socket.on('updateScreen',function(data){updateScreen(data,socket.id);});
			socket.on('requestLink',function(data){requestLink(data,socket.id);});
			socket.on('ping',function(data){receivePing(socket.id)});
			socket.emit('initialise',{success:true,home:id,x:planet.x,y:planet.y,userid:socket.id});
		}
	}
	else{
		socket.emit('initialise',{success:false,message:'name must be < 17 chars and alpha numeric'});
	}
	function reveivePing(id){

	}

}
