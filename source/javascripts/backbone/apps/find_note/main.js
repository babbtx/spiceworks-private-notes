App.module("FindNote.Views", function(Views, App, Backbone, Marionette, $, _){
  Views.Main = Marionette.ItemView.extend({
    template: "find_note/main",

    behaviors: {BodyClass: {}},

    buildKey: function(attrs){
      return attrs.host_auid + "-" + attrs.user_auid + "-" + attrs.resource_type + "-" + attrs.resource_id;
    },

    onShow: function(){
      var that = this;
      var deferred = $.Deferred();
      var attrs = {};
      attrs.host_auid = App.spiceworksEnvironment.app_host.auid;
      attrs.user_auid = App.spiceworksEnvironment.user.user_auid;
      App.spiceworksCard.services("helpdesk").on("showTicket", function(id){
        attrs.resource_type = "ticket";
        attrs.resource_id = id;
        deferred.resolve();
      });
      App.spiceworksCard.services("inventory").on("device:show", function(id){
        attrs.resource_type = "device";
        attrs.resource_id = id;
        deferred.resolve();
      });
      _.delay(function(){
        deferred.reject("Failed to initialize Spiceworks placement in 15 seconds");
      }, 15000);
      deferred
        .then(function(){
          return App.channel.request("models:note", {key: that.buildKey(attrs)})
        })
        .then(function(note){
          _.each(attrs || {}, function(value, attr){
            note.set(attr, value);
          });
          App.channel.trigger("router:navigate", "editNote", {model: note});
        })
        .fail(function(error){
          App.channel.trigger("router:navigate", "error", {error: error});
        })
    }
  });
});