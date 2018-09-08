import { sort, reverse } from './arrays';

describe('Testing sort', () => {
	test.each([
		[[4, 1, 3], [1, 3, 4], undefined],
		[[4, 1, 2], [4, 2, 1], (a, b) => b - a],
	])('given %j sort returns %j', (input, output, args) => {
		const copy = input.slice();
		expect(sort(input, args)).toEqual(output);
		expect(input).toEqual(copy);
	});
});

describe('Testing reverse', () => {
	test.each([[[4, 1, 3], [3, 1, 4]], [[4, 1, 2], [2, 1, 4]]])(
		'given %j reverse returns %j',
		(input, output) => {
			const copy = input.slice();
			expect(reverse(input)).toEqual(output);
			expect(input).toEqual(copy);
		}
	);
});
