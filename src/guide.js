"use strict";

/**
 * Guide.js library
 *
 * @class GuideJs
 */
function GuideJs() {
    this.settings = {
        timed: false,
        duration: 0,            // if guide is timed, the duration of walkthrough
        guideType: "",          // Options: manual, inline, automatic
        elementsToShow: [], 
        guideElement: true,     // element to guide the user
        positionOfElements: "", // the pos

    }

    this.elementHighlight = {
        element: null, // Element to highlight
        addOutline: true, 
        borderWidth: "5px",
        borderLine: "solid",
        borderColor: "black",
        addOverlay: true,
        overlayRGB: "0, 0, 120",
        overlayOpacity: 0.2
    }

    this.guideBoxSettings = {
        element: null,          // element to support 
        position: "relative",    //"relative" to element or "fixed" on the screen
        locationX: 0,
        locationY: 0,
        
    }


}

GuideJs.prototype = {
    /* Start the guide */
    start: function() {

    },

    /* Stop the guide manually */
    stop: function() {

    },

    highlightElement: function(element) {
        this.elementHighlight.element = element
        highlightElement(this.elementHighlight) 
    },

    makeGuideBox: function() {

    }

}

function highlightElement(highlightSettings) {

    const element = highlightSettings.element

    // Adding outline to the given element in accordance to the given settings
    if (highlightSettings.addOutline) {
        const {borderWidth, borderLine, borderColor} = highlightSettings
        element.style.border = `${borderWidth} ${borderLine} ${borderColor}`
    }

    // Adding overlay to the page in accordance to the given settings
    if(highlightSettings.addOverlay) {
        const {overlayOpacity, overlayRGB} = highlightSettings
        element.style.boxShadow = `0 0 0 100vmax rgba(${overlayRGB}, ${overlayOpacity})`
        element.style.pointerEvents = "none"
    }
}

function makeGuideBox(guideBoxSettings) {
    const element = guideBoxSettings.element



}

