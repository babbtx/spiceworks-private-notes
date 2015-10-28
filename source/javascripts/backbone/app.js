//= require ./patches

var App = new Backbone.Marionette.Application();

App.on("start", function(){
  App.rootLayout = new App.Root.LayoutView();
  App.rootLayout.render();
  App.router = new App.Root.Router();
  Backbone.history.start();
})
