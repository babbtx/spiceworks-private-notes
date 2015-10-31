App.module("Login.Views", function(Views, App, Backbone, Marionette, $, _) {

  Views.LoginModal = Marionette.ItemView.extend({
    template: "login_modal",
    id: "login-modal",
    className: "modal",

    onShow: function(){
      this.$el.openModal({dismissible: false});
    },

    onBeforeDestroy: function(){
      this.$el.closeModal();
    }
  });

});