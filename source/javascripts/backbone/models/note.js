App.module("Models", function(Models, App, Backbone, Marionette, $, _){
  var count = 0;

  Models.Note = Parse.Object.extend({
    className: "Note",

    initialize: function(attrs, options){
      this.cid = "Note-" + ++count; // necessary to stuff these into the collection below
      _.extend(this, Models.ParseEvents);
    }
  });

  Models.NotesCollection = Backbone.Collection.extend({
    // Backbone.Collection wants the model id from the object attributes
    // but Parse stores the attributes as a separate object from the object.id.
    // Luckily we can use our "key" attribute as an object id in the collection.
    modelId: function(attrs){
      return attrs.key;
    },
    _isModel: function(obj){
      return (obj instanceof Models.Note);
    },
  })

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
        });
    },

    list: function(){
      return App.channel.request("login")
        .then(function(){
          var d = $.Deferred();
          var query = new Parse.Query(Models.Note);
          query.equalTo("user", Parse.User.current());
          query.descending("updatedAt");
          query.limit(5);
          query.find()
            .done(function(list){
              d.resolve(new Models.NotesCollection(list || []));
            })
            .fail(function(err){
              d.reject(err);
            });
          return d.promise();
        });
    }
  };

  App.channel.reply("models:note", Models.Note.API.findOrInitialize);
  App.channel.reply("models:note:list", Models.Note.API.list);
});
