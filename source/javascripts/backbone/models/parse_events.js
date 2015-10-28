App.module("Models", function(Models, App, Backbone, Marionette, $, _) {

  /**
   * Kind of adds Backbone-like events to a Parse.Object.
   * The problem with this implementation is that Parse.Objects are unique
   * instances in the browser even though all instances keep their data in sync.
   *
   * FIXME A better implementation would be to keep instances of event brokers
   * shared amongst the Parse.Objects of the same class + id.
   */
  Models.ParseEvents = _.extend(Backbone.Events, {

    // monkey patch the validate() method.
    // it receives the set of updated attributes.
    validate: function (attrs) {
      var result = Parse.Object.prototype.validate.apply(this, _.toArray(arguments));
      if (result) {
        return result;
      }
      var that = this;
      _.each(attrs, function (value, key) {
        that.trigger("change:" + key, this, value);
      });
      return false;
    },

    // monkey patch the save() method.
    // updatedAt and createdAt don't go through validate (above.)
    save: function(){
      var specialAttributes = ["updatedAt", "createdAt"];
      var that = this;
      var prev = {};
      _.each(specialAttributes, function(attr){
        prev[attr] = that.get(attr);
      });
      var promise = Parse.Object.prototype.save.apply(this, _.toArray(arguments));
      promise.done(function(){
        _.each(specialAttributes, function(attr){
          var value = that.get(attr);
          if (value && (!prev[attr] || prev[attr] != value)) {
            that.trigger("change:" + attr, that, value);
          }
        });
      });
      return promise;
    }
  });

});