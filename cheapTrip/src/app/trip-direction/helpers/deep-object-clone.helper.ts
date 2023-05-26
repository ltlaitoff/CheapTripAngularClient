export function deepObjectClone<T extends Object>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
