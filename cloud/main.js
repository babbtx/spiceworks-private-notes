var authorizer = require("cloud/lib/spiceworks_authorizer");
var spiceworks_user = require("cloud/lib/spiceworks_user");

Parse.Cloud.define("getLoginToken", function(request, response){
  authorizer.authorize(request.params)
    .then(function(){
      return spiceworks_user.loginOrCreate(request.params.user_auid);
    })
    .then(function(user){
      response.success(user.getSessionToken());
    })
    .fail(function(err){
      var message = (typeof err === "string") ? err : JSON.stringify(err);
      console.warn("Returning login error to browser: " + message);
      response.error(message);
    })
});