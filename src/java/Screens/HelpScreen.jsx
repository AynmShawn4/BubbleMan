import React from 'react';
import ReactDOM from 'react-dom';

export default class HelpScreen extends React.Component {

	constructor(props){
		super(props);
		this.state = {
	
		}
		this.draw = this.draw.bind(this);
	}

	draw(){
		const ctx = this.refs.child.getCtx();
		ctx.clearRect(0, 0, 800, 600);
		ctx.font = "70px Arial";
		ctx.fillText("Bubble Man", 250, 70);

		ctx.font = "40px Arial";
		ctx.fillText("- Press Arrow keys to move", 150, 270);
		ctx.fillText("- Press Space keys to use bubble", 150, 370);
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

		if (nextProps.input.esc === true){
			this.props.changeScreen(0, this.state.selectedChar);
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