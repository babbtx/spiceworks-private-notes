App.module("EditNote.Views", function(Views, App, Backbone, Marionette, $, _){

  Views.Timestamp = Marionette.ItemView.extend({
    template: false,
    className: "timestamp ripple",
    tagName: "span",

    modelEvents: {
      "change:updatedAt": "updateMessage"
    },

    onRender: function(){
      this.$el.html(this.getTimestampMessage());
    },

    getTimestampMessage: function(){
      if (this.model.isNew()) {
        return "Changes save automatically";
      }
      else {
        return "Last saved " + moment(this.model.get("updatedAt")).format('ll LTS');
      }
    },

    updateMessage: function(){
      this.$el.html(this.getTimestampMessage());
      this.$el.trigger("ripple");
    }
  });
});