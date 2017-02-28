var socket;
var screen;
var universe;
var GUI;
var loggedin = false;
var alive = false;
var deathmessage = "";
function setup() {
	universe = new universe();
	screen = new screen(-1,0,0);
	GUI = new GUI();
	GUI.createLoginUI();
	GUI.loginUI.submitBox.mousePressed(function(){tryLogin(GUI.loginUI.nameBox.value())});
	socket = io.connect('http://space-core-server-mp-space.44fs.preview.openshiftapps.com');
	//socket = io.connect('http://localhost:8080');
	socket.on('initialise',initialiseScreen);
	socket.on('universe',	writeUniverse);
	socket.on('endGame', endGame);
	canvas = createCanvas(windowWidth,windowHeight);
	canvas.position(0,0);
	canvas.style('z-index','-1');
}

function draw() {
	if(!loggedin){
		background(0);
	}
	else if(alive){
		background(0);

		var curplanet = universe.findPlanet(screen.planet);
		push();
		screen.translateScreen();
		if( curplanet && universe.userid === curplanet.getOwner()){
			curplanet.displayRange();
		}
		if(screen.dragging){
			screen.displayLine(mouseX,mouseY);
		}
		universe.display();

		pop();
		if(curplanet){
			GUI.display(universe.isOwner(screen.planet),curplanet);
		}

	}
	else{
		background(0,0,0,10);
		textSize(84);
		stroke(255,0,0,50);
		fill(255,0,0,40);
		strokeWeight(2);
		text(deathmessage,100,200);

	}
}

function initialiseScreen(data){
	if(data.success){
		universe.userid = data.userid;
		screen.move(data.home,data.x,data.y,false);
		loggedin = true;
		alive = true;
		GUI.removeLoginUI();
		GUI.createGameUI();

	}
	else{
		GUI.loginUI.responseBox.html("invalid name, try again");
	}

}

function writeUniverse(data){
	universe.changeData(data.planets);
	GUI.changeleaderboard(data.scores);
	//not totally sure this line is okay
	//universe = data;
	//only start doing stuff now
}

function mousePressed(){
	if(loggedin){
		var tempPos = screen.getPos(mouseX,mouseY);
		var tempId = universe.detectPlanet(tempPos.x,tempPos.y);
		var planet = universe.findPlanet(tempId);
		if(tempId && planet.getOwner() === universe.userid){
			screen.dragging = true;
			screen.dragFrom = planet;
			screen.dragID = tempId;
		}
	}
}

function mouseReleased(){
	if(loggedin){
		if(GUI.onClick(mouseX,mouseY,universe.isOwner(screen.planet))){
		}
		else{
			var tempPos = screen.getPos(mouseX,mouseY);
			var tempId = universe.detectPlanet(tempPos.x,tempPos.y);
			//if planet clicked
			if (tempId){
				if(screen.dragging && tempId != screen.dragID){
					socket.emit('requestLink',{from:screen.dragID,to:tempId});
				}
				else{
					screen.move(tempId,universe.findPlanet(tempId).x,universe.findPlanet(tempId).y,true);
					socket.emit('updateScreen',screen.planet);
				}
			}
		}
		screen.dragging = false;
	}
}

function tryLogin(name){
	socket.emit('requestLogin',name);
}

function endGame(data){
	alive = false;
	deathmessage = data;
}