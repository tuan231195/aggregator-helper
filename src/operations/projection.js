import { recursiveDeepProperty } from './helper';
import { not } from "../utils/functional";
import { isNullOrUndefined } from "../utils/object";

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
		mappingFunc({ currentPath, isCurrentArray, pathArray }) {
			return (input, parent) => {
				if (!parent || !(input && typeof input === 'object')) {
					return input;
				}
				if (!pathArray.length) {
					let allKeys = Object.keys(input);
					let includedKeys = allKeys.slice();
					for (let projectionKey of Object.keys(projections)) {
						if (projections[projectionKey] === 1) {
							if (allKeys.length === includedKeys.length) {
								//reset included keys
								includedKeys = [];
							}
							includedKeys.push(projectionKey);
						} else {
							includedKeys = includedKeys.filter(key => key !== projectionKey);
						}
					}
					const result = {};
					includedKeys.forEach(includedKey => result[includedKey] = input[includedKey]);
					return result;
				} else {
					if (currentPath !== "" && !isNullOrUndefined(currentPath)) {
						return Object.assign({}, parent, { [currentPath]: input });
					} else {
						return input;
					}
				}
			};
		},
	});
}
