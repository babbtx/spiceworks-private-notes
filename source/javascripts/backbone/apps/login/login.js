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

    login: function(){
      var that = this;
      Parse.Session.current()
        .done(function(){
          return $.when().promise(); // resolved
        })
        .fail(function(){
          return $.when()
            .then(that.showLoginModal.bind(that))
            .then(that.autoLoginUser.bind(that))
            .then(that.dismissLoginModal.bind(that))
            .fail(that.showLoginFailureModal.bind(that));
        });
    }

  };

  App.channel.reply("login", function(){
    return Login.Controller.login();
  });

});