var apiKey = "";

function getseamus_audioParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getseamus_audioParameters();

var getSeamusId = function(titleString) {
  var seamusId;
  if ($.isNumeric(titleString)) {
    // If the user enters a Seamus ID, let's just return it.
    seamusId = titleString;
    return seamusId;
  } else if (titleString.includes("one.npr.org")) {
    // If you search with an one.npr.org URL, you'll get two IDs back. We want the second one ($matches[1]).
    var pattern = /([0-9]{5,9})/g;
    var matches = pattern.exec(titleString);
    seamusId = matches[1];
    return seamusId;
  } else if (titleString.includes(" | ")) {
    // If you search and select a story, its title will be {title in text} | {storyId}
    var seamusId = titleString.split("|")[1];
    seamusId = seamusId.trim();
    return seamusId;
  } else {
    // If you just search with a single term (no story ID), check the API nad return the best repsonse
    // @todo - port the logic for this.
  }
}

var getAudio = function(seamusId) {
  var audioUrl;
  $.ajax({
    url: "https://api.npr.org/listening/v2/aggregation/" + seamusId + "/recommendations?startNum=0",
    beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    },
    success: function (data) {
      if (typeof data.items[0].links.audio != 'undefined') {
          var audios = [];
          audios.push(data.items[0].links.audio[0].href);

          $.each(data.items[0].links.audio, function (key, value) {
              if (value["content-type"] == 'audio/aac') {
                  audios.push(value.href);
              }
          });

          if (typeof audios[1] != 'undefined') {
              audio = audios[1];
          } else {
              audio = audios[0];
          }
          audioUrl = audio;
      }
      setAudioUrl(audioUrl);
    },
    error: function () {
        alert("You're receiving this message because there was an error. Please ensure your story has audio.");
    }
  });
}

var setAudioUrl = function(audioUrl) {
  $(".audioUrl").html("<a href=" + audioUrl + " download='story_audio'><button id='audio-download'>Download Audio</button></a>");
}

var stories = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'http://dev-dperry.npr.org/bullhorn-phil/suggest.php?query=%QUERY',
        wildcard: '%QUERY'
    }
});

$('.tt-query').typeahead({
    minLength: 0,
    highlight: true
},
{
    name: 'stories',
    limit: 15,
    source: stories
});


$(document).ready(function() {
  $("form#seamus_audio_form").submit(function(event) {
    event.preventDefault();
    var search = $('input#storySearch').val();
    var seamusId = getSeamusId(search);
    getAudio(seamusId);
  });
});
