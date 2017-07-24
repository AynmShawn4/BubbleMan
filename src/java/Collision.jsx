export default class Collision {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.outOfBound = this.outOfBound.bind(this);
		this.setTiles = this.setTiles.bind(this);
		this.setBubble = this.setBubble.bind(this);
		this.tiles = {
			indestructible: [],
			destructible: []
		},
		this.bubbles = [],
		this.tileCollision = this.tileCollision.bind(this);
		this.boxBoxCollisionTest = this.boxBoxCollisionTest.bind(this);
		this.setPlayerTakeDmg = this.setPlayerTakeDmg.bind(this);
		this.setItemGenerate = this.setItemGenerate.bind(this);
		this.setConsumeItem = this.setConsumeItem.bind(this);
		this.calculateSurroundingTiles = this.calculateSurroundingTiles.bind(this);
		this.collisionRecovery = this.collisionRecovery.bind(this);
		this.collisionHelper = this.collisionHelper.bind(this);
		this.itemGen = this.explode = this.takeDmg = this.consume = null;
	}

	setTiles(obj){
		this.tiles = obj;
	};

	setBubble(obj){
		var bubbleInfo = Object.assign({}, obj, {lastBubble: true});
		//this.tiles.destructible[obj.loc.y / 40 * 20 + obj.loc.x / 40 ] = 2;
		this.bubbles.push(bubbleInfo);
	}

	setExplode(func){
		this.explode = func;
	}

	setPlayerTakeDmg(func){
		this.takeDmg = func;
	}

	setItemGenerate(func){
		this.itemGen = func;
	}

	setConsumeItem(func){
		this.consume = func;
	}

	collisionHelper(tx, ty, loca, needToTest){
			if (this.tiles.destructible[ ty * 20 + tx  ] === 1) { 
				const ret = this.itemGen(tx * 40, ty * 40);
				if (ret === -1){
					this.tiles.destructible[ty * 20 + tx ] = -100;
				} else {
					this.tiles.destructible[ty * 20 + tx ] = -1 * ret;
				}
				//this.tiles.destructible[ty * 20 + tx ] = -1 * this.itemGen( tx * 40, ty * 40);
				return false;
			} else if (this.tiles.destructible[ ty * 20 + tx ] >= 3){
				this.tiles.destructible[ty * 20 + tx ] = - 1;
				this.consume(tx  * 40, ty * 40, 1);
			} else if (this.tiles.destructible[ ty * 20 + tx ] <= -3 ) {
				return false;
			}
			for (var i = this.bubbles.length - 1; i >= 0; i--){
				if (this.bubbles[i]!==undefined && ( tx * 40 === this.bubbles[i].loc.x) && (ty * 40 === this.bubbles[i].loc.y)){
					const tempP = this.bubbles[i].power;
					this.bubbles.splice(i, 1);
					this.explode( tx * 40, ty * 40, tempP);
				}
			}
			if (needToTest && this.boxBoxCollisionTest (tx * 40, ty * 40, 40, 40, loca.x, loca.y + 10, 30, 20) ){
				this.takeDmg();
			}
			return true;
	}

	tileCollision(x, y, power, loca){
		for (var i = 0; i < this.bubbles.length; i++){
			if (x === this.bubbles[i].loc.x && y === this.bubbles[i].loc.y){
				this.bubbles.splice(i, 1);
				break;
			}
		}
		//4 directions
		var tx = Math.floor(x / 40);
		var ty = Math.floor(y / 40);
		var tp = power;
		var ret = [0,0,0,0];
		var needToTest = true;
		if (this.boxBoxCollisionTest(tx * 40, ty * 40, 40, 40, loca.x, loca.y + 10, 30 ,20 )){
			needToTest = false;
			this.takeDmg();
		}
		while ((tx >= 1) && (tp > 0)){ //left 
			if(!this.collisionHelper(tx - 1, ty, loca, needToTest)){
				break;
			}
			tp -= 1;
			tx = tx - 1;
			ret[0]++;
		}
		tx = Math.floor(x / 40);
		ty = Math.floor(y / 40);
		tp = power;
		while ((tx <= 19) && (tp > 0) ){ //right
			if (!this.collisionHelper(tx + 1, ty, loca, needToTest)){
				break;
			}
			tp -= 1;
			tx = tx + 1;
			ret[1]++;
		}
		tx = Math.floor(x / 40);
		ty = Math.floor(y / 40);
		tp = power;
		while ((ty <= 15) && (tp > 0) ){ //down
			if (!this.collisionHelper(tx, ty + 1, loca, needToTest)){
				break;
			}
			tp -= 1;
			ty = ty + 1;
			ret[2]++;
		}
		tx = Math.floor(x / 40);
		ty = Math.floor(y / 40);
		tp = power;
		while ((ty >= 1) && (tp > 0) ){ //up
			if (!this.collisionHelper(tx, ty - 1, loca, needToTest)){
				break;
			}
			tp -= 1;
			ty = ty - 1;
			ret[3]++;
		}
		return ret;
	}

	boxBoxCollisionTest(x1, y1, h1, w1, x2, y2, h2, w2){
		if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2) {
			return true;
		}
	}

	calculateSurroundingTiles(x, y){
		var x1,x2,y1,y2;
		x1 = Math.floor(x / 40) * 40;
		x2 = (Math.floor(x / 40) + 1) * 40;
		y1 = Math.floor(y / 40) * 40;
		y2 = (Math.floor(y / 40) + 1) * 40;
		return [{x: x1, y: y1}, {x: x2, y: y1}, {x: x1, y: y2} , {x: x2, y: y2}];
	}

	collisionRecovery(ret, d, xOrY){
		if( !xOrY ){ //x offset
			if (d[0] > 0 ){
			ret.x = Math.floor(ret.x / 40) * 40;
			} else if (d[0] < 0){
				ret.x = (Math.floor(ret.x / 40) + 1) * 40;
			}
		} else { //y offset
			if (d[1] > 0 ){
				ret.y = Math.floor(ret.y / 40) * 40;
			} else if (d[1] < 0){
				ret.y = (Math.floor(ret.y / 40) + 1) * 40;
			}
		}
		return ret;
	}

	outOfBound(obj, xOrY, width, d){
		var ret = {x: obj.x, y: obj.y};
		if (obj.x < 0) {
			ret.x = 0;
		}
		if (obj.x + width > this.width){
			ret.x = this.width - width;
		}
		if (obj.y < 0 ){
			ret.y = 0;
		}
		if (obj.y + width > this.height){
			ret.y = this.height - width;
		}
		const result = this.calculateSurroundingTiles(ret.x, ret.y);
		for (var i = 0; i < result.length; i++){
			var x = result[i].x;
			var y = result[i].y;
			if (this.tiles.destructible[y / 40 * 20+ x / 40] === -1)  { //empty space
				continue;
			} else if (Math.abs(this.tiles.destructible[y / 40 * 20+ x / 40]) >= 3){ //item collision
				if (this.boxBoxCollisionTest(ret.x, ret.y, 40, 40, x +15, y + 15, 10, 10)){
					this.consume(x, y, Math.abs(this.tiles.destructible[y / 40 * 20+ x / 40]));
					this.tiles.destructible[y / 40 * 20+ x / 40] = -1;
				}
				continue;
			} 
			if ( this.boxBoxCollisionTest( ret.x + 3, ret.y + 3, 34, 34, x, y, 40, 40)  ){//tile collision
				ret = this.collisionRecovery(ret, d, xOrY);		
			}
		}
		//bubble collsion
		for (var k = 0; k < this.bubbles.length; k++){
			var y = this.bubbles[k].loc.y;
			var x = this.bubbles[k].loc.x;
				if (this.bubbles[k].lastBubble){
					if (!this.boxBoxCollisionTest( ret.x + 3, ret.y + 3 , 34, 34, x, y, 40, 40)){
						this.bubbles[k].lastBubble = false;
					}
				} else {
					if ( this.boxBoxCollisionTest( ret.x + 3, ret.y + 3 , 34, 34, x, y, 40, 40)  ){
						ret = this.collisionRecovery(ret,  d, xOrY);		
					}
				}
		}
		return ret;
	}
}