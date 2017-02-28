function user(home,name,socket){
	//home planet
	this.name = name;
	this.home = home;
	this.current = home;
	this.socket = socket;
	this.timeActive = Date.now();
	this.planets = {};
}
module.exports = user;