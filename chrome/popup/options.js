var browser = chrome;

function saveOptions(e) {
  let dr = document.getElementById("decay-slider").value;
  browser.storage.local.set({ decay_rate: dr }, () => {
    syncLabelWithSlider();
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { decay_rate : dr });
    });
  });
  e.preventDefault();
}

function restoreOptions() {
  browser.storage.local.get(['decay_rate'], (res) => {
    console.log(res);
    if (res && res.decay_rate) {
      document.getElementById("decay-slider").value = res.decay_rate;
      browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { decay_rate : document.getElementById("decay-slider").value });
      });
      syncLabelWithSlider();
    }
  });
}

function syncLabelWithSlider() {
    document.getElementById("decay-rate").innerHTML = document.getElementById("decay-slider").value;
}

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();

  var slider = document.getElementById("decay-slider");
  slider.addEventListener("input", saveOptions);
  
});
