App.module("Login", function(Login, App, Backbone, Marionette, $, _) {

  Login.Controller = {

    showLoginModal: function(){
      App.channel.request("modals:show", new Login.Views.LoginModal());
    },

    autoLoginUser: function(){
      return _.tap($.Deferred(), function(d){d.reject("Auto login not implemented yet")});
    },

    dismissLoginModal: function(){
      App.channel.request("modals.dismiss");
    },

    showLoginFailureModal: function(err){
      App.channel.request("modals:error", {
        title: "Login failed",
        message: err || "Automatic login failed. Please try again or contact support."
      });
    },

    login: function(){
      var that = this;
      Parse.Session.current()
        .done(function(){
          return $.when().promise(); // resolved
        })
        .fail(function(){
          return $.when()
            .then(that.showLoginModal)
            .then(that.autoLoginUser)
            .then(that.dismissLoginModal)
            .fail(that.showLoginFailureModal);
        });
    }

  };

  App.channel.reply("login", function(){
    return Login.Controller.login();
  });

});