import { recursiveDeepProperty } from './helper';
import { isEmpty, isNullOrUndefined } from '../utils/object';

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
		mappingFunc({ parentPath, isLeaf }) {
			return (input, parent) => {
				let result = input;
				if (isLeaf) {
					result = mappingFunc(input);
				}
				if (isEmpty(parentPath)) {
					return result;
				}
				if (typeof parentPath === 'number') {
					return result;
				}
				return Object.assign({}, parent, {
					[parentPath]: result,
				});
			};
		},
	});
}
