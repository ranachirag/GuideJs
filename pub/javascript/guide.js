"use strict";

/**
 * Guide.js library.
 *
 * @class GuideJs
 */
function GuideJs() {
    this.timed = false
    this.duration = "0s"
    this.guideType = ""
    this.numElements = arguments[0].length
    this.elementDescriptions = arguments[0]

    this.currentStep = 1
    this.guideBox = null

    this.elementHighlight = {
        element: null, // Element to highlight
        stepNumber: 1,
        addOutline: false, 
        borderWidth: "2px",
        borderLine: "solid",
        borderColor: "lightgreen",
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
            // this.highlightElement(element)
            this.makeGuideBox(element, elementDescription)
            
        }
        
    },

    /* Stop the guide manually */
    stop: function() {
        stopGuide()
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


        if(this.currentStep < this.numElements){

            const skipBtn = addSkipButton(this.guideBox)
            skipBtn.addEventListener("click", stopGuide) 

            const prevBtn = addPreviousButton(this.guideBox)
            prevBtn.style.display = "none"
            prevBtn.addEventListener("click", () => {
                this.currentStep -= 1
                if (this.currentStep === 1) {
                    prevBtn.style.display = "none"
                }
                if (this.currentStep < this.numElements) {
                    nextBtn.style.display = ""
                    skipBtn.innerText = "Skip"
                }
                const element = getElementByStepNumber(this.currentStep)
                const elementDescription = this.elementDescriptions[this.currentStep-1]
                setGuideBoxPosition(this.guideBox, element, 10)
                setElementDescription(elementDescription)
            })
        
            const nextBtn = addNextButton(this.guideBox)
            nextBtn.addEventListener("click", () => {
                this.currentStep += 1
                if (this.currentStep > 1) {
                    prevBtn.style.display = ""
                }
                if (this.currentStep === this.numElements) {
                    nextBtn.style.display = "none"
                    skipBtn.innerText = "Done"
                }
                const element = getElementByStepNumber(this.currentStep)
                const elementDescription = this.elementDescriptions[this.currentStep-1]
                setGuideBoxPosition(this.guideBox, element, 10)
                setElementDescription(elementDescription)
            })

        } else {
            const skipBtn = addSkipButton(this.guideBox)
            skipBtn.addEventListener("click", stopGuide) 
        }
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
        element.style.zIndex = "3"
        const {overlayOpacity, overlayRGB} = highlightSettings

        const divOverlay = document.createElement("div")
        divOverlay.classList.add("guide-overlay")

        console.log(element)

        const guidejsDiv = document.querySelector(".guidejs-elements")
        guidejsDiv.appendChild(divOverlay)

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

    const {element, dist} = guideBoxSettings 
    
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

    const classArray = Array.from(element.classList)

    const locationDirection = classArray.filter((className) => className.includes("position"))[0]


    if (locationDirection.includes("side")){
        if (locationDirection.includes("right")) {
            guideBox.style.left = `${left + width + dist}px`
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
            guideBox.style.top = `${top + height + dist}px` 
         }

        if (locationDirection.includes("right")) {
            guideBox.style.left = `${left + width - guideBoxWidth}px`
        }
    
        if (locationDirection.includes("left")) {
            guideBox.style.left = `${left}px`
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

function stopGuide() {
    document.querySelector(`.guidejs-elements`).remove()
}