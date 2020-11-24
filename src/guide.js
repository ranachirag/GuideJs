"use strict";

/**
 * Guide.js library.
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
        positionOfElements: "", 

    }

    this.elementHighlight = {
        element: null, // Element to highlight
        stepNumber: 1,
        addOutline: true, 
        borderWidth: "2px",
        borderLine: "solid",
        borderColor: "black",
        addOverlay: true,
        overlayRGB: "0, 0, 0",
        overlayOpacity: 0.5
    }

    this.guideBoxSettings = {
        customGuideBox: false,
        element: null,          // element to support 
        position: "fixed",   // "relative" to element or "fixed" on the screen
        locationX: "10",           // x location if fixed
        locationY: "100",           // y location if fixed
        
        margin: "5px",          // margin away from element if relative
        

    }


}

/* Prototype of GuideJs object. Use the given functions to create one instance of a walkthrough guide. */
GuideJs.prototype = {
    /* Start the guide */
    start: function() {

    },

    /* Stop the guide manually */
    stop: function() {

    },

    /*  */
    highlightElement: function(element) {
        this.elementHighlight.element = element
        highlightElement(this.elementHighlight) 
    },

    makeGuideBox: function(element) {
        this.guideBoxSettings.element = element
        makeGuideBox(this.guideBoxSettings)
    },

    setSettings: function() {

    }

}

/* Highlights an element with given settings */
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

        const body = document.querySelector("body")

        const divOverlay = document.createElement("div")
        divOverlay.classList.append("guide-overlay")

        divOverlay.style.boxShadow = `5px -5px 1px rgba(${overlayRGB}, ${overlayOpacity})`

        divOverlay.style.position = `fixed`

        body.appendChild(divOverlay)

        element.style.zIndex = "9"
        console.log(element)

    }
}

/* Makes a guide box that gives users context for steps */
function makeGuideBox(guideBoxSettings) {
    
    const {element} = guideBoxSettings 


    if (guideBoxSettings.customGuideBox){
        const guideBox = guideBoxSettings.element

    } else {
        const guideBox = document.querySelector(".guide-box")
        if (guideBoxSettings.position === "fixed") {
            
            const {position, locationX, locationY} = guideBoxSettings
            
            const viewportOffset = element.getBoundingClientRect();
            const top = viewportOffset.top;
            const left = viewportOffset.left;
            const width = element.offsetWidth

            guideBox.border

            guideBox.style.position = position
            guideBox.style.left = `${left + width + 10}px`
            guideBox.style.top = `${top}px` 
        

            console.log(guideBox.style.left)

        } 

    }
    
}

/* Add a progress bar to Guide Box */
function createProgressBar(steps, guideBox) {
    const progressBar = document.createElement("button")

    progressBar.classList.append("guide-progress-bar")


}

/* Add Next Button to Guide Box  */
function addNextButton(steps, guideBox) {
    const nextBtn = document.createElement("button")

    nextBtn.classList.append("guide-next-btn")

    nextBtn.onClick = onClickNext()

    guideBox.appendChild(nextBtn)
}

/* Add Previous Button to Guide Box */
function addPreviousButton(steps, guideBox) {
    const prevBtn = document.createElement("button")

    prevBtn.classList.append("guide-prev-btn")

    prevBtn.onClick = onClickNext()

    guideBox.appendChild(prevBtn)

}

/* Add Skip Button to Guide Box */
function addSkipButton(steps, guideBox) {
    const skipBtn = document.createElement("button")

    skipBtn.classList.append("guide-skip-btn")

    skipBtn.onClick = onClickSkip()

    guideBox.appendChild(skipBtn)

}


function onClickNext() {

}


function onClickPrevious() {

}

function onClickSkip() {

}
