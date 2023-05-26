export function getDataFromObjectByKeys<A extends string | number, T>(
  keys: A[],
  data: Record<A, T | undefined>
): T[] {
  const result: T[] = [];

  keys.forEach(id => {
    const resultData: T | undefined = data[id];

    if (resultData === undefined) return;

    result.push(resultData);
  });

  return result;
}
