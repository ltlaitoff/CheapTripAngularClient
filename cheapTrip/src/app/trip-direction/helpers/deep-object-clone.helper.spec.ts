import { deepObjectClone } from './deep-object-clone.helper';

describe('trip-direction deepObjectClone', () => {
  const firstTestCase = { a: '1' };

  it(`On obj = ${JSON.stringify(
    firstTestCase
  )} should return object ${JSON.stringify(
    firstTestCase
  )} and on change output object input object should not be changed`, () => {
    const result = deepObjectClone(firstTestCase);

    expect(result).not.toBe(firstTestCase);

    result.a = '2';

    expect(firstTestCase.a).not.toBe(result.a);
  });

  const secondTestCase = { a: { b: '1' } };
  it(`On obj = ${JSON.stringify(
    secondTestCase
  )} should return object ${JSON.stringify(
    secondTestCase
  )} and on change output object input object should not be changed`, () => {
    const result = deepObjectClone(secondTestCase);

    expect(result).not.toBe(secondTestCase);
    expect(secondTestCase.a).not.toBe(result.a);

    result.a.b = '2';

    expect(secondTestCase.a).not.toBe(result.a);
    expect(secondTestCase.a.b).not.toBe(result.a.b);
  });
});
