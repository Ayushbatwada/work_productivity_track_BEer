function responseForInternalServerError() {
    this.code = 500;
    this.status = 'failure';
    this.message = 'Internal Server Error'
}

function responseForPayloadIncorrectError() {
    this.code = 400;
    this.status = 'failure';
    this.message = 'Payload is not correct. It is missing one or more required info'
}

function responseForObjectNotFound() {
    this.code = 200;
    this.status = 'not_found';
    this.message = 'Queried object does not exist'
}

function responseForSuccessMessage() {
    this.code = 200;
    this.status = 'success';
}

function responseForGenericFailureError() {
    this.code = 400;
    this.status = 'failure';
}

function responseForUnauthorisedUserError() {
    this.code = 401;
    this.message = 'User is not authorised with given credential'
    this.status = 'unauthorised';
}

module.exports = {
    serverError: responseForInternalServerError,
    payloadError: responseForPayloadIncorrectError,
    notFoundError: responseForObjectNotFound,
    successMessage: responseForSuccessMessage,
    genericFailureError: responseForGenericFailureError,
    unauthorisedUserResponse: responseForUnauthorisedUserError,
    customLabels : {
        totalDocs: 'total',
        docs: 'data',
        limit: 'limit',
        page: 'page',
        totalPages: 'pages'
    }
}
