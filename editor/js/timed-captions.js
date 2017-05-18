function addAnotherCaption() {
  $("#captions").append("<div class='specific-caption'><div class='col-60 caption-text'> <input class='input-caption-text' name='caption' type='text' autocomplete='off' placeholder='Enter caption' /> </div><div class='col-20 caption-time'> <input class='input-caption-time' name='time' type='text' autocomplete='off' value='0' /></div><div class='col-20'><div class='delete-caption'><h5>X<h5></div></div></div>");
}

function removeCaption(div) {
  div.parentElement.parentElement.remove();
}
$(document).ready(function() {
  $("#add-more-captions").click(function() {
    $(".hide-until-captions-added").show();
    addAnotherCaption();
  });

  $('body').on('click', '.delete-caption', function() {
    removeCaption(this);
  });
});
