App.module("Root", function(Root, App, Backbone, Marionette, $, _) {

  Root.ModalsController = {
    showView: function(view){
      App.rootLayout.showChildView("modal", view);
    },

    dismiss: function(){
      App.rootLayout.getRegion("modal").empty();
    },

    showError: function(options){
      this.showView(new Root.ErrorModalView(options));
    }
  };

  App.channel.reply("modals:show", function(view){
    return Root.ModalsController.showView(view);
  });

  App.channel.reply("modals:dismiss", function(){
    return Root.ModalsController.dismiss();
  });

  App.channel.reply("modals:error", function(options){
    return Root.ModalsController.showError(options);
  });

});