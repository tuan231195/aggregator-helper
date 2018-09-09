import { isEmpty, isNullOrUndefined } from '../utils/object';

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
 * @param {array} params.pathArray: the path array to the property
 * @param {object} params.input: object to be transformed
 * @param {function} params.mappingFunc: function to be used
 */
export function recursiveDeepProperty({
	pathArray = [],
	input,
	parent,
	parentPath,
	mappingFunc,
}) {
	if (pathArray.length === 0) {
		return mappingFunc({
			currentPath: undefined,
			parentPath,
			isLeaf: true,
			pathArray,
		})(input, parent);
	}

	if (Array.isArray(input)) {
		let result = input.map((element, index) =>
			recursiveDeepProperty({
				pathArray,
				parentPath: index,
				parent: input,
				input: element,
				mappingFunc,
			})
		);

		return mappingFunc({
			parentPath,
			currentPath: [],
			isLeaf: false,
			pathArray,
		})(result, parent);
	} else {
		let [currentPath] = pathArray;
		let isCurrentPathArray = currentPath.toString().endsWith('[]');
		if (isCurrentPathArray) {
			currentPath = currentPath.substring(0, currentPath.length - 2);
		}

		if (isNullOrUndefined(input)) {
			return mappingFunc({
				currentPath,
				parentPath,
				isLeaf: true,
				pathArray,
			})(input, parent);
		}

		let currentParent = input;

		let currentInput = _getPath({
			parent: currentParent,
			path: currentPath,
		});

		let nextPathArray = pathArray.slice(1);

		let result = recursiveDeepProperty({
			pathArray: nextPathArray,
			input: currentInput,
			parentPath: currentPath,
			parent: currentParent,
			mappingFunc,
		});

		return mappingFunc({
			currentPath,
			parentPath,
			pathArray,
			isLeaf: false,
			isCurrentPathArray,
		})(result, parent);
	}
}

function _getPath({ path, parent }) {
	return !isEmpty(path) ? parent[path] : parent;
}
