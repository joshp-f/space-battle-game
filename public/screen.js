function screen(planet,x,y){
	//positions of centre of screen
	this.planet = planet;
	this.y = y;
	this.x = x;
	this.lerpx = x;
	this.lerpy = y;

	this.dragging = false;
	this.dragFrom = false;

	this.displayLine = function(x,y){
		var pos = this.getPos(x,y);
		strokeWeight(25);
		stroke(200,200,200,150);
		line(this.dragFrom.x,this.dragFrom.y,pos.x,pos.y);
	}
	this.translateScreen = function(){
		translate(-this.lerpx+width/2,-this.lerpy+height/2);
		this.lerpx = lerp(this.lerpx,this.x,0.05);
		this.lerpy = lerp(this.lerpy,this.y,0.05);


	}
	this.getPos = function(x,y){
			return {x:x+this.x-width/2,
				y:y+this.y-height/2
			}
	}
	this.move = function(planet,x,y,lerp){
		//lerp is false for instant movement
		this.planet = planet;
		this.x = x;
		this.y = y;
		if(!lerp){
			this.lerpx = x;
			this.lerpy = y;
		}
	}
}