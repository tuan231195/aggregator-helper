import { compose, pipe, not } from './functional';

function f(a, b) {
	return a * b;
}

function g(a) {
	return a + 1;
}

function h(a) {
	return a * 2;
}

describe('Testing pipe', () => {
	const testCase = [[[1, 2], 6], [[4, 5], 42], [[5, 7], 72]];
	test.each(testCase)('Given %j then return %d', (input, output) => {
		expect(
			pipe(
				f,
				g,
				h
			)(...input)
		).toBe(output);
	});
});

describe('Testing compose', () => {
	const testCase = [[[1, 2], 6], [[4, 5], 42], [[5, 7], 72]];
	test.each(testCase)('Given %j then return %d', (input, output) => {
		expect(
			compose(
				h,
				g,
				f
			)(...input)
		).toBe(output);
	});
});

describe('Testing not', () => {
	function f(a) {
		return a % 2 === 0;
	}

	const testCase = [[2, false], [3, true]];
	test.each(testCase)('Given %j then return %d', (input, output) => {
		expect(not(f)(input)).toBe(output);
	});
});
