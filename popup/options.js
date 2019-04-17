function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function saveOptions(e) {
  browser.storage.local.set({
    decay_rate: document.getElementById("decay-slider").value
  });
  syncLabelWithSlider();
  e.preventDefault();
  return getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { decay_rate : document.getElementById("decay-slider").value });
  });
}

function restoreOptions() {
  var storageItem = browser.storage.local.get('decay_rate');
  return storageItem.then((res) => {
    console.log(res);
    if (res && res.decay_rate) {
      document.getElementById("decay-slider").value = res.decay_rate;
      return getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { decay_rate : document.getElementById("decay-slider").value });
      });
    } else {
      console.log("default");
      document.getElementById("decay-slider").value = "0.9";
      browser.storage.local.set({
        decay_rate: document.getElementById("decay-slider").value
      });
      return getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { decay_rate : document.getElementById("decay-slider").value });
    });
    }
  }).
  catch(() => {
    document.getElementById("decay-slider").value = "0.9";
    browser.storage.local.set({
        decay_rate: document.getElementById("decay-slider").value
      });
    return getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { decay_rate : document.getElementById("decay-slider").value });
    });
  });
}

function syncLabelWithSlider() {
    document.getElementById("decay-rate").innerHTML = document.getElementById("decay-slider").value;
}

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions().then(() => {
    syncLabelWithSlider();
  });

  var slider = document.getElementById("decay-slider");
  slider.addEventListener("input", saveOptions);
  
});
