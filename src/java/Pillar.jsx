import React from 'react';
import ReactDOM from 'react-dom';

export default class Pillar extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			bubbles: []
		}
		this.setPillar = this.setPillar.bind(this);
		this.draw = this.draw.bind(this);
	}

	setPillar(x, y, obj){
		var time = new Date().getTime();

		this.state.bubbles.push({x: x, y: y, obj: obj, time: time});
	}

	draw(){
		const ctx = this.props.canvas;
		if (ctx === null){
			return;
		}
		ctx.fillStyle="rgb(160, 196, 255)";
		var time = new Date().getTime();
		for (var i = this.state.bubbles.length - 1; i >= 0; i--){
			const temp = this.state.bubbles[i];
			if (time - temp.time <= 300){
				ctx.fillRect( temp.x - temp.obj[0] * 40, temp.y, 40 + temp.obj[0] * 40 + temp.obj[1] * 40, 40 );
				ctx.fillRect( temp.x, temp.y - (temp.obj[3] * 40), 40, 40 + temp.obj[3] * 40 + temp.obj[2] * 40 );
			} else {
				this.state.bubbles.splice(i, 1);
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