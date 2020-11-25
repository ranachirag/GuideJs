"use strict";

/**
 * Guide.js library.
 *
 * @class GuideJs
 */
function GuideJs(timed=false, duration=0, guideType="", numElements, elementDescriptions) {
    this.timed = timed
    this.duration = duration
    this.guideType = guideType
    this.numElements = 9
    this.elementDescriptions = ["add1", "add2", "add3"]

    this.currentStep = 1
    this.guideBox = null

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
        elementDescription: "",
        stepNumber: "",
        description: "",
        locationDirection: "side-right-top",
        dist: 20,               // margin away from element

    }

}

/* Prototype of GuideJs object. Use the given functions to create one instance of a walkthrough guide. */
GuideJs.prototype = {
    /* Start the guide */

    start: function() {
        initializeGuideJsElements()
        if (this.numElements > 0) {
            const element = getElementByStepNumber(this.currentStep)
            const elementDescription = this.elementDescriptions[this.currentStep-1]
            this.makeGuideBox(element, elementDescription)
            
        }
        
    },

    /* Stop the guide manually */
    stop: function() {
        document.querySelector(`.guidejs-elements`).remove()
    },

    /*  */
    highlightElement: function(element ) {
        this.elementHighlight.element = element
        highlightElement(this.elementHighlight) 
    },

    makeGuideBox: function(element, elementDescription) {
        
        this.guideBoxSettings.element = element
        this.guideBox = makeGuideBox(this.guideBoxSettings)
        setElementDescription(elementDescription)

        const nextBtn = addNextButton(this.guideBox)
        nextBtn.addEventListener("click", () => {
            this.currentStep += 1
            const element = getElementByStepNumber(this.currentStep)
            const elementDescription = this.elementDescriptions[this.currentStep-1]
            setGuideBoxPosition(this.guideBox, element, 10)
            setElementDescription(elementDescription)
        })
            
        const prevBtn = addPreviousButton(this.guideBox)
        prevBtn.addEventListener("click", () => {
            this.currentStep -= 1
            const element = getElementByStepNumber(this.currentStep)
            const elementDescription = this.elementDescriptions[this.currentStep-1]
            setGuideBoxPosition(this.guideBox, element, 10)
            setElementDescription(elementDescription)
        })

        const skipBtn = addSkipButton(this.guideBox)
        skipBtn.addEventListener("click", this.stop)
        
    }

}

function getElementByStepNumber(stepNumber) {
    return document.querySelector(`.guidejs-step-${stepNumber}`)
}

function initializeGuideJsElements() {
    const guidejsDiv = document.createElement("div")
    guidejsDiv.classList.add("guidejs-elements")

    const body = document.querySelector("body")
    body.appendChild(guidejsDiv)
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

        const divOverlay = document.createElement("div")
        divOverlay.classList.add("guide-overlay")

        const guidejsDiv = document.querySelector(".guidejs-elements")
        guidejsDiv.appendChild(divOverlay)

        divOverlay.style.boxShadow = `5px -5px 1px rgba(${overlayRGB}, ${overlayOpacity})`

        divOverlay.style.position = `fixed`

        element.style.zIndex = "9"
        console.log(element)

    }
}

/* Makes a guide box that gives users context for steps */
function makeGuideBox(guideBoxSettings) {
    
    const guideBox = document.createElement("div")
    guideBox.classList.add("guide-box")

    const guidejsDiv = document.querySelector(".guidejs-elements")
    guidejsDiv.appendChild(guideBox)

    const descriptionDiv = document.createElement("div")
    descriptionDiv.classList.add("guide-box-description")
    guideBox.appendChild(descriptionDiv)

    const {element} = guideBoxSettings 
    const {locationDirection, dist} = guideBoxSettings
    
    setGuideBoxPosition(guideBox, element, dist)
    

    return guideBox
}


