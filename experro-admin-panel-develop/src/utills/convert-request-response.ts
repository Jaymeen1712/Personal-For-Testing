export function camelToSnackCase(key: string) {
  return key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

export function snackCaseToCamel(key: string) {
  return key.replace(/_([a-z])/g, (c) => c[1].toUpperCase());
}

export default function shapeCollection(
  root: unknown,
  isNext?: boolean,
  config: 'snackCaseToCamel' | 'camelToSnackCase' = 'camelToSnackCase'
): unknown {
  if (typeof root !== 'object' || root == null) {
    return root;
  }

  const rootTransform =
    config === 'snackCaseToCamel' ? snackCaseToCamel : camelToSnackCase;

  const next = (input: unknown) => shapeCollection(input, true, config);

  if (Array.isArray(root)) {
    return root.map(next);
  }

  return Object.entries(root).reduce((result, [key, value]) => {
    if (value && typeof value === 'object' && key !== 'publish') {
      value = next(value);
    }

    key = ['API_token'].includes(key) ? key : rootTransform(key);

    // @ts-ignore
    result[key] = value;

    return result;
  }, {});
}
