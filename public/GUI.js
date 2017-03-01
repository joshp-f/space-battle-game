function GUI(){
	this.gameUI = {};
	this.loginUI = {};
	//position is relative to statbar
	this.display = function(isowner,planet){
	}
	this.onClick = function(x,y,isowner){
		return false;
	}
	this.createLoginUI = function(){
		this.loginUI = { 
			nameBox:createInput('enter username'),
			submitBox:createButton('submit'),
			responseBox:createP('name your space empire'),
			tutorialBox:createP('Click on planets to recentre your view.' + 
				'<br> Drag from a planet you own to another to create links' + 
				'<br> Dragging to an enemy planet in attack range will start an attack' + 
				'<br> Dragging to an allied planet will begin trade' + 
				'<br> recreate links to destroy existing ones'),

		}
		this.loginUI.responseBox.style("color","#ffffff");
		this.loginUI.tutorialBox.position(20,300);


	}
	this.removeLoginUI = function(){
		for(var elem in this.loginUI){
			this.loginUI[elem].remove();
		}
	}
	this.createGameUI = function(){
		var grey = color(200,200,200,130);
		this.gameUI.leaderboard = createDiv('leaderboard:');
		this.gameUI.leaderboard.position(width-300,50);
		//this.gameUI.leaderboard.style("color", "#afafaf");
		this.gameUI.leaderboard.style("background-color", grey);
		this.gameUI.leaderboard.style("font-size","20px");
		this.gameUI.leaderboard.style("width","250px");
		this.gameUI.leaderboard.style("height","500px");
		this.gameUI.leaderboard.style('z-index','1');


	}
	this.changeleaderboard = function(data){
		var text = "leaderboard:";
		for (var i = 0; i < data.length; i++){
			text += "<br>" + (i+1) + "- " + data[i].name + " - " + data[i].score;
		}
		this.gameUI.leaderboard.html(text);
	}

}