import { projection } from './projection';

const testSuite = [
	[
		'projection could accept an array of projection specs - case 1',
		{
			input: [
				[
					{
						numbers: {
							a: 1,
							b: 2,
							nested: [
								{
									c: 1,
									d: 2,
								},
								{
									c: 1,
									d: 2,
								},
							],
						},
						a: 2,
					},
					{
						numbers: {
							a: 5,
							b: 6,
							nested: [
								{
									c: 3,
									d: 4,
								},
							],
						},
						a: 3,
					},
				],
				[
					{
						numbers: {
							a: 1,
							b: 2,
							nested: [
								{
									c: 1,
									d: 3,
									e: 4,
								},
							],
						},
						a: 4,
					},
					{
						numbers: {
							a: 5,
							b: 6,
							nested: [
								{
									c: 3,
									d: 4,
									e: 5,
								},
							],
						},
						a: 5,
					},
				],
			],
			params: [
				{
					path: '[].[].numbers',
					projections: {
						nested: 1,
					},
				},
			],
			output: [
				[
					{
						a: 2,
						numbers: { nested: [{ c: 1, d: 2 }, { c: 1, d: 2 }] },
					},
					{ a: 3, numbers: { nested: [{ c: 3, d: 4 }] } },
				],
				[
					{ a: 4, numbers: { nested: [{ c: 1, d: 3, e: 4 }] } },
					{ a: 5, numbers: { nested: [{ c: 3, d: 4, e: 5 }] } },
				],
			],
		},
	],
	[
		'projection could accept an array of projection specs - case 2',
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
