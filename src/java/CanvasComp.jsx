import React from 'react';
import ReactDOM from 'react-dom';

const styles = {
	div: {
		textAlign: "center"
	},
	canvas: {
		border: "1px solid red",
	}

}

export default class CanvasComp extends React.Component {

	constructor(props){
		super(props);
		this.getCtx = this.getCtx.bind(this);
	}

	getCtx() {
		const ctx = this.refs.canvas.getContext('2d');
		return ctx;
	}

	render(){
		return (
			<div >
				<div style={styles.div}>
				<canvas ref="canvas" width={800} height={600} style={styles.canvas}>
				</canvas>
				</div>
			</div>
		)
	}
}
