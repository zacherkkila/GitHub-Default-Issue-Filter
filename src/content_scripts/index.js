import helpers from '../helpers/helpers';
import $ from 'jquery';
import * as browser from 'webextension-polyfill';

console.log('Content scripts has loaded');

browser.runtime.onMessage.addListener(function (message) {
  if(message.filter)
  {
    var repo = helpers.getRepoFromUrl(window.location.href);
    window.location.href = 'https://github.com/' + repo + '/issues?q='+message.filter;
  }
});

var repo = helpers.ghConvert(window.location.href).repo;
var url = window.location.href;

if(url.toLowerCase().endsWith('/issues') || url.toLowerCase().endsWith('/issues/'))
{
  redirectToIssueUrl(false);
}

function redirectToIssueUrl(needsRedirect)
{
  var issueUrl = 'https://github.com/' + repo + '/issues';
  browser.storage.local.get(repo).then((item) => {
    if(item[repo])
    {
      window.location.href = issueUrl + '?q='+ item[repo];
    }
    else
    {
      needsRedirect && (window.location.href = issueUrl);
    }
  }).catch(() => {
    needsRedirect && (window.location.href = issueUrl);
  });
}

$(document).on('click', 'a[href$=\''+repo+'/issues\']', function(e) {
  e.preventDefault();
  redirectToIssueUrl(true);
});
