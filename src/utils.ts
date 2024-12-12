export const buildUrl = (baseUrl: string, keys: Object) => {
  const url = new URL(baseUrl);
  Object.entries(keys).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.href;
};
