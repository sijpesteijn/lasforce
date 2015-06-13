
function throwError(code, error, status) {
  throw {
    status: status,
    errorCode: code,
    time: moment(),
    name: 'LasForceError',
    error: error
  };

}
