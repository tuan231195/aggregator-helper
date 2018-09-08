import { projection } from './projection';

const testSuite = [
	[
		'projection could accept an array of projection specs - case 1',
		{
			input: [
				{
					number1: 1,
					number2: 3,
					numbers: {
						a: 1,
						b: 2,
						c: 3,
						d: 4,
					},
				},
				{
					number1: 1,
					number2: 4,
					numbers: {
						a: 5,
						b: 6,
						c: 7,
						d: 8,
					},
				},
			],
			params: [
				{
					path: '[]',
					projections: {
						number1: 1,
						numbers: 1,
					},
				},
				{
					path: '[].numbers',
					projections: {
						d: -1,
					},
				},
			],
			output: [
				{
					number1: 1,
					numbers: {
						a: 1,
						b: 2,
						c: 3,
					},
				},
				{
					number1: 1,
					numbers: {
						a: 5,
						b: 6,
						c: 7,
					},
				},
			],
		},
	],
];
describe('Testing projection operator', () => {
	test.each(testSuite)('%s', (testDescription, { params, input, output }) => {
		expect(projection(params)(input)).toEqual(output);
	});
});
