export function isNumeric(value: any): boolean {
  return !isNaN(value) && !isNaN(parseInt(value));
}
