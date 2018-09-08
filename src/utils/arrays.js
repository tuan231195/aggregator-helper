/**
 * Immutable version of array.reverse
 * @param {array} array
 */
export function reverse(array = []) {
	return array.slice().reverse();
}

/**
 * Immutable version of array.sort
 * @param {array} array
 * @param {array} args: sort arguments
 */
export function sort(array = [], ...args) {
	return array.slice().sort(...args);
}
