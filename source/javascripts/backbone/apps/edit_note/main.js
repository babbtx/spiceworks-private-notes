App.module("EditNote.Views", function(Views, App, Backbone, Marionette, $, _){
  Views.Main = Marionette.LayoutView.extend({
    template: "edit_note/main",

    regions: {
      "timestamp": ".timestamp-region",
      "editor": ".editor-region"
    },

    behaviors: {BodyClass: {}},

    onShow: function(){
      if (this.model) {
        this.showChildView("timestamp", new Views.Timestamp({model: this.model}));
        this.showChildView("editor", new Views.Editor({model: this.model}));
      }
      else {
        var that = this;
        App.channel.request("models:note", {key: this.options.key})
          .done(function(note){
            that.model = note;
            that.onShow.call(that);
          });
      }
    }
  });
});