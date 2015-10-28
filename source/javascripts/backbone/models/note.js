App.module("Models", function(Models, App, Backbone, Marionette, $, _){
  Models.Note = Parse.Object.extend({
    className: "Note",

    initialize: function(attrs, options){
      _.extend(this, Models.ParseEvents);
    }
  });

  Models.Note.API = {

    initialize: function(properties){
      var note = new Models.Note();
      _.each(properties || {}, function(value,property){
        note.set(property, value);
      });
      return note;
    },

    findOrInitialize: function(properties){
      var query = new Parse.Query(Models.Note);
      _.each(properties || {}, function(value,property){
        query.equalTo(property, value);
      })
      var d = $.Deferred();
      query.first({
        success: function(note){
          if (!note){
            d.resolve(Models.Note.API.initialize(properties));
          }
          else {
            d.resolve(note);
          }
        },
        error: function(error){
          d.reject(error);
        }
      });
      return d.promise();
    }
  };

  App.channel.reply("models:note", Models.Note.API.findOrInitialize);
});
