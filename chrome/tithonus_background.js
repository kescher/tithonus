var browser = chrome;

let tabs = [];

function decayUpdate() {

  browser.tabs.query({active: true, currentWindow: true}, (tabs_array) => {
    tabs = tabs_array;
    browser.storage.local.get(['decay_rate'], (res) => {
      if (res && res.decay_rate) {
        browser.tabs.sendMessage(tabs[0].id, {decay_rate: res.decay_rate});
      } else {
        // no stored decay rate, use default
        let default_rate = "0.9";
        browser.storage.local.set({ decay_rate: "0.9" }, () => {
              browser.tabs.sendMessage(tabs[0].id, { decay_rate : "0.9" });
        });
      }
    }); 
  });
}

// update when the tab is updated
browser.tabs.onUpdated.addListener(decayUpdate);
// update when the tab is activated
browser.tabs.onActivated.addListener(decayUpdate);
