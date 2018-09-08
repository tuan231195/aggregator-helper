import { isNullOrUndefined } from './object';

describe('Testing isNullOrUndefined', () => {
	test.each([
		[null, true],
		[undefined, true],
		[0, false],
		[1, false],
		['0', false],
		[false, false],
		[true, false],
	])('given %s returns %s', (input, output) => {
		expect(isNullOrUndefined(input)).toBe(output);
	});
});
