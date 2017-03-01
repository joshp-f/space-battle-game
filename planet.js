function planet(name,x,y){
	this.x = x;
	this.y = y;
	this.radius = 20 + Math.random()*20;;
	this.color = {r:150+Math.random()*75,g:150+Math.random()*75,b:150+Math.random()*75};
	this.basename = name;
	this.stats = {
		max:80 + Math.floor(this.radius),
		score:80,
		regen:1,
		speed:5,
		tradespeed:1,
		range:400,
		owner:'w',
		attacking:false,
		trading:false,
		name:name,
	}
	this.tick = 0;

	this.makeHome = function(userid){
		this.stats.max = 200;
		this.stats.score = 200;
	}

	this.getOwner = function(){
		return this.stats.owner;
	}
	this.changeOwner = function(newowner){
		this.stats.score = 0;
		this.stats.owner = newowner;
		this.stats.attacking = false;
		this.stats.trading = false;
	}
}
module.exports = planet;