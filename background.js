chrome.runtime.onInstalled.addListener(function() {
  chrome.omnibox.onInputEntered.addListener(function(text) {
    // Encode user input for special characters , / ? : @ & = + $ #
    var newURL = 'https://auth0team.atlassian.net/wiki/dosearchsite.action?queryString=' + encodeURIComponent(text);
    chrome.tabs.create({ url: newURL });
  });

  chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event:', command);
  });  
});

