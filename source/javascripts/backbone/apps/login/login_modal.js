App.module("Login.Views", function(Views, App, Backbone, Marionette, $, _) {

  Views.LoginModal = Marionette.ItemView.extend({
    template: "login/login",
    id: "login-modal",
    className: "modal",

    onShow: function(){
      this.$el.openModal();
    }
  });

});