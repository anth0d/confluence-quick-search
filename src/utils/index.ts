
export const chromeEventPromise = (chromeEvent: chrome.events.Event<any>): Promise<any> => {
  return new Promise(resolve => {
    // problem: this should fire multiple times
    chromeEvent.addListener(resolve)
  });
};
