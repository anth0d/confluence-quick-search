# Confluence Search Chrome extension

Super fast search of your team's Confluence pages, by key command or by omnibox (that's what Google calls the address bar in Chrome)

#TL;DR I want it

## Install it via [Chrome Web Store](https://chrome.google.com/webstore/detail/confluence-quick-search/gimcmmlpmjffkpbomagapjhdfbbeldfk)

# Example


![popup example](images/demo-1.png)
*Click the Confluence icon, or use a hotkey to start a quick search*


![omnibox example](images/demo-2.png)
*Type `con ` and press space in a new tab to use the search shortcut.*


# First time install

Click [this link](https://chrome.google.com/webstore/detail/confluence-quick-search/gimcmmlpmjffkpbomagapjhdfbbeldfk) and add to Chrome. After install you should set a keyboard shortcut. I use Command+Shift+L.

Once you click the icon in Chrome, or activate the keyboard shortcut, you should specify your Confluence URL.

```

    https://your-confluence-url.atlassian.net/wiki
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

```

It is not neccesary to include `https://` or `/wiki` in your URL.


# I want to hack on it

```bash
git clone https://github.com/anth0d/chrome-confluence-search.git
open chrome://extensions
# click "LOAD UNPACKED"
# select the location you cloned into
```
