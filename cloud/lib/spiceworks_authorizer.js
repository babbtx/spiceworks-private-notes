'use strict';

var _ = require("underscore");
var url = "https://frontend.spiceworks.com/appcenter/api/app_user_authorization.json";
var app_namespace; // TODO set this value
var app_secret; // TODO set this value

var errorResponseToString = function (response) {
  var message = "HTTP " + response.status + " response: ";

  // if response.data.errors is an array, concatenate the strings into a sentence
  if (!_.isUndefined(response.data) && !_.isUndefined(response.data.errors) && _.isArray(response.data.errors)){
    var errors = _.inject(response.data.errors, function(result, error){
      return result + (result.length > 0 ? ", " : "") + error;
    }, "");
    message = message + errors;
  }
  else {
    // otherwise tack on the message body
    message = message + response.text;
  }
  return message;
}

/**
 *
 * @param params requires host_auid, user_auid, spiceworks_token
 */
var authorize = function (params) {
  // request params are:
  // host_auid and user_auid copied from client request
  // access_token (renamed from client spiceworks_token)
  // app_secret (configured)
  var requestParams = _.extend({},
    _.pick(params || {}, "host_auid", "user_auid"),
    {app_secret: app_secret, access_token: params.spiceworks_token});
  console.log("Spiceworks authorization request " + JSON.stringify(requestParams));
  return Parse.Cloud.httpRequest({url: url, params: requestParams})
    .then(
      function (response) {
        var auth = response.data['authorization'];
        console.log("Spiceworks authorization response " + JSON.stringify(auth));
        return auth;
      },
      function (response) {
        var message = errorResponseToString(response);
        console.warn("Spiceworks failed authorization: " + message);
        return Parse.Promise.error(message);
      }
    )
    .then(function (auth) {
      if (auth.namespace === app_namespace) {
        return true;
      }
      else {
        return Parse.Promise.error("App namespace mismatch");
      }
    });
}

module.exports = {
  authorize: authorize
};