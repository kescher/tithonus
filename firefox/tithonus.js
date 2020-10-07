console.log("tithonus turns his eternal eye on yr feed");

browser.runtime.onMessage.addListener(updateDecay);

const MAX = 1.0;
const MIN = 0.0;
let alpha = 1;

let decay_rate = -1.0;

const intervals = {
    10 : 5,
    9: 10,
    8: 15,
    7: 20,
    6: 25,
    5: 30,
    4: 40,
    3: 50,
    2: 75,
    1: 100
}

// modified from Joel Kirchartz, JSFiddle http://jsfiddle.net/JKirchartz/wwckP/
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
    zalgo_char: function(a) {
        if(a == " ") return a;

        for(var i = 0, l = Z.random(10);
            i<l;i++){
                var rand = Z.random(3);
            a += Z.chars[rand][
                Z.random(Z.chars[rand].length)
                ];
         }
        return a;
    }
};

// modified from Olly Oechsle, http://www.ollysco.de/2012/04/gaussian-normal-functions-in-javascript.html
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

function imageBleachFunction(injections, dr) {

    // brightness

    let drdiff = 1 - dr;
    let base = 3 - (2 * drdiff);
    let diff = (0.3 * Math.pow(base, (injections - drdiff * 50)));
    let add = diff < 400 ? diff : 400;

    return 100 + add;
}

function imageFadeFunction(injections,dr) {

    // saturation
    let drdiff = 1 - dr;
    let base = 3 - (2 * drdiff);
    let diff = (0.1 * Math.pow(base, (injections - drdiff * 50)));
    let sub = diff < 100 ? diff : 100;

    return 100-sub;
}

function imageBlurFunction(injections, dr) {
    let drdiff = 1 - dr;
    let base = 3 - (2 * drdiff);
    let retval = (0.1 * Math.pow(base, (injections - drdiff * 50)));
    return retval < 10 ? retval : 10;
}

function imageDecay(dr) {

    // disqualify strange decay rates
    if (isNaN(dr) || dr < 0.05) {
        return;
    }

    // count loads of new tweets
    let injections = $("article[injections]");
    let injection_num = 0;
    if (injections.length > 0) {
        injection_num = parseInt(injections[0].getAttribute("injections"));
    }

    // don't decay on first load
    if (injection_num == 0) {
        return;
    }

    let blur_rate = imageBlurFunction(injection_num, dr);
    let bleach_rate = imageBleachFunction(injection_num,dr);
    let fade_rate = imageFadeFunction(injection_num, dr);

    let filter_val = "brightness(" + String(bleach_rate) + "%) saturate(" + String(fade_rate) + "%) blur(" + String(blur_rate) + "px)";

    $('img').css("filter", filter_val);
    $('.u-block').css("filter", filter_val);
    $('.AdaptiveMedia-container').css("filter", filter_val);
    $('.TwitterCard').css("filter", filter_val);
    $('iframe').css("filter", filter_val);
}

function zalgo_rate(dr, injections) {

    let retval = (1 / 100) * Math.pow(injections / intervals[parseInt(10 * dr)], 3);
    return retval < 10 ? retval : 10;
}

function blank_rate(dr, injections) {

    let interval = intervals[parseInt(10 * dr)];
    let retval = (1 / 100) * Math.pow((injections - 0.6 * interval) / interval, 3);
    return retval < 10 ? retval : 10;
}

