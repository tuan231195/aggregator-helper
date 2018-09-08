import { reverse } from './arrays';

export function pipe(...functions) {
	return (...input) => {
		let output = functions[0](...input);
		for (let fn of functions.slice(1)) {
			output = fn(output);
		}
		return output;
	};
}

export function compose(...functions) {
	return pipe(...reverse(functions));
}

export function not(func) {
	return input => {
		return !func(input);
	};
}
