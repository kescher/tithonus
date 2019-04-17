function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}


function decayUpdate() {
  getActiveTab().then((tabs) => { 
    var gettingDecay = browser.storage.local.get('decay_rate');
    gettingDecay.then((res) => {
      console.log(res);
      if (res && res.decay_rate) {
        browser.tabs.sendMessage(tabs[0].id, {decay_rate: res.decay_rate});
      } else {
        console.log("restore options, res returned but using default");

        return browser.storage.local.set({
            decay_rate: "0.9"
        }).then( () => {
            return getActiveTab().then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { decay_rate : "0.9" });
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
