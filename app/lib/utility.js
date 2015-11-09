function throwError(errorCode, error) {
    throw {
        errorCode: errorCode,
        time: new Date(),
        name: 'LasForceError',
        error: error
    };

}
