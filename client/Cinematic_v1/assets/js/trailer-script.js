//* THIS SCRIPT IS IN A SEPERATE FILE FOR CONSTRUCTION PURPOSES 
// IT REFERENCES CODE FROM THE MAIN SCRIPT AND SHOULD BE MERGED

$('#results').on('click', $('.card'), function(event) {
  console.log('test');
  event.preventDefault();
  let target = event.target;
  let targetEl = target.closest('div[id]');
  let targetId = targetEl.getAttribute('id');
  if (targetId == 'results') {
    return;
  } else {
    console.log('it worked!');
    let imdbYouTubeTrailer = {
      'url': 'https://imdb-api.com/en/API/YouTubeTrailer/k_5yme52ms/',
      'method': 'GET',
      'timeout': 0,
    }
    imdbYouTubeTrailer.url += targetId;
    console.log(imdbYouTubeTrailer);

    $.ajax(imdbYouTubeTrailer).done(function (response) {
      let responseArray = response;
      console.log(responseArray);
    })
  }
})