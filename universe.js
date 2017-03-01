function universe(rangeX,rangeY,numplanets){
	var planet = require('./planet.js');
	var generatePlanetName = require('./generatePlanetName.js');
	var hypot = require('compute-hypot');
	this.size = {x:rangeX,y:rangeY};
	this.planetnum = numplanets;
	this.planets = {};
	//hash mapping owners to planets they own-- include AI
	this.wildID = 'w';
	this.planetOwners = {[this.wildID]:{}};
	//planet generator condition for regenerating
	this.mindist = 75;
	//how often sockets send data in milliseconds
	this.updateFrequency = 800;
	//planetfinder: first index is x pos / 1000, second index is y pos/ 1000;
	this.planetfinder = {};
	this.regionSize = 800;
	this.ticks = 0;
	this.scores = {};

	this.generatePlanets = function(){
		var i = 0;
		var points = [];
		while(i < this.planetnum){
			//planets generate a min dist from each other (not perfect function though, n^2 worst case)
			var validpoint = true;
			var pos = {x:this.size.x*Math.random(),y:this.size.y*Math.random()};
			for (var j = 0; j < i;j++){
				if (hypot(pos.x-points[j].x,pos.y-points[j].y) < this.mindist){
					validpoint = false;
				}
			}
			if (validpoint){
				points.push(pos);
				i++;
			}
		}
		for (var i = 0; i < this.planetnum;i++){
			var index = i+1;
			var x = points[i].x;
			var y = points[i].y;
			this.planets[index] = new planet(generatePlanetName(2+Math.floor(Math.random()*10)),x,y);
			// THIS COULD CAUSE POTENTIAL PROBLEMS WITH USERNAMES LATER !!!! TODO FIX
			this.planetOwners['w'][index] = true;
			var xid = Math.floor(x/this.regionSize);
			var yid = Math.floor(y/this.regionSize);
			//sets up planetfinder dict maze
			if(this.planetfinder.hasOwnProperty(xid)){
				if(this.planetfinder[xid].hasOwnProperty(yid)){
					this.planetfinder[xid][yid].push(index);
				}
				else{
					this.planetfinder[xid][yid] = [index];
				}
			}
			else{
				this.planetfinder[xid] = {[yid]:[index]};
			}
		}
	}
	this.chooseHomePlanet = function(sock){
		for (var id in this.planets){
			//chooses first planet
			var planet = this.findPlanet(id);
			if(planet.getOwner() === this.wildID){
				this.planetOwners[sock] = {};
				this.changeOwner(id,this.wildID,sock);
				planet.makeHome(sock);

				return id;
			}
		}
		//stub for case where no planets left- does nothing
		return false;
	}

	this.findPlanet = function(id){
		var nid = parseInt(id);
		//can replace with more efficient search later
		if( Number.isInteger(nid) && this.planets.hasOwnProperty(id)){
			return this.planets[id];

		}
		return false;
	}

	//this object is sent through socket as JSON-minimised to necessary data
	//causes stats of all observed planets to be updated
	this.collectPlanetData = function(id){
		var output = {};
		var ids = [];
		var planet = this.findPlanet(id);
		xid = Math.floor(planet.x/this.regionSize);
		yid = Math.floor(planet.y/this.regionSize);
		//takes 3x3 grid
		for(var i = xid-1;i < xid+2;i++){
			for(var j = yid-1;j<yid+2;j++){
				if(this.planetfinder.hasOwnProperty(i)){
					if(this.planetfinder[i].hasOwnProperty(j)){
						ids = ids.concat(this.planetfinder[i][j]);
					}
				}
			}
		}
		for(var k in ids){
			var planet = this.findPlanet(ids[k]);
			this.processStats(ids[k]);
			output[ids[k]] = {x:planet.x,y:planet.y,name:planet.name,radius:planet.radius,color:planet.color,stats:planet.stats};
		}
		//TODO
		var scores = this.grabScores();
		return {scores:scores,planets:output};
	}
	this.createLink = function(idfrom,idto){
		var from = this.findPlanet(idfrom);
		var to = this.findPlanet(idto);
		if(hypot(from.x-to.x,from.y-to.y)<from.stats.range){
			if(from.getOwner() != to.getOwner()){
				//removes link
				if(from.stats.attacking === idto){
					from.stats.attacking = false;
				}
				else{
					from.stats.attacking = idto;
				}
			}
			else{
				//removes link
				if(from.stats.trading === idto){
					from.stats.trading = false;
				}
				else{
					from.stats.trading = idto;

				}
			}
		}
	}

	this.processStats = function(planetid){
		var planet = this.findPlanet(planetid);
		if (planet.tick != this.ticks){
			planet.stats.score+=planet.stats.regen;
			if(planet.stats.attacking){
				var def = this.findPlanet(planet.stats.attacking);
				//checks attacking valid target
				if (planet.stats.owner === def.stats.owner){
					planet.stats.attacking = false;
				}
				else{
					planet.stats.score -= planet.stats.speed;
					def.stats.score -= planet.stats.speed;

					//checks enough score to attack
					if(planet.stats.score < 0){
						def.stats.score -= planet.stats.score;
						planet.stats.score = 0;
					}
					//checks if anough attack to swap planet control
					if(def.stats.score < 0){
						this.changeOwner(planet.stats.attacking,def.stats.owner,planet.stats.owner);
					}
				}
			}
			if(planet.stats.trading){
				var def = this.findPlanet(planet.stats.trading);
				//checks trading with valid target
				if(def.stats.owner != planet.stats.owner){
					planet.stats.trading = false;

				}
				else{
					planet.stats.score -= planet.stats.tradespeed;
					def.stats.score += planet.stats.tradespeed;
					//checks enough score to trade
					if(planet.stats.score < 0){
						def.stats.score += planet.stats.score;
						planet.stats.score = 0;
					}
				}
			}
			if(planet.stats.score > planet.stats.max){
				//restricts max score
				planet.stats.score = planet.stats.max;
			}
		}
		planet.tick = this.ticks;

	}

	this.changeOwner = function(planet,oldowner,newowner){
		delete this.planetOwners[oldowner][[planet]];
		this.planetOwners[newowner][planet] = true;
		this.findPlanet(planet).changeOwner(newowner);

	}
	this.grabScores = function(){
		var scores = [];
		for(var owner in this.planetOwners){
			if(owner != this.wildID){
				var total = 0;
				for(var p in this.planetOwners[owner]){
					total += this.findPlanet(p).stats.max;
				}
				scores.push({name:[owner],score:[total]});
			}
		}
		scores.sort(function(a,b){return b.score-a.score});
		scores = scores.slice(0,9);
		return scores;
	}
	this.generatePlanets();

}
module.exports = universe;
