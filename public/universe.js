function universe(){
	this.planets = {};
	//holds connection id
	universe.userid = -1;

	this.display = function(){
		this.displayLinks();
		this.displayPlanets();
	}

	this.detectPlanet = function(x,y){//stub can be replaced with hash search
		for (var id in this.planets){
			if (this.planets[id].posInside(x,y)){
				return id;
			}
		}
		return false;
	}

	this.changeData = function(data){
		for (var key in data){
			if(this.planets.hasOwnProperty(key)){
				this.findPlanet(key).overrideStats(data[key]);
			}
			else{
				this.planets[key] = new planet(data[key]);
			}
		}
	}
	this.findPlanet = function(id){
		//can replace with more efficient search later
		if(this.planets.hasOwnProperty(id)){
			return this.planets[id];

		}
		return false;
	}
	this.isOwner = function(id){
		return(this.findPlanet(id).getOwner(0) == this.userid);
	}

	this.displayPlanets = function(){
		for (var id in this.planets){
			var p = this.findPlanet(id);
			p.display(this.userid);
		}
	}
	this.displayLinks = function(from,to,mode,pc){
		var displayLink = function(from,to,mode,pc){
			var color;
			strokeWeight(30);
			if(mode === 'attacking'){
				stroke(255,0,0,100);
				fill(255,0,0,100);
			}
			else{
				stroke(0,0,255,100);
				fill(0,255,255,200);
			}
			line(from.x,from.y,to.x,to.y);
			noStroke();
			ellipse(to.x*pc+(1-pc)*from.x,to.y*pc+(1-pc)*from.y,50,50);
		}
		var time = Date.now();
		var pc = (time%1000)/1000;
		for (var id in this.planets){
			var p = this.findPlanet(id);
			//draws lines between planets
			if(p.stats.attacking){
				displayLink(p,this.findPlanet(p.stats.attacking),'attacking',pc);
			}
			if(p.stats.trading){
				displayLink(p,this.findPlanet(p.stats.trading),'defending',pc);
			}
		}

	}
}
