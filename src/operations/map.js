import { recursiveDeepProperty } from './helper';

export function map(mappings) {
	return input => {
		return _internalMap({ mappings, input });
	};
}

function _internalMap({ mappings, input }) {
	if (typeof mappings === 'function') {
		return mappings(input);
	}
	if (!(input && typeof input === 'object') || !Array.isArray(mappings)) {
		return input;
	}
	let result = input;
	mappings.forEach(mapping => {
		const pathArray = mapping.path.split('.');
		result = _internalPathMap({
			pathArray,
			mappingFunc: mapping.transform,
			input: result,
		});
	});
	return result;
}

function _internalPathMap({ pathArray = [], mappingFunc, input }) {
	return recursiveDeepProperty({
		pathArray,
		input,
		mappingFunc({ currentPath, isCurrentArray, isLeaf }) {
			return (input, parent) => {
				if (!parent || !currentPath) {
					return input;
				}
				let result = input;
				if (isLeaf) {
					result = mappingFunc(input);
				}
				return Object.assign({}, parent, { [currentPath]: result });
			};
		},
	});
}