function setGuideBoxPosition(guideBox, element, dist) {
    
    const viewportOffset = element.getBoundingClientRect();
    const top = viewportOffset.top;
    const left = viewportOffset.left;
    const width = element.offsetWidth
    const height = element.offsetHeight
    const guideBoxWidth = guideBox.offsetWidth
    const guideBoxHeight = guideBox.offsetHeight

    guideBox.style.position = "fixed"

    const locationDirection = element.classList[2]



    if (locationDirection.includes("side")){
        if (locationDirection.includes("right")) {
            guideBox.style.left = `${left + width + dist}px`
            console.log(dist)
        }
    
        if (locationDirection.includes("left")) {
            guideBox.style.left = `${left - width - dist}px`
        }

        if (locationDirection.includes("top")) {
            guideBox.style.top = `${top}px` 
        }
    
        if (locationDirection.includes("middle")) {
            guideBox.style.top = `${top + height/2}px`
        }
    
        if (locationDirection.includes("bottom")) {
            guideBox.style.top = `${top + height}px`
        }
    }

    if (locationDirection.includes("above") || locationDirection.includes("below")) {
        if (locationDirection.includes("above")) {
           guideBox.style.top = `${top - guideBoxHeight - dist}px` 

        }
        
        if (locationDirection.includes("below")) {
            guideBox.style.top = `${top + height + guideBoxHeight + dist}px` 
         }

        if (locationDirection.includes("right")) {
            guideBox.style.left = `${left}px`
        }
    
        if (locationDirection.includes("left")) {
            guideBox.style.left = `${left - guideBoxWidth}px`
        }

        if (locationDirection.includes("middle")) {
            guideBox.style.left = `${left + width/2 - guideBoxWidth/2}px`
        }

    }
    

}

// function findOptimalPositionX(guideBox, element, dist) {
//     const viewportOffset = element.getBoundingClientRect()
//     const left = viewportOffset.left;
//     const elementWidth = element.offsetWidth
//     const browserWidth = window.innerWidth
//     const guideBoxWidth = guideBox.style.width

//     console.log(elementWidth, browserWidth)

//     let position = left + elementWidth + dist + guideBoxWidth
//     if (position > 0 && position < browserWidth) {
//         return "right"
//     }
//     position = left - elementWidth - dist - guideBoxWidth
//     if (position > 0 && position < browserWidth) {
//         return "left"
//     }
//     return "none"
// }

// function findOptimalPositionY(element, dist) {
//     const viewportOffset = element.getBoundingClientRect();
//     const top = viewportOffset.top;
//     const elementHeight = element.offsetHeight
//     const browserHeight = window.innerHeight

//     let position = top
//     if (position > 0 && position < browserHeight) {
//         return "top"
//     }
//     position = top + elementHeight/2
//     if (positionForRight > 0 && positionForRight < browserWidth) {
//         return "middle"
//     }
//     return "none"
// }


/* Add a progress bar to Guide Box */
function createProgressBar(guideBox) {
    const progressBar = document.createElement("button")

    progressBar.classList.append("guide-progress-bar")

}

function setElementDescription(elementDescription) {
    const descriptionDiv = document.querySelector(".guide-box-description")
    descriptionDiv.innerText = elementDescription
}

/* Add Next Button to Guide Box  */
function addNextButton(guideBox) {
    const nextBtn = document.createElement("button")
    guideBox.appendChild(nextBtn)
    nextBtn.classList.add("guide-next-btn")
    nextBtn.innerText = "Next"

    return nextBtn

}

/* Add Previous Button to Guide Box */
function addPreviousButton(guideBox) {
    const prevBtn = document.createElement("button")
    guideBox.appendChild(prevBtn)
    prevBtn.innerText = "Previous"
    prevBtn.classList.add("guide-previous-btn")

    return prevBtn

}

/* Add Skip Button to Guide Box */
function addSkipButton(guideBox) {
    const skipBtn = document.createElement("button")
    guideBox.appendChild(skipBtn)
    skipBtn.innerHTML = `Skip`
    skipBtn.classList.add("guide-skip-btn")

    return skipBtn
}



