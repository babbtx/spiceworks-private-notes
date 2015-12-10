App.module("Models", function(Models, App, Backbone, Marionette, $, _){

  var private = {

    getSpiceworksToken: function(){
      var spiceworksToken = $.Deferred();
      (new SW.Login({appUid: App.spiceworksAppId})).request('login').then(
        function(token){
          spiceworksToken.resolve(token);
        },
        function(err){
          console.warn("SPICEWORKS LOGIN FAILED");
          console.warn(err);
          Rollbar.warning("Spiceworks login failure: " + JSON.stringify(err));
          spiceworksToken.reject(err);
        }
      );
      return spiceworksToken.promise();
    },

    buildParseTokenParams: function(spiceworksToken) {
      var env = _.pick(App.spiceworksEnvironment.user, 'first_name', 'last_name', 'user_auid');
      return _.extend(env, {host_auid: App.spiceworksEnvironment.app_host.auid, spiceworks_token: spiceworksToken});
    },

    getParseToken: function(parseTokenParams){
      var that = this;
      var parseToken = $.Deferred();
      var invalidParamsMessage;

      _.each(parseTokenParams, function(val,key){
        if (_.isUndefined(val) || val === null) {
          invalidParamsMessage = "Invalid environment value for '" +  key + "'";
        }
      });

      if (invalidParamsMessage) {
        Rollbar.info("Login error: " + invalidParamsMessage);
        parseToken.reject(invalidParamsMessage);
      }
      else {
        // ironically the cloud getLoginToken call will fail if the session is invalid
        // logOut seems to properly destroy the client-side session
        Parse.User.logOut()
          .always(function(){
            // and then for some reason this call doesn't work in the promise of logOut
            _.defer(function(){
              Parse.Cloud.run('getLoginToken', parseTokenParams, {
                success: function(token) {
                  parseToken.resolve(token);
                },
                error: function(err){
                  console.warn("PARSE LOGIN FAILED");
                  console.warn(err);
                  Rollbar.warning("Parse login failure: " + JSON.stringify(err));
                  parseToken.reject(err);
                }
              });
            });
          });
      }

      return parseToken.promise();
    },

    login: function(parseToken){
      return Parse.User.become(parseToken);
    }
  }

  Models.SpiceworksUser = Parse.User.extend(
    {
    },
    {
      /* class methods */
      login: function () {
        return private.getSpiceworksToken()
          .then(private.buildParseTokenParams.bind(private))
          .then(private.getParseToken.bind(private))
          .then(private.login.bind(private));
      }
    });

  App.channel.reply("models:spiceworks_user:login", function(){
    return Models.SpiceworksUser.login();
  });

});