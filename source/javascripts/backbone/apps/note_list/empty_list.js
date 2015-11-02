App.module("NoteList.Views", function(Views, App, Backbone, Marionette, $, _) {

  Views.EmptyListView = Marionette.ItemView.extend({
    template: "note_list/empty_list",
  });

});