App.module("EditNote.Views", function(Views, App, Backbone, Marionette, $, _){
  Views.Editor = Marionette.ItemView.extend({
    template: false,
    className: "editor",

    modelEvents: {
      "change:body": "updateBody"
    },

    editorOptions: {
      delay: 100,
      targetBlank: true,
      placeholder: {text: "Point. Click. Type."},
    },

    initialize: function(options){
      this.saveThrottled = _.throttle(this.save, 1000); // so we don't repeatedly call save
      this.saveDelayed = _.debounce(this.saveNow, 5000); // save after time with no changes
    },

    onRender: function(){
      var body = this.model.get("body");
      if (body){
        this.$el.html(body);
      }
      this.editor = new MediumEditor(this.$el, this.editorOptions);
    },

    onBeforeDestroy: function(){
      if (this.editor){
        this.editor.destroy();
      }
    },

    onShow: function(){
      var that = this;
      this.editor.subscribe("editableInput", function(){
        that.dirty = true;
        that.saveThrottled();
      })
    },

    // saves after inactivity delay unless it's been too long
    save: function(){
      this.nextSave = this.nextSave || moment().add(30, 'seconds');
      if (moment() < this.nextSave) {
        this.saveDelayed();
      }
      else {
        this.saveNow();
      }
    },

    saveNow: function(){
      this.nextSave = moment().add(30, 'seconds');
      if (this.dirty || false) {
        console.log("SAVING");
        // console.log("CONTENT = " + this.$el.html());
        this.model.set("body", this.$el.html());
        this.model.save();
      }
      this.dirty = false;
    },

    updateBody: function(){
    }
  });
});