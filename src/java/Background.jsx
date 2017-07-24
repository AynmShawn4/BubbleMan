import React from 'react';
import ReactDOM from 'react-dom';

const predesginedPattern = {
	spawnPatterns: [[4,5,7,8,9,10,11,12,14], [0,3,4,5,6,8,10,11,13,14],[2,3,4,8,9,10,12,13,14]],
	normalPatterns: [[0,1,2,3,4,5,12,13,14], [0,1,2,3,10,11,12,13],
					 [1,2,3,6,8,13], [2,4,6,12,14],[2,6,7,8,12] , [1,3,5,8,9,11,13] ],
	emptyPatterns: [[2,6,7,8,12] , [1,3,5,8,9,11,13] ]
};

export default class Background extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			indestructible: [21, 38, 261, 278],
			destructible: [],
			tiles: new Image(),
			Bubbles: [],
			ctx: null,
			ready: 1
		};
		this.state.destructible.length = 300;
		this.state.destructible.fill(-1);
		this.load = this.load.bind(this);
		this.draw = this.draw.bind(this);
		this.getTiles = this.getTiles.bind(this);
	}

	getTiles(){
		return {
			indestructible: this.state.indestructible,
			destructible: this.state.destructible
		}
	}

	load(){
		//randomize tiles
		var num;
		for (var i = 0; i < 20; i++){
			if (i === 0){
				num = Math.floor(Math.random() * 3);
				const patternSrc = predesginedPattern.spawnPatterns[num];
				for (var j = 0; j < patternSrc.length; j++){
					var y = Math.floor(patternSrc[j] / 5);
					var x = patternSrc[j] % 5;
					this.state.destructible[y * 20 + x ] = 1;

				}
			} else {
				num = Math.floor(Math.random() * 6);
				const patternSrc = predesginedPattern.normalPatterns[num];
				var x = Math.floor(i / 5) * 5;;
				var y = (i % 5) * 3;
				for (var j = 0; j < patternSrc.length; j++){
					var y1 = Math.floor(patternSrc[j] / 5);
					var x1 = patternSrc[j] % 5;
					this.state.destructible[(y + y1) * 20 + x + x1 ] = 1;

				}

			}
		}

		//load tile image
		const src = 'assets/tiles.jpg';
		this.state.tiles.src = src;
		var that = this;
		this.state.tiles.onload = function(){
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
		if (this.props.canvas === null){
			return;
		}
		ctx.clearRect(0, 0, 800, 600);

		for (var i = 0; i < this.state.indestructible.length; i++){
			var x = Math.floor(this.state.indestructible[i] / 20);
			var y = this.state.indestructible[i] % 20;
			ctx.drawImage(this.state.tiles, 9 * 40 + 2, 6 * 40 + 2, 35, 35, y * 40 , x * 40, 40, 40);
		}

		for (var j = 0; j < this.state.destructible.length; j++){
			if ((this.state.destructible[j] === -1 ) || (Math.abs(this.state.destructible[j]) >= 2 )){
				if (this.state.destructible[j] === -100){
					this.state.destructible[j] = -1;
				} else if (Math.abs(this.state.destructible[j]) >= 2){
					this.state.destructible[j] = Math.abs(this.state.destructible[j]);
				}
				continue;
			}
			var x = Math.floor(j / 20);
			var y = j % 20;
			ctx.drawImage(this.state.tiles, 4 * 40 + 2, 2 * 40 + 2, 35, 35, y * 40 , x * 40, 40, 40);
		}
	}

	componentWillUpdate() {
		this.draw();
	}

	render(){
		return false;
	}
}