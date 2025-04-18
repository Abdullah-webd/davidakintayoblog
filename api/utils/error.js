export const errorHandler = (statuscode, message) => {
    const error = new Error(message);
    error.statusCode = statuscode;
    error.message = message;
    return error;
}