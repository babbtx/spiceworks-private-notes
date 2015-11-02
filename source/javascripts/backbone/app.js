//= require ./patches

var App = new Backbone.Marionette.Application();

App.on("start", function(){
  App.rootLayout = new App.Root.LayoutView();
  App.rootLayout.render();
  App.router = new App.Root.Router();

  // rewrite the "url" if cookies aren't support
  Cookies.set("testing","1",{expires: 1});
  if (!Cookies.get("testing")){
    window.location.href = "/cookies.html";
  }

  Backbone.history.start();
})
