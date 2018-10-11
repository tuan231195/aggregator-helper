import { recursiveDeepProperty } from './helper';
import { isEmpty } from '../utils/object';

const PROJECTION = {
	INCLUDE: 1,
	EXCLUDE: -1,
};

export function projection(projections) {
	return input => {
		return _internalProjection({ projections, input });
	};
}

function _internalProjection({ projections, input }) {
	if (!(input && typeof input === 'object') || !Array.isArray(projections)) {
		return input;
	}
	let result = input;
	projections.forEach(projectionSpec => {
		const pathArray = projectionSpec.path.split('.');
		result = _internalPathProjection({
			pathArray,
			projections: projectionSpec.projections,
			input: result,
		});
	});
	return result;
}

function _internalPathProjection({ pathArray = [], projections, input }) {
	return recursiveDeepProperty({
		pathArray,
		input,
		mappingFunc({ parentPath, isLeaf }) {
			return (input, parent) => {
				if (!parent || !(input && typeof input === 'object')) {
					return input;
				}
				let result = input;
				if (isLeaf) {
					if (Array.isArray(result)) {
						result = result.map(element => filterKeys({ input: element, projections }));
					} else {
						result = filterKeys({ input: result, projections });
					}
				}
				if (!isEmpty(parentPath) && typeof parentPath !== 'number') {
					return Object.assign({}, parent, {
						[parentPath]: result,
					});
				} else {
					return result;
				}
			};
		},
	});
}

function filterKeys({ input, projections }) {
	let result = {};
	let allKeys = Object.keys(input);
	let includedKeys = allKeys.slice();
	for (let projectionKey of Object.keys(projections)) {
		if (projections[projectionKey] === PROJECTION.INCLUDE) {
			if (allKeys.length === includedKeys.length) {
				//reset included keys
				includedKeys = [];
			}
			includedKeys.push(projectionKey);
		} else {
			includedKeys = includedKeys.filter(
				key => key !== projectionKey
			);
		}
	}
	includedKeys.forEach(
		includedKey =>
			(result[includedKey] = input[includedKey])
	);
	return result;
}
