var GITHUB_URI = 'https://api.github.com/users';
var refreshButton = document.querySelector('.refresh');
var closeButton1 = document.querySelector('.close1');
var closeButton2 = document.querySelector('.close2');
var closeButton3 = document.querySelector('.close3');

var Observable = Rx.Observable;
var remove1Click$ = Observable.fromEvent(closeButton1, 'click');
var remove2Click$ = Observable.fromEvent(closeButton2, 'click');
var remove3Click$ = Observable.fromEvent(closeButton3, 'click');


// stream returns uri
var startupRequestUri$ = Observable.of(GITHUB_URI);
var refreshClick$ = Observable.fromEvent(refreshButton, 'click');

// stream returns github uri with random 'since' property
var requestOnRefresh$ = refreshClick$
  .map(() => {
    var randomOffset = Math.floor(Math.random() * 500);
    return GITHUB_URI + '?since=' + randomOffset;
  });

// merge both streams which return github URI
var githubRequest$ = startupRequestUri$.merge(requestOnRefresh$);

// shareReplay() stops a new connection happening on every "subscribe" by converting
// the stream into a hot observable and sharing the data
var gitHubResponse$ = githubRequest$
  .flatMap(function (requestUrl) {
    console.log('network request');
    return Observable.fromPromise(jQuery.getJSON(requestUrl));
  })
  .do(function (users) {
    console.log(users)
  })
  .shareReplay(1);


function getRandomUser(githubUsers) {
  return githubUsers[Math.floor(Math.random() * githubUsers.length)];
}

function createSuggestionStream(gitHubResponse$, removeClick$) {
  return gitHubResponse$
    .map(getRandomUser)
    .startWith(null)
    .merge(refreshClick$.map(function (evt) {
      return null;
    }))
    // withLatestFrom() is similar to combineLatest(). It will take args from both streams
    // and you can return a single value from the callback
    .merge(removeClick$.withLatestFrom(
      gitHubResponse$,
      function (clickEvt, githubUsers) {
        return getRandomUser(githubUsers);
      }));
}

var suggestion1Stream = createSuggestionStream(gitHubResponse$, remove1Click$);
var suggestion2Stream = createSuggestionStream(gitHubResponse$, remove2Click$);
var suggestion3Stream = createSuggestionStream(gitHubResponse$, remove3Click$);

suggestion1Stream.subscribe(function (user) {
  renderSuggestion(user, '.suggestion1');
});

suggestion2Stream.subscribe(function (user) {
  renderSuggestion(user, '.suggestion2');
});

suggestion3Stream.subscribe(function (user) {
  renderSuggestion(user, '.suggestion3');
});


// Rendering ---------------------------------------------------
function renderSuggestion(suggestedUser, selector) {
  var suggestionEl = document.querySelector(selector);
  if (suggestedUser === null) {
    suggestionEl.style.visibility = 'hidden';
  } else {
    suggestionEl.style.visibility = 'visible';
    var usernameEl = suggestionEl.querySelector('.username');
    usernameEl.href = suggestedUser.html_url;
    usernameEl.textContent = suggestedUser.login;
    var imgEl = suggestionEl.querySelector('img');
    imgEl.src = "";
    imgEl.src = suggestedUser.avatar_url;
  }
}