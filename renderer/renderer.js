import { Document } from './fake-dom';
import { options } from 'preact';

function installHook(name, hook) {
	const prevHook = options[name];
	options[name] = (...args) => {
		hook(...args);
		if (prevHook) { prevHook(...args) };
	};
	options[name].remove = () => {
		options[name] = prevHook;
	};
}

// Overall structure:
//  - Minimal DOM implementation which Preact uses to manipulate host elements
//  - Renderer interface for writing custom renderers
//  -

export function installHooks() {
	installHook('vnode', node => {
		// TODO -

	});

	installHook('diff', node => {
		// TODO - Invoke begin-render callback if this node is associated with a
		// custom renderer.
		renderer.beginRender(node);
	});

	installHook('diffed', node => {
		// TODO - Invoke end-render callback if this node is associated with a
		// custom renderer.
		renderer.endRender(node);
	});
}

/**
 * Base class for custom renderers.
 *
 * Renderer implementations should implement the callback methods in order to
 * create, update and remove custom host nodes during rendering.
 *
 * The `beginRender` and `endRender` callbacks will be invoked at the start
 * and end of rendering processes.
 */
export class Renderer {
	/**
	 * Create a new container "element" that can be passed to Preact's
	 * `render` function in order to render a component tree using this
	 * renderer.
	 */
	createRoot() {
		const doc = new Document(this);
		return doc.body;
	}

	/**
	 * Return the names of properties that can be set for a given element type.
	 */
	getPropertyNames(elementType) {
		return [];
	}

	/**
	 * Create a host node of a given type.
	 */
	createElement(name) {}

	/**
	 * Create a host text node.
	 */
	createText() {}

	/**
	 * Insert a host node after `prevNode` in the parent node.
	 */
	insertBefore(parentNode, node, prevNode) {}

	/**
	 * Remove a node.
	 */
	removeChild(parentNode, node) {}

	/**
	 * Set a property on a node.
	 */
	setProperty(node, name, val) {}

	/** Set the text content of a node. */
	setTextValue(node, text) {}
	setAttribute(node, name, val) {}
	removeAttribute(node, name, val) {}

	/**
	 * Set a style property on a node.
	 */
	setStyleProperty(node, name, val) {}

	/**
	 * Register an event listener for a node.
	 */
	addListener(node, callback) {}

	/** Remove an event listener for a node.
	 */
	removeListener(node, callback) {}

	/**
	 * Called when rendering of a node begins.
	 */
	beginRender(node) {}

	/**
	 * Called when rendering of a node completes.
	 */
	endRender(node) {}
}
