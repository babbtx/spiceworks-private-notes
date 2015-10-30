App.module("Login", function(Login, App, Backbone, Marionette, $, _) {

  Login.Controller = {

    login: function(){
      Parse.Session.current()
        .done(function(){
          // already logged in
          var d = $.Deferred();
          d.resolve();
          return d.promise();
        })
        .fail(function(){
          var view = new Login.Views.LoginModal();
          // FIXME should use the radio channel to do this rather than knowing about rootLayout
          App.rootLayout.showChildView("modal", view);
          return $.Deferred();
        });
    }

  };

  App.channel.reply("login", function(){
    return Login.Controller.login();
  });

});