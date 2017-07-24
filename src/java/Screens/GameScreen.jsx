import React from 'react';
import ReactDOM from 'react-dom';
import Player from '../Entities/Player.jsx';
import Enemy from '../Entities/Enemy.jsx';
import Background from '../Background.jsx';
import Collision from '../Collision.jsx';
import Bubble from '../Entities/Bubble.jsx';
import Pillar from '../Pillar.jsx';
import Item from '../Item.jsx';

export default class GameScreen extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			face: 0,
			stationary: 0,
			time: (new Date()).getTime(),
			ctx: null,
			frames: 0,
			selectedChar: 0,
			location: {x: 40, y: 0},
			playerStat: {},
			collision: new Collision(800, 600)
		}
		this.explode = this.explode.bind(this);
		this.manualExplode = this.manualExplode.bind(this);
		this.playerTakeDmg = this.playerTakeDmg.bind(this);
		this.generateItem = this.generateItem.bind(this);
		this.consumeItem = this.consumeItem.bind(this);
	}

	componentWillMount(){
		this.state.selectedChar = this.props.input.selectedChar;
	}

	componentDidMount(){
		this.state.ctx = this.refs.child.getCtx();
		this.state.playerStat = this.refs.player.getStat();
		this.state.collision.setTiles(this.refs.background.getTiles());
		this.state.collision.setExplode(this.manualExplode);
		this.state.collision.setPlayerTakeDmg(this.playerTakeDmg);
		this.state.collision.setItemGenerate(this.generateItem);
		this.state.collision.setConsumeItem(this.consumeItem);
		this.refs.enemy.setTiles(this.refs.background.getTiles());
		this.refs.enemy.generateEnemies(1);
	}

	componentWillReceiveProps(nextProps){
		var change = false;
		var delta = [0, 0];
		var time = new Date().getTime();
		if (time - this.state.time <= 16){
			return ;
		}
		if (nextProps.input.down === nextProps.input.up === true){
		} else if (nextProps.input.down === true){
			delta[1] += this.state.playerStat.currentSpeed;
			this.state.face = 0;
			change = true;
		} else if (nextProps.input.up === true){
			delta[1] -= this.state.playerStat.currentSpeed;
			this.state.face = 3;
			change = true;
		}

		if (nextProps.input.left === nextProps.input.right === true){
		} else if (nextProps.input.right === true){
			delta[0] += this.state.playerStat.currentSpeed;
			this.state.face = 2;
			change = true;
		} else if (nextProps.input.left === true){
			delta[0] -= this.state.playerStat.currentSpeed;
			this.state.face = 1;
			change = true;
		}

		if (change){
			this.state.time = new Date().getTime();
			this.state.stationary = 0;
			var loca = this.state.location ;
			const multiple = [[4], [5], [4,2], [5,2], [8], [5, 4], [10]];
			if (delta[0] !== 0 && delta[1] !== 0){
				var minusX = (delta[0] <= 0) ? -1 : 1;
				var minusY = (delta[1] <= 0) ? -1 : 1;
				const steps = multiple[ Math.abs(delta[0]) - 4];
				for (var i = 0; i < steps.length; i++){
					const del = [steps[i] * minusX, steps[i] * minusY ];
					loca.x += del[0];
					loca = this.state.location = this.state.collision.outOfBound(loca, 0, 40, del);
					loca.y += del[1];
					loca = this.state.location = this.state.collision.outOfBound(loca, 1, 40, del);
				}
			} else
			if (delta[0] !== 0){
				var minus = (delta[0] <= 0) ? -1 : 1;
				const steps = multiple[ Math.abs(delta[0]) - 4];
				for (var i = 0; i < steps.length; i++){
					loca.x += steps[i] * minus;
					loca = this.state.location = this.state.collision.outOfBound(loca, 0, 40, 
						[(steps[i] * minus),  0]);

				}				
			} else if (delta[1] !== 0){
				var minus = (delta[1] <= 0) ? -1 : 1;
				const steps = multiple[ Math.abs(delta[1]) - 4];
				for (var i = 0; i < steps.length; i++){
					loca.y += steps[i] * minus;
					loca = this.state.location = this.state.collision.outOfBound(loca, 1, 40, 
						[0, (steps[i] * minus)]);
				}
			} 
		} else {
			this.state.stationary = 1;
		}

		if (nextProps.input.enter === true){
			if (this.state.currentOption === 1){
				//this.props.changeScreen(1);
			} else {
				//this.props.changeScreen(2);
			}
		}
		if (nextProps.input.space === true){
			var result = this.refs.bubble.insertBubble(this.state.location);
			if( result !== null){
				this.state.collision.setBubble(result);
			}
		}
	}

	componentWillUpdate() {
		this.state.frames = (this.state.frames + 1) % 60;
	}

	explode(x, y, power){
		var bubblePillar = this.state.collision.tileCollision(x, y, power, this.state.location);
		this.refs.pillar.setPillar(x, y, bubblePillar);
	}

	manualExplode(x, y, power){
		this.refs.bubble.manualExplode(x, y, power);
	}

	playerTakeDmg(){
		this.refs.player.takeDmg();
	}

	generateItem(x, y){
		return this.refs.item.generateItem(x, y);
	}

	consumeItem(x, y, num){
		this.refs.player.consumeItem(num);
		this.refs.item.clearItem(x, y);
	}

	render() {
		const Canvas = this.props.canvas;
		return (
			<div>

				<Canvas ref='child'/>
				<Background ref='background' canvas={this.state.ctx} explode={this.manualExplode}/>
				<Pillar ref='pillar' canvas={this.state.ctx}/>
				<Bubble ref='bubble' canvas={this.state.ctx} playerInfo={this.state.playerStat} 
				explode={this.explode}/>
				<Item ref='item' canvas={this.state.ctx}/>
				<Player ref='player' canvas={this.state.ctx} playInfo={this.state}/>
				<Enemy ref='enemy' canvas={this.state.ctx} frames={this.state.frames}/>

			</div>
		);
	}

}