export function generateUUID() {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

export function parseValue(value: any) {
  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  if (typeof value === 'boolean') {
    return Number(value);
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
}
