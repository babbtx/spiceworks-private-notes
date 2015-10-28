/* Custom jQuery event handler "ripple" for any element with class "ripple".
 * Adapted from http://codepen.io/Craigtut/pen/dIfzv
 */
$(document).on('ripple', '.ripple', function(evt, xPos, yPos){
  evt.preventDefault();

  var eltOffset = $(this).offset();
  xPos = xPos || (evt.pageX - eltOffset.left) || _.random(0, $(this).width());
  yPos = yPos || (evt.pageY - eltOffset.top) || _.random(0, $(this).height());

  var $div = $('<div class="ripple-effect"/>');
  var $ripple = $(".ripple-effect");

  $ripple.css("width", $(this).width());
  $ripple.css("height", $(this).height());
  $div
    .css({
      left: xPos - ($(this).width()/2),
      top: yPos - ($(this).height()/2),
      background: $(this).data("ripple-color") || "orange"
    })
    .appendTo($(this));

  _.delay($div.remove.bind($div), 1500);
});
