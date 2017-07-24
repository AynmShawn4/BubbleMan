import React from 'react';
import ReactDOM from 'react-dom';

export default class IntroScreen extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentOption: 1,
			selectedChar: 0,
			chars: [ new Image(), new Image(), new Image()],
			frames: 0,
			time: (new Date()).getTime(),
			ready: 3
		}
		this.draw = this.draw.bind(this);
		this.load = this.load.bind(this);
	}

	draw(){
		if (this.state.ready){
			return;
		}
		this.state.frames = (this.state.frames + 1) % 60;
		const ctx = this.refs.child.getCtx();
		ctx.clearRect(0, 0, 800, 600);
		ctx.font = "70px Arial";
		ctx.fillText("Bubble Man", 250, 70);

		ctx.font = "40 Arial";
		if (this.state.currentOption === 0){
			ctx.strokeText("Start" , 350, 250);
			ctx.fillText("Help", 350, 350);

		} else {
			ctx.fillText("Start", 350, 250);
			ctx.strokeText("Help", 350, 350);
		}
		for (var i = 0; i < 3; i++){
			if (this.state.selectedChar === i){
				const num = this.state.frames;
				if (num <= 30){
					ctx.drawImage(this.state.chars[i], 0, 0, 64, 64, 200 + i * 150, 400, 150,150);	
				} else if (num <= 60){
					ctx.drawImage(this.state.chars[i], 2 * 64, 0, 64, 64, 200 + i * 150, 400, 150,150);	
				} 
			} else {	
				ctx.drawImage(this.state.chars[i], 64, 0, 64, 64, 200 + i * 150, 400, 150,150);
			}
		}
	}

	load(){
		const src = ['assets/char_1.png', 
		'assets/char_2.png', 'assets/char_3.png' ]
		for (var i = 0 ; i < 3; i++){
			this.state.chars[i].src = src[i];
			var that = this;
			this.state.chars[i].onload = function(){
				that.state.ready--;
			}
		}
	}

	componentWillMount(){
		this.load();
	}

	componentWillReceiveProps(nextProps){
		var change = false;
		var time = new Date().getTime();
		if (time - this.state.time <= 100){
			return ;
		}
		if (nextProps.input.down === nextProps.input.up === true){
		} else if (nextProps.input.down === true){
			this.state.currentOption = ((this.state.currentOption + 1) % 2);
			change = true;
		} else if (nextProps.input.up === true){
			this.state.currentOption = (Math.abs(this.state.currentOption - 1) % 2);
			change = true;
		}
		if (nextProps.input.left === nextProps.input.right === true){
		} else if (nextProps.input.right === true){
			this.state.selectedChar = ((this.state.selectedChar + 1) % 3);
			change = true;
		} else if (nextProps.input.left === true){
			this.state.selectedChar = (Math.abs(this.state.selectedChar  + 2) % 3);
			change = true;
		}

		if (change){
			this.state.time = new Date().getTime();
		}

		if (nextProps.input.enter === true){
			if (this.state.currentOption === 1){
				this.props.changeScreen(1, this.state.selectedChar);
			} else {
				this.props.changeScreen(2, this.state.selectedChar);
			}
		}
	}

	componentWillUpdate() {
		this.draw();
	}

	render() {
		const Canvas = this.props.canvas;
		return (
			<Canvas ref='child'/>
		);
	}

}