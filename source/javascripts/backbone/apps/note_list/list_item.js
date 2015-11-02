App.module("NoteList.Views", function(Views, App, Backbone, Marionette, $, _) {

  Views.ListItem = Marionette.ItemView.extend({
    template: "note_list/list_item",
    tagName: "li",
  });

});