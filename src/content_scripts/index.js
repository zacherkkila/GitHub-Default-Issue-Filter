import helpers from '../helpers/helpers'
import $ from "jquery";

console.log('Content scripts has loaded');

browser.runtime.onMessage.addListener(function (message) {
    if(message.filter)
    {
        var repo = helpers.getRepoFromUrl(window.location.href)
        window.location.href = "https://github.com/" + repo + "/issues?q="+message.filter
    }
});

var repo = helpers.ghConvert(window.location.href).repo
var url = window.location.href

if(url.toLowerCase().endsWith("/issues") || url.toLowerCase().endsWith("/issues/"))
{
    redirectToIssueUrl()
}

function redirectToIssueUrl()
{
    browser.storage.local.get(repo).then((item) => {
        if(item[repo])
        {
            window.location.href = "https://github.com/" + repo + "/issues?q="+ item[repo]
        }
        else
        {
            window.location.href = href
        }
    }).catch(() => {
        window.location.href = href
    })
}

$(document).on('click', "a[href$='"+repo+"/issues']", function(e) {
    e.preventDefault()
    redirectToIssueUrl()
})
