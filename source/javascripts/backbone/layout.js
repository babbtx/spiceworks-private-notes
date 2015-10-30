App.module("Root", function(Root, App, Backbone, Marionette, $, _){
  Root.LayoutView = Marionette.LayoutView.extend({
    el: "body",
    template: "layout",
    regions: {
      container: "#container-region",
      modal: "#modal-region"
    }
  });
});