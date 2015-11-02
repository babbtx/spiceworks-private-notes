App.module("NoteList.Views", function(Views, App, Backbone, Marionette, $, _) {

  Views.Main = Marionette.CompositeView.extend({
    template: "note_list/main",
    childView: Views.ListItem,
    childViewContainer: "ul",
    emptyView: Views.EmptyListView,

    behaviors: {BodyClass: {}},

    serializeData: function(){
      return {count: this.collection.length};
    },

    onShow: function(){
      this.$el.find(".collapsible").collapsible();
    }
  });

});