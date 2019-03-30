function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function decayUpdate() {
  getActiveTab().then((tabs) => { 
    var gettingDecay = browser.storage.local.get('decay_rate');
    gettingDecay.then((res) => {
      if (res) {
        browser.tabs.sendMessage(tabs[0].id, {decay_rate: res.decay_rate});
      }
    });
  }); 
}

// update when the tab is updated
browser.tabs.onUpdated.addListener(decayUpdate);
// update when the tab is activated
browser.tabs.onActivated.addListener(decayUpdate);
