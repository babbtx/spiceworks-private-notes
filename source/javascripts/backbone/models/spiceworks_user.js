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
          spiceworksToken.reject(err);
        }
      );
      return spiceworksToken.promise();
    },

    parseTokenParams: function(params){
      var env = _.pick(App.spiceworksEnvironment.user, 'first_name', 'last_name', 'user_auid');
      env.host_auid = App.spiceworksEnvironment.app_host.auid;
      return _.extend(env, params);
    },

    getParseToken: function(spiceworksToken){
      var parseToken = $.Deferred();
      Parse.Cloud.run('getLoginToken', this.parseTokenParams({spiceworks_token: spiceworksToken}), {
        success: function(token) {
          parseToken.resolve(token);
        },
        error: function(err){
          console.warn("PARSE LOGIN FAILED");
          console.warn(err);
          parseToken.reject(err);
        }
      });
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
          .then(private.getParseToken.bind(private))
          .then(private.login.bind(private));
      }
    });

  App.channel.reply("models:spiceworks_user:login", function(){
    return Models.SpiceworksUser.login();
  });

});