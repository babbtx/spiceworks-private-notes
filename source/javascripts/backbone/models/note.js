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
      return App.channel.request("login")
        .then(function(){
          var currentUser = Parse.User.current();
          note.set("user", currentUser);
          var acl = new Parse.ACL(currentUser);
          acl.setPublicReadAccess(false);
          note.setACL(acl);
          return note;
        })
    },

    findOrInitialize: function(properties){
      var query = new Parse.Query(Models.Note);
      _.each(properties || {}, function(value,property){
        query.equalTo(property, value);
      });
      return App.channel.request("login")
        .then(function(){
          var d = $.Deferred();
          query.equalTo("user", Parse.User.current());
          query.first()
            .done(function(note){ // query's Parse.Promise
              if (note){
                d.resolve(note);
              }
              else {
                Models.Note.API.initialize(properties)
                  .done(function(note){ // initialize's $.Deferred
                    d.resolve(note);
                  })
                  .fail(function(err){ // initialize's $.Deferred
                    d.reject(err);
                  });
              }
            })
            .fail(function(err){ // query's Parse.Promise
              d.reject(err);
            });
          return d.promise();
        })
    }
  };

  App.channel.reply("models:note", Models.Note.API.findOrInitialize);
});
