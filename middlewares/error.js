class HttpError extends Error {
  constructor(code, ...params) {
    let asJSON = false;
    if (typeof params[0] !== "string") {
      params[0] = JSON.stringify(params[0]);
      asJSON = true;
    }
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError);
    this.code = code;
    this.asJSON = asJSON;
  }
}

function errorMiddleware(error, req, res, next) {
  if (!(error instanceof Error)) return;
  const code = error instanceof HttpError ? error.code : 500;
  let data = {};
  const message =
    "asJSON" in error && error.asJSON
      ? JSON.parse(error.message)
      : error.message;
  res.status(code);
  data.status = `code ${code}`;
  if (code >= 100 && code < 300) data = message;
  if (code >= 300 && code < 400) res.header("Location", message);
  if (code >= 400 && code < 500) data = message;
  if (code >= 500 && code < 600) console.error(error);
  res.json(data);
}

module.exports = { HttpError, errorMiddleware };
