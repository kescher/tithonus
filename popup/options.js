function saveOptions(e) {
  browser.storage.local.set({
    decay_rate: document.getElementById("decay-slider").value
  });
  syncLabelWithSlider();
  e.preventDefault();
}

function restoreOptions() {
  var storageItem = browser.storage.local.get('decay_rate');
  return storageItem.then((res) => {
    console.log(res);
    if (res) {
      document.getElementById("decay-slider").value = res.decay_rate;
    }
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
