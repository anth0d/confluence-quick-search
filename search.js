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

    const showSetup = ({ site }) => {
      searchDiv.hidden = true;
      setupDiv.hidden = false;

      const setupForm = document.getElementById('setup-form');
      const url = document.getElementById('setup-url');
      if (site) { 
        url.value = site;
      }
      setupForm.onsubmit = function(event) {
        chrome.storage.sync.set('confluenceUrl', url);
        showSearch({ site: url });
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
        console.log('submitting');
        const q = document.getElementById('query').value;
        const newTabUrl = `https://${site}/wiki/dosearchsite.action?queryString=${encodeURIComponent(q)}`;
        // chrome.tabs.create({ url: newTabUrl });
        const searchUrl = `https://${site}/wiki/rest/quicknav/1/search?query=${encodeURIComponent(q)}`;
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerText = 'Searching...';
        const xhr = new XMLHttpRequest();
        xhr.open("GET", searchUrl, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            resultsContainer.innerText = '';
            const resp = JSON.parse(xhr.responseText);
            const pages = resp.contentNameMatches[0];
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
            for (let result of resp.contentNameMatches[0]) {
              const link = document.createElement('a');
              link.href = `https://${site}${result.href}`;
              link.textContent = `${result.name} [${result.spaceName}]`;
              link.target = `_blank`;
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