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
	isParentPathArray,
	mappingFunc,
}) {
	if (pathArray.length === 0) {
		return mappingFunc({
			parentPath,
			isLeaf: true,
		})(input, parent);
	}

	let [currentPath] = pathArray;
	const isCurrentPathArray = currentPath.toString().endsWith('[]');
	if (isCurrentPathArray) {
		currentPath = currentPath.substring(0, currentPath.length - 2);
		if (currentPath === '') {
			isParentPathArray = true;
			pathArray = pathArray.slice();
		}
	}

	if (Array.isArray(input) && isParentPathArray) {
		const result = input.map((element, index) =>
			recursiveDeepProperty({
				pathArray,
				parentPath: index,
				isParentPathArray: true,
				parent: input,
				input: element,
				mappingFunc,
			})
		);

		return mappingFunc({
			parentPath,
			isCurrentPathArray: true,
			currentPath: [],
			isLeaf: false,
		})(result, parent);

	} else {
		if (isNullOrUndefined(input)) {
			return mappingFunc({
				currentPath,
				isCurrentPathArray,
				parentPath,
				isLeaf: true,
			})(input, parent);
		}

		const currentParent = input;

		const currentInput = _getPath({
			parent: currentParent,
			path: currentPath,
		});

		const nextPathArray = pathArray.slice(1);

		const result = recursiveDeepProperty({
			pathArray: nextPathArray,
			input: currentInput,
			parentPath: currentPath,
			isParentPathArray: isCurrentPathArray,
			parent: currentParent,
			mappingFunc,
		});

		return mappingFunc({
			currentPath,
			isCurrentPathArray,
			parentPath,
			isLeaf: false,
		})(result, parent);
	}
}

function _getPath({ path, parent }) {
	return !isEmpty(path) ? parent[path] : parent;
}