function recurseChildrenDecay(node, dr, injections) {

    if (!node || !node.childNodes) {
        return;
    }

    let rate = dr * .01 * injections
    
    for (var i = 0; i < node.childNodes.length; ++i) {
        
        if (node.childNodes[i].childNodes.length == 0) {

            // this is a text node
            if (node.childNodes[i].nodeValue) {

                var nodetext = (node.childNodes[i].nodeValue).toString();
                
                // TODO Change calculation so each character is whited out/zalgo'd w some percentage
                // this would be good optimization
                // possible intenfier: come up with way to set zalgo intensity (# of added marks) by dr

                // number of character to decay for this text
                let rg = Math.randomGaussian(zalgo_rate(dr, injections), 0.0001);
                let rg_abs = Math.abs(parseFloat(rg));
                let text_length = nodetext.length;
                
                let decay_chars = Math.floor(text_length * rg_abs);
                
                // number of character to white out for this text
                rg = Math.randomGaussian(blank_rate(dr, injections), 0.0001);
                rg_abs = Math.abs(parseFloat(rg));

                let blank_chars = Math.floor(text_length * rg_abs);

                for (var k = 0; k < blank_chars; ++k) {
                    let target_idx = Math.floor(Math.random() * nodetext.length);
                    let code = nodetext.charCodeAt(target_idx); 
                    if (code > 33 && code < 126) { // a-z & A-Z & 0-9 & common punctuation
                      nodetext = nodetext.slice(0, target_idx) + " " + nodetext.slice(target_idx + 1, nodetext.length);
                    }
                }

                for (var k = 0; k < decay_chars; ++k) {
                    let target_idx = Math.floor(Math.random() * nodetext.length);
                    let code = nodetext.charCodeAt(target_idx); 
                    if ((code > 47 && code < 58) || // numeric (0-9)
                        (code > 64 && code < 91) || // upper alpha (A-Z)
                        (code > 96 && code < 123)) { // lower alpha (a-z)
                      nodetext = nodetext.slice(0, target_idx) + Z.zalgo_char(nodetext.charAt(target_idx)) + nodetext.slice(target_idx + 1, nodetext.length);
                    }
                }

                node.childNodes[i].nodeValue = nodetext;
            }
        } else {
            recurseChildrenDecay(node.childNodes[i], dr, injections);
        }
    }
}

// function textDecay_update(dr) {

//     if (dr < 0.05) {
//         return;
//     }

//     var tweets = $("article").toArray();

//     var decayed_count = $(".decayed").length;

//     // first load of tweets
//     if (decayed_count == 0) {
//         $("article").addClass("decayed");
//         $("article").attr("injections", "0");
//         return;
//     }

//     // there are new tweets to suffer the pull of eternity
//     if (tweets.length != 0 && decayed_count < tweets.length) {

//         let injections = $("article[injections]");
//         let injection_num = 0;
//         if (injections.length > 0) {
            
//             injection_num = parseInt(injections[0].getAttribute("injections"));
//         }

//         for (var i = 0; i < tweets.length; ++i) {
//             if (!tweets[i].classList.contains('decayed')) {
//                 recurseChildrenDecay(tweets[i], dr, injection_num);
//             }

//             tweets[i].classList.add('decayed');
//         }

//         // this prevents additional decay when clicking on a tweet
//         if ($("#permalink-overlay").css("display") == "none") {
//             $("article").attr("injections", String(injection_num + 1));
//         }
//     }
// }

function textDecay(dr) {

    // TODO: don't increase injection on mouseover of article
    // possible fix: attach edits + class to parent/child node of article, which appears to not change on mouseover
    // possible fix: find unique identifier for tweets

    if (dr < 0.05) {
        return;
    }

    var articles = $("article").toArray();
    // console.log(articles);
    var tweets = articles.map( x => { return x.parentElement; });
    console.log("tweets:");
    console.log(tweets);

    // no tweets loaded yet
    if (tweets.length < 1) {
        return;
    }

    let injection_num = 0;

    let injections = $("#react-root").attr("injections");

    // For some browsers, `attr` is undefined; for others, `attr` is false. Check for both.
    if (typeof injections !== typeof undefined && injections !== false) {
        console.log("has injections");
        injection_num = parseInt(injections);
    } else {
        console.log("doesnt");
        $("#react-root").attr("injections", "0");
        for (var i = 0; i < tweets.length; ++i) {
            tweets[i].classList.add('decayed');
        }
        return;
    }

    console.log("predecay:");
    to_decay = tweets.filter((x) => {
        console.log(x);
        return !(x.classList.contains("decayed"));
    });
    console.log("to decay:");
    console.log(to_decay);

    // // there are new tweets to suffer the pull of eternity
    if (to_decay.length > 0) {

        for (var i = 0; i < to_decay.length; ++i) {
            console.log("before: ");
            console.log(to_decay[i]);
            recurseChildrenDecay(to_decay[i], dr, injection_num);
            to_decay[i].classList.add('decayed');
            console.log("after: ");
            console.log(to_decay[i]);
            injection_num++;
        }

        $("#react-root").attr("injections", String(injection_num));

    }
}

function decayImageAndText() {
    let dr = decay_rate;

    // TODO: imagedecay

    // imageDecay(dr);
    textDecay(dr);
}

// receive message about new decay
function updateDecay(request, sender, sendResponse) {
    decay_rate = parseFloat(request.decay_rate);
    decayImageAndText();
}

// capture when more stuff loads
var target = document.querySelector('body');
var observer = new MutationObserver(function(mutations) {
    decayImageAndText();
});
var config = { attributes: true, childList: true, subtree: true, characterData: true }
observer.observe(target, config);