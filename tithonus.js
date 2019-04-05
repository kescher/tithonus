console.log("tith start");

browser.runtime.onMessage.addListener(updateDecay);

const MAX = 1.0;
const MIN = 0.0;
let alpha = 1;

let decay_rate = 0.0;

// Joel Kirchartz, JSFiddle http://jsfiddle.net/JKirchartz/wwckP/
var Z = {
    chars: {
        0 : [ /* up */
    '\u030d', /*     ̍     */
    '\u030e', /*     ̎     */
    '\u0304', /*     ̄     */
    '\u0305', /*     ̅     */
    '\u033f', /*     ̿     */
    '\u0311', /*     ̑     */
    '\u0306', /*     ̆     */
    '\u0310', /*     ̐     */
    '\u0352', /*     ͒     */
    '\u0357', /*     ͗     */
    '\u0351', /*     ͑     */
    '\u0307', /*     ̇     */
    '\u0308', /*     ̈     */
    '\u030a', /*     ̊     */
    '\u0342', /*     ͂     */
    '\u0343', /*     ̓     */
    '\u0344', /*     ̈́     */
    '\u034a', /*     ͊     */
    '\u034b', /*     ͋     */
    '\u034c', /*     ͌     */
    '\u0303', /*     ̃     */
    '\u0302', /*     ̂     */
    '\u030c', /*     ̌     */
    '\u0350', /*     ͐     */
    '\u0300', /*     ̀     */
    '\u0301', /*     ́     */
    '\u030b', /*     ̋     */
    '\u030f', /*     ̏     */
    '\u0312', /*     ̒     */
    '\u0313', /*     ̓     */
    '\u0314', /*     ̔     */
    '\u033d', /*     ̽     */
    '\u0309', /*     ̉     */
    '\u0363', /*     ͣ     */
    '\u0364', /*     ͤ     */
    '\u0365', /*     ͥ     */
    '\u0366', /*     ͦ     */
    '\u0367', /*     ͧ     */
    '\u0368', /*     ͨ     */
    '\u0369', /*     ͩ     */
    '\u036a', /*     ͪ     */
    '\u036b', /*     ͫ     */
    '\u036c', /*     ͬ     */
    '\u036d', /*     ͭ     */
    '\u036e', /*     ͮ     */
    '\u036f', /*     ͯ     */
    '\u033e', /*     ̾     */
    '\u035b', /*     ͛     */
    '\u0346', /*     ͆     */
    '\u031a'  /*     ̚     */
    ],
    1 : [ /* down */
    '\u0316', /*     ̖     */
    '\u0317', /*     ̗     */
    '\u0318', /*     ̘     */
    '\u0319', /*     ̙     */
    '\u031c', /*     ̜     */
    '\u031d', /*     ̝     */
    '\u031e', /*     ̞     */
    '\u031f', /*     ̟     */
    '\u0320', /*     ̠     */
    '\u0324', /*     ̤     */
    '\u0325', /*     ̥     */
    '\u0326', /*     ̦     */
    '\u0329', /*     ̩     */
    '\u032a', /*     ̪     */
    '\u032b', /*     ̫     */
    '\u032c', /*     ̬     */
    '\u032d', /*     ̭     */
    '\u032e', /*     ̮     */
    '\u032f', /*     ̯     */
    '\u0330', /*     ̰     */
    '\u0331', /*     ̱     */
    '\u0332', /*     ̲     */
    '\u0333', /*     ̳     */
    '\u0339', /*     ̹     */
    '\u033a', /*     ̺     */
    '\u033b', /*     ̻     */
    '\u033c', /*     ̼     */
    '\u0345', /*     ͅ     */
    '\u0347', /*     ͇     */
    '\u0348', /*     ͈     */
    '\u0349', /*     ͉     */
    '\u034d', /*     ͍     */
    '\u034e', /*     ͎     */
    '\u0353', /*     ͓     */
    '\u0354', /*     ͔     */
    '\u0355', /*     ͕     */
    '\u0356', /*     ͖     */
    '\u0359', /*     ͙     */
    '\u035a', /*     ͚     */
    '\u0323'  /*     ̣     */
        ],
    2 : [ /* mid */
    '\u0315', /*     ̕     */
    '\u031b', /*     ̛     */
    '\u0340', /*     ̀     */
    '\u0341', /*     ́     */
    '\u0358', /*     ͘     */
    '\u0321', /*     ̡     */
    '\u0322', /*     ̢     */
    '\u0327', /*     ̧     */
    '\u0328', /*     ̨     */
    '\u0334', /*     ̴     */
    '\u0335', /*     ̵     */
    '\u0336', /*     ̶     */
    '\u034f', /*     ͏     */
    '\u035c', /*     ͜     */
    '\u035d', /*     ͝     */
    '\u035e', /*     ͞     */
    '\u035f', /*     ͟     */
    '\u0360', /*     ͠     */
    '\u0362', /*     ͢     */
    '\u0338', /*     ̸     */
    '\u0337', /*     ̷      */
    '\u0361', /*     ͡     */
    '\u0489' /*     ҉_     */
    ]

    },
    random: function(len) {
        if (len == 1) return 0;
        return !!len ? Math.floor(Math.random() * len + 1) - 1 : Math.random();
    },
    generate: function(str) {
        var str_arr = str.split(''),
            output = str_arr.map(function(a) {
                if(a == " ") return a;
                for(var i = 0, l = Z.random(16);
                    i<l;i++){
                        var rand = Z.random(3);
                    a += Z.chars[rand][
                        Z.random(Z.chars[rand].length)
                        ];
                 }
                return a;
            });
        return output.join('');
    },
    zalgo_char: function(a) {
    	if(a == " ") return a;

        for(var i = 0, l = Z.random(16);
            i<l;i++){
                var rand = Z.random(3);
            a += Z.chars[rand][
                Z.random(Z.chars[rand].length)
                ];
         }
        return a;
    }
};

