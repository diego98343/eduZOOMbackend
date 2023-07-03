const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
const unauthorizedError  = require('./unauthorized');

module.exports = {
  unauthorizedError ,
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
