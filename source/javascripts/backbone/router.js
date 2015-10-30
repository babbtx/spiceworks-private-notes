App.module("Root", function(Root, App, Backbone, Marionette, $, _){

  /*
   * FIXME I'm most certainly keeping the URL in sync in the "wrong way."
   * Maybe a better approach would be to make the router:navigate event
   * use the routes and not the controller method names, then sync the URL there.
   */

  Root.ContainerController = {

    findNote: function(){
      App.rootLayout.showChildView("container", new App.FindNote.Views.Main());
      // update URL
      Backbone.history.navigate("note/find", {trigger: false});
    },

    editNote: function(options){
      App.rootLayout.showChildView("container", new App.EditNote.Views.Main(options));
      // update URL
      var key = options.key || options.model.get("key");
      Backbone.history.navigate("note/" + key, {trigger: false});
    },

    editNoteByKey: function(key){
      this.editNote({key: key});
    },

    notFound: function(){
      window.location.href = "/404.html";
    }
  };

  Root.Router = Marionette.AppRouter.extend({
    controller: Root.ContainerController,
    appRoutes: {
      "note/find": "findNote",
      "note/:key": "editNoteByKey",
      "*notFound": "notFound"
    }
  });

  App.channel.on("router:navigate", function(name /*...*/){
    Root.ContainerController[name].apply(Root, _.toArray(arguments).slice(1));
  });
});