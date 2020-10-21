function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function decayUpdate() {
  getActiveTab().then((tabs) => { 
    var gettingDecay = browser.storage.local.get('decay_rate');
    gettingDecay.then((res) => {
      if (res && res.decay_rate) {
        browser.tabs.sendMessage(tabs[0].id, {decay_rate: res.decay_rate});
      } else {
        // no stored decay rate, use default
        return browser.storage.local.set({
            decay_rate: "0.7"
        }).then( () => {
            return getActiveTab().then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { decay_rate : "0.7" });
            });
        });
      }
    });
  }); 
}

// update when the tab is updated
browser.tabs.onUpdated.addListener(decayUpdate);
// update when the tab is activated
browser.tabs.onActivated.addListener(decayUpdate);
