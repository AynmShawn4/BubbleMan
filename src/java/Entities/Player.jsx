import React from 'react';
import ReactDOM from 'react-dom';

const charStats = [
	{
		startingSpeed: 4,
		currentSpeed: 4,
		topSpeed: 8,
		startingPower: 1,
		currentPower: 1,
		topPower: 8,
		startingBubble: 2,
		currentBubble: 2,
		topBubble: 8,		
	},
	{
		startingSpeed: 5,
		currentSpeed: 5,
		topSpeed: 10,
		startingPower: 1,
		currentPower: 1,
		topPower: 7,
		startingBubble: 1,
		currentBubble: 1,
		topBubble: 6,		
	},
	{
		startingSpeed: 5,
		currentSpeed: 5,
		topSpeed: 9,
		startingPower: 2,
		currentPower: 2,
		topPower: 8,
		startingBubble: 1,
		currentBubble: 1,
		topBubble: 7,		
	}
];


export default class Player extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			charStat: {
			},
			ctx: null,
			char: new Image(),
			hp: 3,
			time: 0,
			ready: 1
		};
		this.load = this.load.bind(this);
		this.draw = this.draw.bind(this);
		this.getStat = this.getStat.bind(this);
		this.takeDmg = this.takeDmg.bind(this);
		this.consumeItem = this.consumeItem.bind(this);
	}

	getStat(){
		return this.state.charStat;
	}

	takeDmg(){
		var time = new Date().getTime();
		if ( time - this.state.time > 1200){
			this.state.time = time;
			this.state.hp--;
			if ( this.state.hp === 0){
				console.log("ded");
			}
		}
	}

	consumeItem(num){
		const temp = this.state.charStat;
		switch (num){
			case 3: 
				(temp.currentBubble >= temp.topBubble) ? null : this.state.charStat.currentBubble++;
				break;
			case 4: 
				(this.state.hp >= 3) ? null : this.state.hp++; break;
			case 5:
				(temp.currentPower >= temp.topPower) ? null : temp.currentPower++; break;
			case 6:
				temp.currentPower = temp.topPower; break;
			case 7:
				(temp.currentSpeed >= temp.topSpeed)? null : temp.currentSpeed += 1; break;
			case 8:
				temp.currentSpeed = temp.topSpeed; break;
			default:
				break;
		}
	}	

	load(){
		this.state.charStat = charStats[this.props.playInfo.selectedChar];
		const src = ['assets/char_1.png', 
		'assets/char_2.png', 'assets/char_3.png' ];
		this.state.char.src = src[this.props.playInfo.selectedChar];
		var that = this;
		this.state.char.onload = function(){
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
		if (this.state.hp <= 0){
			return;
		}
		const x = this.props.playInfo.location.x;
		const y = this.props.playInfo.location.y;

		//draw hp bar
		ctx.globalAlpha = 0.7;
		ctx.fillStyle="red";
		ctx.fillRect(x, y - 8, 40 - (3 - this.state.hp) / 3 * 40, 10);
		ctx.fillStyle='yellow';
		ctx.fillRect(x + this.state.hp / 3 * 40, y - 8, (3 - this.state.hp )/ 3 * 40, 10);
		ctx.globalAlpha = 1;

		if (this.props.playInfo.stationary){
			ctx.drawImage(this.state.char, 64 + 2, this.props.playInfo.face * 64 + 2 , 63, 63, x, y, 40,40);
			return;
		}
		const num = this.props.playInfo.frames;
		if (num <= 20){
			ctx.drawImage(this.state.char, 0, this.props.playInfo.face * 64 , 64, 64, x, y, 40,40);
		} else if (num <= 40){
			ctx.drawImage(this.state.char, 64, this.props.playInfo.face * 64 , 64, 64, x, y, 40,40);
		} else if (num <= 60){
			ctx.drawImage(this.state.char, 2 * 64, this.props.playInfo.face * 64 , 64, 64, x, y, 40,40);
		} 
	}

	componentWillUpdate() {
		this.draw();
	}

	componentWillReceiveProps(nextProps){
	}

	render(){
		return false;
	}
}