// randomGaussian taken from http://www.ollysco.de/2012/04/gaussian-normal-functions-in-javascript.html
(function() {

    /**
     * Returns a Gaussian Random Number around a normal distribution defined by the mean
     * and standard deviation parameters.
     *
     * Uses the algorithm used in Java's random class, which in turn comes from
     * Donald Knuth's implementation of the BoxÐMuller transform.
     *
     * @param {Number} [mean = 0.0] The mean value, default 0.0
     * @param {Number} [standardDeviation = 1.0] The standard deviation, default 1.0
     * @return {Number} A random number
     */
    Math.randomGaussian = function(mean, standardDeviation) {

        mean = defaultTo(mean, 0.0);
        standardDeviation = defaultTo(standardDeviation, 1.0);

        if (Math.randomGaussian.nextGaussian !== undefined) {
            var nextGaussian = Math.randomGaussian.nextGaussian;
            delete Math.randomGaussian.nextGaussian;
            return parseFloat(nextGaussian * standardDeviation) + parseFloat(mean);
        } else {
            var v1, v2, s, multiplier;
            do {
                v1 = 2 * Math.random() - 1; // between -1 and 1
                v2 = 2 * Math.random() - 1; // between -1 and 1
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s == 0);
            multiplier = Math.sqrt(-2 * Math.log(s) / s);
            Math.randomGaussian.nextGaussian = v2 * multiplier;
            return parseFloat(v1 * multiplier * standardDeviation) + parseFloat(mean);
        }

    };

    /**
     * Returns a normal probability density function for the given parameters.
     * The function will return the probability for given values of X
     *
     * @param {Number} [mean = 0] The center of the peak, usually at X = 0
     * @param {Number} [standardDeviation = 1.0] The width / standard deviation of the peak
     * @param {Number} [maxHeight = 1.0] The maximum height of the peak, usually 1
     * @returns {Function} A function that will return the value of the distribution at given values of X
     */
    Math.getGaussianFunction = function(mean, standardDeviation, maxHeight) {

        mean = defaultTo(mean, 0.0);
        standardDeviation = defaultTo(standardDeviation, 1.0);
        maxHeight = defaultTo(maxHeight, 1.0);

        return function getNormal(x) {
            return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
        }
    };

    function defaultTo(value, defaultValue) {
        return isNaN(value) ? defaultValue : value;
    }

})();

