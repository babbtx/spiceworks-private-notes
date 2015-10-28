App.module("EditNote.Views", function(Views, App, Backbone, Marionette, $, _){
  Views.Main = Marionette.LayoutView.extend({
    template: "edit_note/main",

    regions: {
      "timestamp": ".timestamp-region",
      "editor": ".editor-region"
    },

    behaviors: {BodyClass: {}},

    onShow: function(){
    }
  });
});