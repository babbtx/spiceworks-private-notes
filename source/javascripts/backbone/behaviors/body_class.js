App.module("Behaviors", function(Behaviors, App, Backbone, Marionette, $, _){
  /**
   * Applies the template name (hyphenated) as a class name to the HTML body element.
   */
  Behaviors.BodyClass = Marionette.Behavior.extend({
    onShow: function(){
      $('body').addClass(this.cssClassName());
    },
    onDestroy: function(){
      $('body').removeClass(this.cssClassName());
    },
    cssClassName: function(){
      if (this.options.className) {
        return this.options.className;
      }
      else {
        // replace all non-alpha, -, _ with '-' and then take off leading and trailing
        return this.view.template.replace(/[\W\-]+/g, '-').replace(/(^-+|-+$)/, '')
      }
    }
  })
});
