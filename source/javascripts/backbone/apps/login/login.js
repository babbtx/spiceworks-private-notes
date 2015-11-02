App.module("Login", function(Login, App, Backbone, Marionette, $, _) {

  Login.Controller = {

    showLoginModal: function(){
      return App.channel.request("modals:show", new Login.Views.LoginModal());
    },

    autoLoginUser: function(){
      return App.channel.request("models:spiceworks_user:login");
    },

    dismissLoginModal: function(){
      return App.channel.request("modals:dismiss");
    },

    showLoginFailureModal: function(err){
      var detail = (err instanceof Parse.Error && _.has(err, "message")) ? err.message : JSON.stringify(err);
      App.channel.request("modals:error", {
        title: "Login failed",
        message: "Automatic login failed. Please try again or contact support.",
        detail: detail
      });
    },

    autoLoginWithUI: function(){
      var that = this;
      return $.when()
        .then(that.showLoginModal.bind(that))
        .then(that.autoLoginUser.bind(that))
        .then(that.dismissLoginModal.bind(that))
        .fail(that.showLoginFailureModal.bind(that));
    },

    login: function(force){
      if (force) {
        return this.autoLoginWithUI();
      }
      else {
        var that = this;
        var d = $.Deferred();
        Parse.Session.current()
          .done(function(){ // session's Parse.Promise
            d.resolve();
          })
          .fail(function(){ // session's Parse.Promise
            that.autoLoginWithUI()
              .done(function(){ // autoLoginWithUI's $.Deferred
                d.resolve();
              })
              // not propagating failure here because autoLoginWithUI pops the error modal on failure
          });
        return d.promise();
      }
    }

  };

  App.channel.reply("login", function(force){
    return Login.Controller.login(force);
  });

});