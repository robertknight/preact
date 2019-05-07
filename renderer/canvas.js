import { Renderer } from './renderer';

export class CanvasRenderer extends Renderer {
	constructor(canvasEl) {
		super();

		this.ctx = canvasEl.getContext('2d');
		this.scene = {};

		// Scene node types:
		//  - Path
		//  - Text
		//  - Transform
		//  - Image
		//  - Hit target
		//  - Filter
	}

	renderScene() {
		// TODO - Clear scene.
		// TODO - Traverse scene graph, translate to draw calls.
	}
}
