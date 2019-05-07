/**
 * A minimal fake implementation of the DOM for use by custom renderers.
 *
 * This implements the minimal subset of the DOM APIs needed by Preact's
 * diffing. As the fake DOM nodes are modified, they invoke callbacks in the
 * renderer implementation which allows the renderer to create and update
 * host nodes appropriately.
 *
 * Custom renderers work by rendering into a fake DOM element
 */

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

export class Document {
	constructor(renderer) {
		this.renderer = renderer;
		this.body = this.createElement('body');
	}

	createElement(name) {
		return new Element(this, name);
	}

	createTextNode() {
		return new Text(this);
	}

	createElementNS() {
		throw new Error('createElementNS is not supported');
	}
}

class Node {
	constructor(doc, nodeType, localName) {
		this.ownerDocument = doc;
		this.nodeType = nodeType;
		this.localName = localName;
		this.childNodes = [];
		this.parentNode = null;
		this.hostNode = null;
	}

	get renderer() {
		return this.ownerDocument.renderer;
	}

	get nextSibling() {
		const siblings = this.parentNode.childNodes;
		const idx = siblings.indexOf(this);
		return siblings[idx + 1];
	}

	appendChild(node) {
		this.insertBefore(node, null);
	}

	insertBefore(node, prevNode) {
		if (node.parentNode) {
			node.parentNode.removeChild(this);
		}
		node.parentNode = this;
		const idx = prevNode ? this.childNodes.indexOf(prevNode) : this.childNodes.length;
		this.childNodes.splice(idx, 0, node);

		this.renderer.insertBefore(this.hostNode, node.hostNode, prevNode.hostNode);
	}

	removeChild(node) {
		node.parentNode = null;
		this.renderer.removeNode(this.hostNode, node.hostNode);
	}
}

class CSSStyleDeclaration {
	constructor(node) {
		this.props = {};
		this.node = node;
	}

	setProperty(name, value) {
		this.props[name] = value;
		this.node.renderer.setStyleProperty(this.node.hostNode, name, value);
	}
}

class Element extends Node {
	constructor(doc, name) {
		super(doc, ELEMENT_NODE, name);
		this.attributes = [];
		this.style = new CSSStyleDeclaration();
		this.hostNode = this.renderer.createElement(name);
	}

	setAttribute(name, value) {
		const attr = { name, value };
		this.removeAttribute(name);
		this.attributes.push(attr);
		this.renderer.setAttribute(this.hostNode, name, value);
	}

	removeAttribute(name) {
		this.attributes = this.attributes.filter(attr => attr.name !== name);
		this.renderer.removeAttribute(this.hostNode, name);
	}

	addEventListener(event, callback, useCapture) {
		this.renderer.addListener(this.hostNode, callback);
	}

	removeEventListener(event, callback, useCapture) {
		this.renderer.removeListener(this.hostNode, callback);
	}

	setAttributeNS() {
		throw new Error('setAttributeNS is not supported');
	}

	removeAttributeNS() {
		throw new Error('removeAttributeNS is not supported');
	}
}

class Text extends Node {
	constructor(doc) {
		super(doc, TEXT_NODE, '#text');
	}

	set data(value) {
		this.renderer.setTextValue(this.hostNode, value);
	}
}


