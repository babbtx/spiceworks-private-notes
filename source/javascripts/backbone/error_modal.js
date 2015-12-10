App.module("Root", function(Root, App, Backbone, Marionette, $, _) {

  Root.ErrorModalView = Marionette.ItemView.extend({
    template: "error_modal",
    id: "error-modal",
    className: "modal",

    serializeData: function(){
      var data = {};
      data.title = this.options.title || "Error";
      data.message = this.options.message || "An unknown error occurred. Please try again or contact support.";
      data.detail = this.options.detail;
      data.dismissible = this.options.dismissible;
      return data;
    },

    onShow: function(){
      Rollbar.info("Error modal: " + (this.options.message || "(generic)"));
      this.$el.openModal({dismissible: false});
      this.$el.find(".collapsible").collapsible();
    },

    onBeforeDestroy: function(){
      this.$el.closeModal();
    }
  });

});