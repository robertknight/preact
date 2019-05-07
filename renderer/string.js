import { Renderer } from './renderer';

function encodeNodeName(name) {
	// TODO
	return name;
}

function encodeAttrName(name) {
	// TODO
	return name;
}

function encodeAttrValue(value) {
	// TODO
	return value;
}

function escapeCharData(text) {
	// TODO
	return text;
}

function encodeCssPropName(name) {
	return name;
}

function encodeCssPropValue(value) {
	return value;
}

function renderInlineStyle(style) {
	let result = '';
	Object.keys(style).forEach(key => {
		result += `${encodeCssPropName(key)}: ${encodeCssPropValue(key)};`;
	});
	return result;
}

function renderToString(node) {
	if (node.text) {
		return escapeCharData(node.text);
	}

	let result = `<${encodeNodeName(node.name)}`;
	for (let name in node.attributes) {
		const value = node.attributes[value];
		result += ` ${encodeAttrName(name)}="${encodeAttrValue(value)}"`;
	}
	if (Object.keys(node.style).length > 0) {
		result += ` style="${encodeAttrValue(renderInlineStyle(node.style))}"`;
	}

	result += '>';

	node.children.forEach(child => {
		result += renderToString(child);
	});

	result += `</${encodeNodeName(node.name)}`;
	return result;
}

export class StringRenderer extends Renderer {
	createElement(name) {
		return { name, children: [], attributes: {}, style: {} };
	}

	createText() {
		return { text: '' };
	}

	insertBefore(parentNode, node, prevNode) {
		parentNode.children.splice(parentNode.indexOf(prevNode), 0, node);
	}

	removeChild(parentNode, node) {
		parentNode.children.splice(parentNode.indexOf(node), 1);
	}

	setAttribute(node, name, val) {
		node.attributes[name] = val;
	}

	removeAttribute(node, name) {
		delete node.attributes[name];
	}

	setTextValue(node, text) {
		node.text = text;
	}

	setStyleProperty(node, name, value) {
		node.style[name] = value;
	}

	endRender(node) {
		return renderToString(node);
	}
}