function imageDecay() {
	
	let decay_percent = isNaN(decay_rate)? 50 : (100 * decay_rate);

	let filter_val = "brightness(" + (100 + 3 * decay_percent) + "%) saturate(" + (100 - decay_percent) + "%) blur(" + (decay_rate * 10) + "px)";

  	$('img').css("filter", filter_val);
  	$('.u-block').css("filter", filter_val);
}

function s_curve(x) {
	return (x)
}

function recurseChildrenDecay(node, decay_rate) {

	if (!node || !node.childNodes) {
		return;
	}

	// console.log("processing node");
	// console.log(node);

	// CONSIDER
	// for higher hit rate, looping through each char in tweet

	
	for (var i = 0; i < node.childNodes.length; ++i) {
		
		if (node.childNodes[i].childNodes.length == 0) {

			// this is a text node
			if (node.childNodes[i].nodeValue) {

				var nodetext = (node.childNodes[i].nodeValue).toString();
				
				// number of character to decay for this text
				let rg = Math.randomGaussian(decay_rate, 0.05);
				let rg_abs = Math.abs(parseFloat(rg));
				let text_length = nodetext.length;
				let decay_chars = Math.floor(text_length * rg_abs);
				
				for (var k = 0; k < decay_chars; ++k) {
					let target_idx = Math.floor(Math.random() * nodetext.length);
					let code = nodetext.charCodeAt(target_idx); 
					if ((code > 47 && code < 58) || // numeric (0-9)
				        (code > 64 && code < 91) || // upper alpha (A-Z)
				        (code > 96 && code < 123)) { // lower alpha (a-z)
				      nodetext = nodetext.slice(0, target_idx) + Z.zalgo_char(nodetext.charAt(target_idx)) + nodetext.slice(target_idx + 1, nodetext.length);
				    }
				}

				rg = Math.randomGaussian(decay_rate, 0.05);
				rg_abs = Math.abs(parseFloat(rg));
				let blank_chars = Math.floor(text_length * rg_abs);

				for (var k = 0; k < blank_chars; ++k) {
					let target_idx = Math.floor(Math.random() * nodetext.length);
					let code = nodetext.charCodeAt(target_idx); 
					if ((code > 47 && code < 58) || // numeric (0-9)
				        (code > 64 && code < 91) || // upper alpha (A-Z)
				        (code > 96 && code < 123)) { // lower alpha (a-z)
				      nodetext = nodetext.slice(0, target_idx) + " " + nodetext.slice(target_idx + 1, nodetext.length);
				    }
				}

				node.childNodes[i].nodeValue = nodetext;
			}
		} else {
			recurseChildrenDecay(node.childNodes[i], decay_rate);
		}
	}
}

function textDecay() {

	// var tweets = $(".tweet-text").toArray();
	var tweets = $(".tweet").toArray();

	if (tweets.length != 0) {
		for (var i = 0; i < tweets.length; ++i) {

			// console.log(tweets[i]);
			if (!tweets[i].classList.contains('decayed')) {
				recurseChildrenDecay(tweets[i], decay_rate);
			}

			tweets[i].classList.add('decayed');
		}
	}
}

function updateDecay(request, sender, sendResponse) {
	decay_rate = request.decay_rate;
  	imageDecay();
  	textDecay();

  	var feet = document.getElementsByClassName("stream-footer");

  	for (var i = 0; i < feet.length; ++i) {
  		feet[i].addEventListener("reposition", function(){
			console.log("more tweets!!");
			imageDecay();
		  	textDecay();
		});
  	}
  	

}

// character deletions

// character insertions

// character zalgo


// capture when infinite scroll has loaded more tweets