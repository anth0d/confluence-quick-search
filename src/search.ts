import './_ga';
import { _gaq } from './analytics';
import * as storage from './utils/data';

const createResultElement = ({ name, space, resultLink }) => {
  const a = document.createElement('a');
  a.className = `search-result`;
  a.href = resultLink;
  a.title = resultLink;
  a.target = `_blank`;
  a.onclick = () => _gaq.push(['_trackEvent', 'searchresult', 'clicked']);
  const spanName = document.createElement('span');
  spanName.className = `search-result-name`;
  spanName.textContent = `${name}`;
  a.appendChild(spanName);
  const spanSpace = document.createElement('span');
  spanSpace.className = `search-result-space`;
  spanSpace.textContent = `${space || ''}`;
  a.appendChild(spanSpace);
  const p = document.createElement('p');
  p.appendChild(a);
  return p;
}

const errorMessageElement = ({ siteLink }) => {
  const pText = document.createElement('p');
  const errorMessage = document.createElement('span');
  errorMessage.textContent = `Error! Visit your site and log in:`;
  pText.appendChild(errorMessage);

  const pLink = document.createElement('p');
  const preUrl = document.createElement('pre');
  const a = document.createElement('a');
  a.href = siteLink;
  a.title = siteLink;
  a.target = `_blank`;
  a.onclick = () => _gaq.push(['_trackEvent', 'searcherror', 'clicked']);
  preUrl.textContent = siteLink;
  a.appendChild(preUrl);
  pLink.appendChild(a);

  const div = document.createElement('div');
  div.className = `search-result-name`;
  div.appendChild(pText);
  div.appendChild(pLink);
  return div;
};

let setupDiv, searchDiv;

const showSetup = () => {
  setupDiv = setupDiv || document.getElementById('setup-container');
  searchDiv = searchDiv || document.getElementById('search-container');

  searchDiv.hidden = true;
  setupDiv.hidden = false;

  const setupForm = document.getElementById('setup-form');
  const setupUrl = document.getElementById('setup-url') as HTMLInputElement;

  storage.getSiteUrl().then(siteUrl => {
    setupUrl.value = siteUrl || '';
    setupUrl.focus();
    setupForm.onsubmit = function (event) {
      event.preventDefault();
      if (!setupUrl.value.match(new RegExp('^https?:\/\/'))) {
        _gaq.push(['_trackEvent', 'setup', 'adjusted']);
        setupUrl.value = `https://${setupUrl.value}`;
      }
      _gaq.push(['_trackEvent', 'setup', 'submitted']);
      storage.saveSiteUrl(setupUrl.value).then(() => showSearch({ site: setupUrl.value }));
    }
  });
}

const showSearch = ({ site }) => {
  if (!site) {
    return;
  }
  setupDiv = setupDiv || document.getElementById('setup-container');
  searchDiv = searchDiv || document.getElementById('search-container');

  searchDiv.hidden = false;
  setupDiv.hidden = true;

  // update span with contents of site URL
  const searchUrl = document.getElementById('search-url');
  searchUrl.textContent = site.replace(new RegExp('^https?:\/\/'), '');

  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('query');
  searchInput.focus();
  searchForm.onsubmit = function (event) {
    event.preventDefault();
    _gaq.push(['_trackEvent', 'search', 'submitted']);

    const q = (document.getElementById('query') as HTMLInputElement).value;
    // const newTabUrl = `${site}/dosearchsite.action?queryString=${encodeURIComponent(q)}`;
    // chrome.tabs.create({ url: newTabUrl });
    // const searchUrl = `${site}/rest/quicknav/1/search?query=${encodeURIComponent(q)}`;
    const searchUrl = `${site}/rest/api/search?cql=siteSearch+~+${encodeURIComponent(`"${q}"`)}`;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerText = 'Searching...';
    const xhr = new XMLHttpRequest();
    xhr.open("GET", searchUrl, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resultsContainer.innerText = '';
        if (xhr.status !== 200) {
          _gaq.push(['_trackEvent', 'search', 'failed']);
          // probably not authenticated or URL is incorrect. Display error message:
          resultsContainer.appendChild(errorMessageElement({ siteLink: `${site}` }));
          return;
        }
        const resp = JSON.parse(xhr.responseText);
        // const pages = resp.contentNameMatches[0];
        const pages = resp.results;
        _gaq.push(['_trackEvent', 'searchresult', 'shown']);
        for (let result of pages) {
          resultsContainer.appendChild(createResultElement({
            name: result.content.title,
            space: result.resultGlobalContainer.title,
            resultLink: `${site}${result.url}`
          }));
        }
        if (!pages || pages.length === 0) {
          _gaq.push(['_trackEvent', 'searchresult', 'empty']);
          resultsContainer.innerHTML = '<em>No results</em>';
          return;
        }
      }
    }
    xhr.send();
  };
}

document.addEventListener('DOMContentLoaded', function () {
  _gaq.push(['_trackEvent', 'searchpopup', 'clicked']);
  storage.getSiteUrl().then(siteUrl => {
    const setupButton = document.getElementById('show-setup');
    setupButton.onclick = () => showSetup();
    showSearch({ site: siteUrl });
  }).catch(() => showSetup());
});
