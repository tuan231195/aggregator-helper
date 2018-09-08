import { isNullOrUndefined } from '../utils/object';

/**
 * Access deeply nested property for an object
 * @param {object} params
 * @param {string} params.path: the path to the property, separated by .
 * @param {Array} params.object: the object to get property
 */
export function getDeepProperty({ path, object }) {
	if (!path || !object) {
		return object;
	}
	const propertyPathArray = path.split('.');
	const _internalDeepProperty = ({ pathArray, object }) => {
		return recursiveDeepProperty({
			pathArray,
			input: object,
			mappingFunc: () => input => input,
		});
	};
	return _internalDeepProperty({ pathArray: propertyPathArray, object });
}

/**
 * Perform transformation of input based on mapping function
 * @param {object} params
 * @param {string} params.pathArray: the path array to the property
 * @param {object} params.input: object to be transformed
 * @param {function} params.mappingFunc: function to be used
 */
export function recursiveDeepProperty({ pathArray = [], input, mappingFunc }) {
	if (pathArray.length === 0) {
		return mappingFunc({
			currentPath: undefined,
			isCurrentPathArray: false,
			isLeaf: true,
			pathArray,
		})(input, input);
	}
	let [currentPath] = pathArray;
	let isCurrentPathArray = currentPath.endsWith('[]');
	if (isCurrentPathArray) {
		currentPath = currentPath.substring(0, currentPath.length - 2);
	}

	if (isNullOrUndefined(input)) {
		return mappingFunc({
			currentPath,
			isCurrentPathArray: false,
			isLeaf: true,
			pathArray,
		})(input, input);
	}
	const parent = input;
	input = currentPath ? input[currentPath] : input;
	if (!Array.isArray(input)) {
		isCurrentPathArray = false;
	}

	const nextPathArray = pathArray.slice(1);

	let result;
	if (isCurrentPathArray) {
		result = input
			.map(element =>
				recursiveDeepProperty({
					pathArray: nextPathArray,
					input: element,
					mappingFunc,
				})
			)
			.filter(element => !isNullOrUndefined(element));
	} else {
		result = recursiveDeepProperty({
			pathArray: nextPathArray,
			input,
			mappingFunc,
		});
	}
	return mappingFunc({ currentPath, isCurrentPathArray, isLeaf: pathArray.length === 1, pathArray })(
		result,
		parent
	);
}
