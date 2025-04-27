export const isErrorHttpResponseCode = (httpResponseCode: number) => {
  return !(httpResponseCode >= 200 && httpResponseCode < 400);
};
