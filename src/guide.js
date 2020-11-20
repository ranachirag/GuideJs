"use strict";

const { highlightElement } = require("./highlightElement");

/**
 * Guide.js library
 *
 * @class GuideJs
 */
function GuideJs() {
    this.settings = {
        timed: false,
        duration: 0,            // if guide is timed
        guideType: "",          // Options: manual, inline, automatic
        elementsToShow: [], 
        guideElement: true,     // element to guide the user
        positionOfElements: "", // the pos

    }
}

GuideJs.prototype = {
    /* Start the guide */
    start: function() {

    },

    /* Stop the guide manually */
    stop: function() {

    }

    // highlightElement: highlightElement({element:document.querySelector("#box"), addOutline:true})

}

