import React from 'react';
import ReactDOM from 'react-dom';

export default class Bubble extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			image: new Image(),
			Bubbles: [],
			lastTimeInseted: 0,
			ready: 1
		}
		this.insertBubble = this.insertBubble.bind(this);
		this.getBubbles = this.getBubbles.bind(this);
		this.manualExplode = this.manualExplode.bind(this);
		this.findingCorrectPlace = this.findingCorrectPlace.bind(this);
	}

	manualExplode(x, y, power){
		for (var i = this.state.Bubbles.length - 1; i >= 0; i--){
			if ((x === this.state.Bubbles[i].loc.x) && (y === this.state.Bubbles[i].loc.y)) {
				this.state.Bubbles.splice(i, 1);
				this.props.explode(x, y, power);
				break;
			}
		}
	}

	getBubbles(){
		return this.state.Bubbles;
	}

	findingCorrectPlace(x, y){
		var x1,x2,y1,y2;
		x1 = Math.floor(x / 40) * 40;
		x2 = (Math.floor(x / 40) + 1) * 40;
		y1 = Math.floor(y / 40) * 40;
		y2 = (Math.floor(y / 40) + 1) * 40;
		var minDis = 100;
		var whichOne = -1;
		const fourTiles = [{x: x1, y: y1}, {x: x2, y: y1}, {x: x1, y: y2} , {x: x2, y: y2}];
		for (var i = 0; i < fourTiles.length; i++){
			var v1 = (x - fourTiles[i].x);
			var v2 = (y - fourTiles[i].y);
			var dis = Math.sqrt(v1 * v1 + v2 * v2);
			if (dis< minDis){
				minDis = dis;
				whichOne = i;
			}
		}
		return fourTiles[whichOne];
	}

	insertBubble(location){
		if (this.state.Bubbles.length >= this.props.playerInfo.currentBubble){
			return null;
		}
		var loc = {x: location.x, y: location.y};
		var time = new Date().getTime();

		if (time - this.state.lastTimeInseted <= 200){ //cooldown to place bubble
			return null;
		}

		if ((loc.x % 40 !== 0 ) || (loc.y % 40 !== 0 )){ //calculate where to put if position is not exact / 40
			loc = this.findingCorrectPlace(loc.x, loc.y);
		}

		for (var i = 0; i < this.state.Bubbles.length; i++){
			if ((loc.x === this.state.Bubbles[i].loc.x) && (loc.y === this.state.Bubbles[i].loc.y)){
				return null;
			}
		}
		var bubble = {loc: loc, time: time, power: this.props.playerInfo.currentPower};
		this.state.Bubbles.push(bubble);
		this.state.lastTimeInseted = time;
		return bubble;
	}
	
	load(){
		this.state.image.src = 'assets/bubble.png';
		var that = this;
		this.state.image.onload = function(){
			that.state.ready--;
		}
	}

	componentWillMount(){
		this.load();
	}

	draw(){
		if (this.state.ready){
			return;
		}
		const ctx = this.props.canvas;
		if (ctx === null){
			return;
		}
		var time = new Date().getTime();
		for (var i = this.state.Bubbles.length - 1; i >= 0; i--){
			var diff = time - this.state.Bubbles[i].time;
			if (diff >= 3000){
				var x = this.state.Bubbles[i].loc.x; var y = this.state.Bubbles[i].loc.y;
				var p = this.state.Bubbles[i].power;
				this.state.Bubbles.splice(i, 1);
				this.props.explode(x, y, p);
				continue;
			}
			var phase = Math.floor(diff / 500) % 2;
			if (phase){
				ctx.drawImage(this.state.image,0, 0 , 40, 40, 
					this.state.Bubbles[i].loc.x, this.state.Bubbles[i].loc.y, 40,40);
			} else {
				ctx.drawImage(this.state.image,40, 0 , 40, 40, 
					this.state.Bubbles[i].loc.x, this.state.Bubbles[i].loc.y, 40,40);
			}
		}
	}

	componentWillUpdate() {
		this.draw();
	}

	render(){
		return false;
	}
}