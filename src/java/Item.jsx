import React from 'react';
import ReactDOM from 'react-dom';

export default class Item extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],
			itemImages: [new Image(), new Image(),new Image(),new Image(),new Image(),new Image(), ],
			ready: 6
		}
		this.generateItem = this.generateItem.bind(this);
		this.load = this.load.bind(this);
		this.clearItem = this.clearItem.bind(this);
	}

	generateItem(x, y){
		var num = Math.floor(Math.random() * 100);
		var type = -1;
		if (num >= 40){
			if (num > 95){
				type = 8; //full speed
			} else if (num > 90){
				type = 6; //full power
			} else if (num > 85){
				type = 4; //hp
			} else if (num > 70){
				type =  5; //power
			} else if (num > 55){
				type = 7; //speed
			} else {
				type = 3;//bubble
			}
			this.state.items.push({x: x, y: y, type: type});

		}
		return type;
	}

	clearItem(x, y){
		for (var i = 0; i < this.state.items.length; i++){
			if ((this.state.items[i].x === x) && (this.state.items[i].y === y)){
				this.state.items.splice(i, 1);
				return;
			}
		}
	}

	draw(){
		if (this.state.ready){
			return;
		}
		const ctx = this.props.canvas;
		if (ctx === null){
			return;
		}
		for (var i = 0; i < this.state.items.length; i++){
			const temp = this.state.items[i];
			ctx.drawImage(this.state.itemImages[temp.type - 3], temp.x, temp.y, 40, 40);
		}
	}

	componentWillUpdate() {
		this.draw();
	}

	load(){
		//load item images
		const dest = 'assets/items/';
		const src = ['bubble.png', 'hp.png', 'power.png', 'power_full.png', 'speed.png', 'speed_full.png' ];
		for (var i = 0 ; i < this.state.itemImages.length; i++){
			this.state.itemImages[i].src = dest + src[i];
			var that = this;
			this.state.itemImages[i].onload = function(){
				that.state.ready--;
			}
		}
	}

	componentWillMount(){
		this.load();
	}
	render(){
		return false;
	}
}