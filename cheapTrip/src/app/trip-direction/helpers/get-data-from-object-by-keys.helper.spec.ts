import { getDataFromObjectByKeys } from './get-data-from-object-by-keys.helper';

describe('trip-direction getDataFromObjectByKeys', () => {
  const testCases: {
    keys: (number | string)[];
    data: Record<number | string, string | number>;
    result: (number | string)[];
  }[] = [
    {
      keys: [1, 3],
      data: { 1: 'a', 2: 'b', 3: 'c', 4: 'g' },
      result: ['a', 'c'],
    },
    {
      keys: [1, 4],
      data: { 1: 'a', 2: 'b', 3: 'c', 4: 'g' },
      result: ['a', 'g'],
    },
    {
      keys: [1, 3, 4],
      data: { 1: 131, 2: 132, 3: 133, 4: 134 },
      result: [131, 133, 134],
    },
    {
      keys: ['t1', 't2', 't3'],
      data: { t1: 131, t2: 132, t3: 133, t4: 134 },
      result: [131, 132, 133],
    },
    {
      keys: ['a', 't3', 't2'],
      data: { t1: 131, t2: 132, t3: 133, t4: 134 },
      result: [133, 132],
    },
  ];

  testCases.forEach(testCase => {
    it(`On keys = ${JSON.stringify(testCase.keys)} and data = ${JSON.stringify(
      testCase.data
    )} getDataFromObjectByKeys should return ${JSON.stringify(
      testCase.result
    )}`, () => {
      expect(getDataFromObjectByKeys(testCase.keys, testCase.data)).toEqual(
        testCase.result
      );
    });
  });
});
