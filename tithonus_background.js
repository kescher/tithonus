function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function decayUpdate() {
  getActiveTab().then((tabs) => { 
    var gettingDecay = browser.storage.local.get('decay_rate');
    gettingDecay.then((decay) => {
      if (decay) {
        browser.tabs.sendMessage(tabs[0].id, {decay_rate: decay});
      }
    });
  }); 
}

// update when the tab is updated
browser.tabs.onUpdated.addListener(decayUpdate);
// update when the tab is activated
browser.tabs.onActivated.addListener(decayUpdate);
