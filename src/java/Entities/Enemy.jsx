import React from 'react';
import ReactDOM from 'react-dom';
import AI from './AI.jsx';

const enemyStats = {
	normalEnemy: [{
		moveSpeed: 10,
		hp: 3,
	}, {
		moveSpeed: 6,
		hp: 5,
	}],
	bossEnemy: [{
		moveSpeed: 6,
		hp: 30
	}]
}
export default class Enemy extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			images: [new Image(), new Image(), new Image(0)],
			enemies: [],
			tiles:[],
			ready: 3
		}
		this.load = this.load.bind(this);
		this.generateEnemies = this.generateEnemies.bind(this);
		this.setTiles = this.setTiles.bind(this);
	}

	setTiles(obj){
		this.state.tiles = obj;
	}

	generateEnemies(level){
		for (var i = 0; i < 6; i++){
			var rand = Math.floor(Math.random() * 2);
			const stat = enemyStats.normalEnemy[rand];
			this.state.enemies.push({moveSpeed: stat.moveSpeed, 
				hp: stat.hp, type: 'normal', AI: new AI(this.state.tiles, 0)} );
		}
		//boss 
		const temp = enemyStats.bossEnemy[0];
		this.state.enemies.push({moveSpeed: temp.moveSpeed,
			 hp: temp.hp, type: 'boss', AI: new AI(this.state.tiles, 1)} )
	}

	load(){
		const pre = 'assets/';
		const src = ['enemy_1.png', 'enemy_2.png', 'boss_1.png' ];
		for (var i = 0; i < this.state.images.length; i++){
			this.state.images[i].src = pre + src[i];
			var that = this;
			this.state.images[i].onload = function(){
				that.state.ready--;
			};

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

		const num = this.props.frames;
		if (num <= 20){
			ctx.drawImage(this.state.images[2], 0 * 64, 0 * 64 , 64, 64, 400, 0, 80,80);
		} else if (num <= 40){
			ctx.drawImage(this.state.images[2], 1 * 64, 0 * 64 , 64, 64, 400, 0, 80,80);
		} else if (num <= 60){
			ctx.drawImage(this.state.images[2], 2 * 64, 0 * 64 , 64, 64, 400, 0, 80,80);
		} 
	}

	componentWillUpdate() {
		this.draw();
	}

	render(){
		return false;
	}
}