var GITHUB_URI = 'https://api.github.com/users';
var refreshButton = document.querySelector('.refresh');
var close = document.querySelectorAll('.close');

var Observable = Rx.Observable;
var close$ = Observable.fromEvent(close, 'click');


// stream returns uri
var startupRequestUri$ = Observable.of(GITHUB_URI);
var refreshClick$ = Observable.fromEvent(refreshButton, 'click');


// stream returns github uri with random 'since' property
var requestOnRefresh$ = refreshClick$
  .map(function () {
    var randomOffset = Math.floor(Math.random() * 500);
    console.log(GITHUB_URI + '?since=' + randomOffset);
    return GITHUB_URI + '?since=' + randomOffset;
  });


// merge both streams which return github URI
var githubRequest$ = startupRequestUri$.merge(requestOnRefresh$);


// shareReplay() stops a new connection happening on every "subscribe" by converting
// the stream into a hot observable and sharing the data
var gitHubResponse$ = githubRequest$
  .switchMap(function (requestUrl) {
    return Observable.fromPromise(jQuery.getJSON(requestUrl));
  })
  .do(function (users) { console.log('github response', users) })
  .publishReplay(1).refCount();


function getRandomUser(githubUsers) {
  return githubUsers[Math.floor(Math.random() * githubUsers.length)];
}

function createSuggestionStream(gitHubResponse$, close$) {
  return gitHubResponse$
    .do(function () {
      document.querySelectorAll('.close').forEach(function(el){
        setTimeout(el.click.bind(el), 0);
      })
    })
    .startWith(null)
    .merge(refreshClick$.map(function (evt) {
      return null;
    }))
    // withLatestFrom() is similar to combineLatest(). It will take args from both streams
    // and you can return a single value from the callback
    .merge(close$.withLatestFrom(gitHubResponse$,
      function (clickEvt, githubUsers) {
        clickEvt.preventDefault();
        var user = getRandomUser(githubUsers);
        user.target = clickEvt.target.target;
        console.log(5, user)
        return user;
      }));
}

createSuggestionStream(gitHubResponse$, close$).subscribe(renderSuggestion);


// Rendering ---------------------------------------------------
function renderSuggestion(user) {
  if (user && user.target) {
    var selector = ('.' + user.target);
    var suggestionEl = document.querySelector(selector);
    suggestionEl.style.visibility = 'visible';
    var usernameEl = suggestionEl.querySelector('.username');
    usernameEl.href = user.html_url;
    usernameEl.textContent = user.login;
    var imgEl = suggestionEl.querySelector('img');
    imgEl.src = "";
    imgEl.src = user.avatar_url;
  }

}