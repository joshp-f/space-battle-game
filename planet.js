function planet(name,x,y){
	this.name = name;
	this.x = x;
	this.y = y;
	this.radius = 30;
	this.color = {r:255,g:255,b:255};
	this.stats = {
		score:100,
		regen:1,
		speed:5,
		tradespeed:1,
		max:100,
		range:400,
		owner:'w',
		attacking:false,
		trading:false,
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