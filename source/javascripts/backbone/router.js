App.module("Root", function(Root, App, Backbone, Marionette, $, _){

  Root.Controller = {
    "editNote": function(key){
      App.rootLayout.showChildView("container", new App.EditNote.Views.Main({key: key}));
    }
  };

  Root.Router = Marionette.AppRouter.extend({
    controller: Root.Controller,
    appRoutes: {
      "note/:key": "editNote"
    }
  });

});