import { map } from './map';

const testSuite = [
	[
		'mapping could accept a transformation function',
		{
			input: [1, 2, 3],
			params: array => array.map(element => element * 2),
			output: [2, 4, 6],
		},
	],
	[
		'mapping could accept an array of transformation',
		{
			input: [
				{
					number1: 1,
					number2: 2,
				},
				{
					number1: 2,
					number2: 3,
				},
				{
					number1: 3,
					number2: 4,
				},
			],
			params: [
				{ path: '[].number1', transform: element => element * 2 },
				{ path: '[].number2', transform: element => element * 3 },
			],
			output: [
				{
					number1: 2,
					number2: 6,
				},
				{
					number1: 4,
					number2: 9,
				},
				{
					number1: 6,
					number2: 12,
				},
			],
		},
	],
	[
		'could transform deeply nested object, but preserve other properties not in the mapping list',
		{
			input: [
				{
					a: 1,
					nested: [
						{
							number: 1,
							test: 2,
						},
						{
							number: 2,
							test: 3,
						},
					],
					number: 1,
				},
				{
					a: 2,
					nested: [
						{
							number: 3,
							test: 2,
						},
					],
					number: 2,
				},
			],
			params: [
				{ path: '[].nested[].number', transform: element => element * 2 },
				{ path: '[].number', transform: element => element * 3 },
			],
			output: [
				{
					a: 1,
					nested: [
						{
							number: 2,
							test: 2,
						},
						{
							number: 4,
							test: 3,
						},
					],
					number: 3,
				},
				{
					a: 2,
					nested: [
						{
							number: 6,
							test: 2,
						},
					],
					number: 6
				},
			],
		},
	],
];
describe('Testing map operator', () => {
	test.each(testSuite)('%s', (testDescription, { params, input, output }) => {
		expect(map(params)(input)).toEqual(output);
	});
});
