import { getDeepProperty } from './helper';

describe.only('Testing getDeepProperty', () => {
	test.each([
		['', 1, 1],
		['', undefined, undefined],
		['test', { test: 1 }, 1],
		['a.b', { a: { b: 1 } }, 1],
		['a.b', { a: { b: null } }, null],
		['d', { a: 1 }, undefined],
		['d.a.c', { a: 1 }, undefined],
		['a.b.c.d', { a: { b: 1 } }, undefined],
		['a[]', { a: [1, 2] }, [1, 2]],
		['[]', [1, 2] , [1, 2]],
		['[].a', [{ a: 1}, {a: 2}] , [1, 2]],
		['a.b[].c', { a: { b: [{ c: 1 }, { c: 2 }] } }, [1, 2]],
		[
			'a.b[].c[].d',
			{
				a: {
					b: [
						{ c: [{ d: 1 }, { d: 2 }] },
						{ c: [{ d: 2 }, { d: 3 }] },
					],
				},
			},
			[[1, 2], [2, 3]],
		],
	])('getting path "%s" for object %j returns %j', (path, object, output) => {
		expect(getDeepProperty({ path, object })).toEqual(output);
	});
});