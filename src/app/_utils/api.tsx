const request = (path: string, method = 'GET', body: any = undefined, token: string) => {
  return fetch(path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: body,
  });
};
export default request;
