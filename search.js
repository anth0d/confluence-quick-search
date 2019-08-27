const createResultElement = ({ site, href, name, space }) => {
  const a = document.createElement('a');
  a.className = `search-result`;
  a.href = `https://${site}${href}`;
  a.title = a.href;
  a.target = `_blank`;
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

const errorMessageElement = ({ site }) => {
  const pText = document.createElement('p');
  const errorMessage = document.createElement('span');
  errorMessage.textContent = `Error! Visit your site and log in:`;
  pText.appendChild(errorMessage);

  const pLink = document.createElement('p');
  const preUrl = document.createElement('pre');
  const a = document.createElement('a');
  a.href = `https://${site}`;
  a.title = a.href;
  a.target = `_blank`;
  preUrl.textContent = `https://${site}`;
  a.appendChild(preUrl);
  pLink.appendChild(a);

  const div = document.createElement('div');
  div.className = `search-result-name`;
  div.appendChild(pText);
  div.appendChild(pLink);
  return div;
};

document.addEventListener('DOMContentLoaded', function() {
  const setupDiv = document.getElementById('setup-container');
  const searchDiv = document.getElementById('search-container');
  const setupButton = document.getElementById('show-setup');

  const showSetup = ({ site }) => {
    searchDiv.hidden = true;
    setupDiv.hidden = false;

    const setupForm = document.getElementById('setup-form');
    const setupUrl = document.getElementById('setup-url');
    if (site) { 
      setupUrl.value = site;
    }
    setupUrl.focus();
    setupForm.onsubmit = function(event) {
      event.preventDefault();
      const confluenceUrl = setupUrl.value
        .replace(new RegExp('^https?:\/\/'), '')
        .replace(new RegExp('\/wiki.*$'), '');
      setupUrl.value = confluenceUrl;
      chrome.storage.sync.set({ confluenceUrl }, () => showSearch({ site: confluenceUrl }));
    }
  }

  const showSearch = ({ site }) => {
    if (!site) {
      return;
    }
    searchDiv.hidden = false;
    setupDiv.hidden = true;

    // update span with contents of site URL
    const searchUrl = document.getElementById('search-url');
    searchUrl.textContent = site;

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('query');
    searchInput.focus();
    searchForm.onsubmit = function(event) {
      event.preventDefault();

      const q = document.getElementById('query').value;
      const newTabUrl = `https://${site}/wiki/dosearchsite.action?queryString=${encodeURIComponent(q)}`;
      // chrome.tabs.create({ url: newTabUrl });
      // const searchUrl = `https://${site}/wiki/rest/quicknav/1/search?query=${encodeURIComponent(q)}`;
      const searchUrl = `https://${site}/wiki/rest/api/search?cql=siteSearch+~+${encodeURIComponent(`"${q}"`)}`;
      const resultsContainer = document.getElementById('results-container');
      resultsContainer.innerText = 'Searching...';
      const xhr = new XMLHttpRequest();
      xhr.open("GET", searchUrl, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resultsContainer.innerText = '';
          if (xhr.status !== 200) {
            // probably not authenticated or URL is incorrect. Display error message:
            resultsContainer.appendChild(errorMessageElement({ site: `${site}/wiki` }));
            return;
          }
          const resp = JSON.parse(xhr.responseText);
          // const pages = resp.contentNameMatches[0];
          const pages = resp.results;
          for (let result of pages) {
            resultsContainer.appendChild(createResultElement({
              site: `${site}/wiki`,
              name: result.content.title,
              space: result.resultGlobalContainer.title,
              href: result.url
            }));
          }
          if (!pages || pages.length === 0) {
            resultsContainer.innerHTML = '<em>No results</em>';
            return;
          }
        }
      }
      xhr.send();
    };
  }

  chrome.storage.sync.get('confluenceUrl', function(data) {
    console.log('data.confluenceUrl', data.confluenceUrl);
    if (!data.confluenceUrl) {
      showSetup({ site: null });
    } else {
      showSearch({ site: data.confluenceUrl });
      setupButton.onclick = () => showSetup({ site: data.confluenceUrl });
    }

  });
});
