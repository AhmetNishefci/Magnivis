import {createHash} from 'node:crypto';
const normalizeJson = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, normalizeJson(child)]),
    );
  }
  return value;
};

export const stableJson = (value: unknown, indentation?: number) =>
  JSON.stringify(normalizeJson(value), null, indentation);

export const sha256Json = (value: unknown) => createHash('sha256')
  .update(stableJson(value))
  .digest('hex');
