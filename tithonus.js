console.log("tith start");

browser.runtime.onMessage.addListener(updateDecay);

function updateDecay(request, sender, sendResponse) {

	let decay_percent = isNaN(request.decay_rate)? 50 : (100 * request.decay_rate);

	let filter_val = "brightness(" + (100 + 3 * decay_percent) + "%) saturate(" + (100 - decay_percent) + "%) blur(" + (decay_percent/100) + "px)";

  	$('img').css("filter", filter_val);
  	$('.u-block').css("filter", filter_val);

  	
  	// $('img').css("filter", "opacity(" + 100 - decay_percent + "%) saturation(" + 100 - decay_percent + "%)");
  	// $('.u-block').css("filter", "opacity(" + 100 - decay_percent + "%) saturation(" + 100 - decay_percent + "%)");
}

// character deletions

// character insertions

// character zalgo


// capture when infinite scroll has loaded more tweets

