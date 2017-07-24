import React from 'react';
import ReactDOM from 'react-dom';
import CanvasComp from './CanvasComp.jsx';
import IntroScreen from './Screens/IntroScreen.jsx';
import GameScreen from './Screens/GameScreen.jsx';


export default class Game extends React.Component {

	constructor(props){
		super(props);
		this.state = {		
			left: false,
			right: false,
			up: false,
			down: false,
			space: false,
			esc: false,
			frame: 0,
			enter: false,
			screen: 0,
			selectedChar: 0
		};
		this.tick = this.tick.bind(this);
		this.changeScreen = this.changeScreen.bind(this);
	}
	
	handleKeyDown(event){
		switch (event.key){
			case "Enter":
				this.state.enter = true;
				break;
			case "ArrowLeft":
				this.state.left = true;
				break;
			case "ArrowRight":
				this.state.right = true;
				break;
			case "ArrowUp":
				this.state.up = true;
				break;
			case "ArrowDown":
				this.state.down = true;
				break;
			/*case "a":
				this.state.left = true;
				break;
			case "d":
				this.state.right = true;
				break;
			case "w":
				this.state.up = true;
				break;
			case "s":
				this.state.down = true;
				break;*/
			case " ":
				this.state.space = true;
				break;
			case "Escape":
				this.state.esc = true;
				break;
			default: 
				break;
		}
	}

	handleKeyUp(){
		switch (event.key){
			case "Enter":
				this.state.enter = false;
				break;
			case "ArrowLeft":
				this.state.left = false;
				break;
			case "ArrowRight":
				this.state.right = false;
				break;
			case "ArrowUp":
				this.state.up = false;
				break;
			case "ArrowDown":
				this.state.down = false;
				break;
		/*	case "a":
				this.state.left = false;
				break;
			case "d":
				this.state.right = false;
				break;
			case "w":
				this.state.up = false;
				break;
			case "s":
				this.state.down = false;
				break;*/
			case " ":
				this.state.space = false;
				break;
			case "Escape":
				this.state.esc = false;
				break;
			default: 
				break;
		}
	}

	tick(){
		//update here
		this.setState({frame: (this.state.frame + 1) % 60 });
	}

	changeScreen(num, selected){
		this.setState({screen: num});
		this.setState({selectedChar: selected});
	}

	componentWillMount(){
		document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
		document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
		setInterval(this.tick, 16);

	}

	componentWillUnmount(){
		document.removeEventListener('Keypress', this.handleKeyDown.bind(this), false);
		document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
		clearInterval(this.tick);
	}

	render(){
		if (this.state.screen === 0){
			return (
				<IntroScreen canvas={CanvasComp} input={this.state} changeScreen={this.changeScreen}/>
			);
		} else if (this.state.screen === 1) {
			return 	(
				<GameScreen canvas={CanvasComp} input={this.state} changeScreen={this.changeScreen}/>
			);
		} else {
			return false;
		}
	}

}