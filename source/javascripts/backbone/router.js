App.module("Root", function(Root, App, Backbone, Marionette, $, _){

  Root.Controller = {
    "editNote": function(options){
      App.rootLayout.showChildView("container", new App.EditNote.Views.Main(options));
      // update URL
      var key = options.key || options.model.get("key");
      Backbone.history.navigate("note/" + key, {trigger: false});
    },
    "editNoteByKey": function(key){
      this.editNote({key: key});
    },
    }
  };

  Root.Router = Marionette.AppRouter.extend({
    controller: Root.Controller,
    appRoutes: {
      "note/:key": "editNoteByKey",
    }
  });

  App.channel.on("router:navigate", function(name /*...*/){
    Root.Controller[name].apply(Root, _.toArray(arguments).slice(1));
  });
});