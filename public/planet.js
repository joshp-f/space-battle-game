function planet(data){
	this.x = data.x;
	this.y = data.y;
	this.name = data.name;
	this.radius = 30;
	this.color = {r:255,g:255,b:255};
	this.stats = data.stats;

	this.display = function(userid){
		//console.log(this.getOwner());
		if(this.getOwner() != 'w'){
			(userid == this.getOwner()) ?fill(0,255,0): fill(255,0,0);
		}
		else{
			fill(this.color.r,this.color.g,this.color.b);
		}
		noStroke();
		ellipse(this.x,this.y,this.radius*2,this.radius*2);

		this.displayText();
	}
	this.displayText = function(){
		textSize(14);
		noStroke();
		fill(255);
		text(this.name,this.x-30,this.y-this.radius-10);
		fill(0);
		text(this.stats.score,this.x-12,this.y+5);
	}
	this.posInside = function(x,y){
		if (hypot(x-this.x,y-this.y) <= this.radius){
			return true;
		}
		return false;
	}

	this.grabStats = function(){
		return this.stats;
	}

	this.overrideStats = function(data){
		this.stats = data.stats;
	}
	//gets the id of majority possessor
	this.getOwner = function(){
		return this.stats.owner;
	}
	this.displayRange = function(){
		fill(100,0,0,100);
		noStroke();		
		ellipse(this.x,this.y,this.stats.range*2,this.stats.range*2);
	}

}