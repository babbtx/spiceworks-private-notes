// configure the template lookup function to use JST/EJS templates

_.extend(Backbone.Marionette.Renderer, {
  render: function(template, data){
    if (!template) {
      return;
    }
    var fn = _.find(JST, function(val,key){
      return key.indexOf(template) > 0;
    });
    if (!fn) {
      throw "Template " + template + " not found";
    }
    return fn(data);
  }
});

// configure messaging to use radio per https://gist.github.com/jmeas/7992474cdb1c5672d88b

Backbone.Marionette.Application.prototype._initChannel = function(){
  this.channelName = _.result(this, 'channelName') || 'global';
  this.channel = _.result(this, 'channel') || Backbone.Radio.channel(this.channelName);
}