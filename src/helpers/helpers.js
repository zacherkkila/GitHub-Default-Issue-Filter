import * as browser from 'webextension-polyfill';
var gh = require('parse-github-url');

const getCurrentTab = () => {
  return new Promise((resolve, reject) => {
    browser.tabs.query({
      currentWindow: true,
      active: true
    })
      .then((tabs) => resolve(tabs[0]))
      .catch({reject});
  });
};

const ghConvert = (url) => {
  return gh(url);
};

const isGitHubRepo = (url) => {
  console.log(gh(url));
  return ghConvert(url) != null;
};

const getRepoFromUrl = (url) => {
  if(!isGitHubRepo(url))
    return null;
  return ghConvert(url).repo;
};

const exp = {
  getCurrentTab,
  getRepoFromUrl,
  isGitHubRepo,
  ghConvert
};

export default exp;