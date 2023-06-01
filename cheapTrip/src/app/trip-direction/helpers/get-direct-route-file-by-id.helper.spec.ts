import { getDirectRouteFileById } from './get-direct-route-file-by-id.helper';

describe('trip-direction get-direct-route-file-by-id.helper', () => {
  const testCases = [
    {
      id: '140351',
      result: '14',
    },
    {
      id: '440360',
      result: '44',
    },
    {
      id: '80251',
      result: '8',
    },
    {
      id: '1400142',
      result: '140',
    },
  ];

  testCases.forEach(testCase => {
    it(`On id = ${testCase.id}, getDirectRouteFileById should return ${testCase.result}`, () => {
      expect(getDirectRouteFileById(testCase.id)).toEqual(testCase.result);
    });
  });
});
