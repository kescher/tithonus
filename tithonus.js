console.log("tith start");

browser.runtime.onMessage.addListener(updateDecay);

function updateDecay(request, sender, sendResponse) {

	let decay = isNaN(request.decay_rate)? 5 : 10 * request.decay_rate;
  	let blur_rate = "blur(" + decay + "px)";
  	$('img').css("filter", "blur(" + decay + "px)");
  	$('.u-block').css("filter", "blur(" + decay + "px)");
}

// character deletions

// character insertions

// character zalgo


// capture when infinite scroll has loaded more tweets

