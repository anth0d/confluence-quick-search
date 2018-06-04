// (function(){

  function saveButtonClicked() {
    const confluenceUrl = document.getElementById('url').value;
  
    chrome.storage.sync.set({
      confluenceUrl: confluenceUrl
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('save');
      status.textContent = 'Saved.';
      setTimeout(function() {
        status.textContent = 'Save';
      }, 1000);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const setupDiv = document.getElementById('setup-container');
    const searchDiv = document.getElementById('search-container');
    const setupButton = document.getElementById('show-setup');

    // TODO - get user to add key command: chrome://extensions/shortcuts
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
        const confluenceUrl = setupUrl.value;
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
        const searchUrl = `https://${site}/wiki/rest/quicknav/1/search?query=${encodeURIComponent(q)}`;
        // const searchUrl = `https://${site}/wiki/rest/api/search?cql=siteSearch+~+${encodeURIComponent(`"${q}"`)}`;
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerText = 'Searching...';
        const xhr = new XMLHttpRequest();
        xhr.open("GET", searchUrl, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            resultsContainer.innerText = '';
            const resp = JSON.parse(xhr.responseText);
            const pages = resp.contentNameMatches[0];
            // const pages = resp.results;
            // 0 - Pages [name, spaceName, href]
            /** example page
             * className: "content-type-page"
             * href: "/wiki/spaces/~justin.hinerman/pages/28673038/Testing"
             * id: "28673038"
             * name: "Testing"
             * spaceKey: "~justin.hinerman"
             * spaceName: "Justin Hinerman"
             */
            // 1 - Add-ons []
            // 2 - Attachments []
            // 3 - People []
            // 4 - Spaces []
            // 5 - Link to search more [{name, href}]
            for (let result of pages) {
              const link = document.createElement('a');
              link.className = `search-result`;
              link.href = `https://${site}${result.href}`;
              link.target = `_blank`;
              const resultName = document.createElement('span');
              resultName.className = `search-result-name`;
              resultName.textContent = `${result.name}`;
              link.appendChild(resultName);
              const resultSpace = document.createElement('span');
              resultSpace.className = `search-result-space`;
              resultSpace.textContent = `${result.spaceName || ''}`;
              link.appendChild(resultSpace);
              const para = document.createElement('p');
              para.appendChild(link);
              resultsContainer.appendChild(para);
            }
            if (!resp) {
              resultsContainer.innerText = 'No search results';
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
// })();