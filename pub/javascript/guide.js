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
        addOutline: true, 
        borderWidth: "1px", 
        borderLine: "solid",
        borderColor: "green",
        addOverlay: true,
    }

    this.guideBoxSettings = {
        customGuideBox: false,
        element: null,          // element to support 
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
        this.highlightElement(element)

        if(this.currentStep < this.numElements){

            const skipBtn = addSkipButton(this.guideBox)
            skipBtn.addEventListener("click", () => {
                const el = getElementByStepNumber(this.currentStep)
                el.classList.remove("guidejs-outline")
                stopGuide()

            }) 

            const prevBtn = addPreviousButton(this.guideBox)
            prevBtn.style.display = "none"
            prevBtn.addEventListener("click", () => {
                const el = getElementByStepNumber(this.currentStep)
                el.classList.remove("guidejs-highlight")
                el.classList.remove("guidejs-outline")

                this.currentStep -= 1
                updateProgress(this.guideBox, this.currentStep, this.numElements)
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
                this.highlightElement(element)
            })
        
            const nextBtn = addNextButton(this.guideBox)
            nextBtn.addEventListener("click", () => {
                const el = getElementByStepNumber(this.currentStep)
                el.classList.remove("guidejs-highlight")
                el.classList.remove("guidejs-outline")
                
                this.currentStep += 1
                updateProgress(this.guideBox, this.currentStep, this.numElements)
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
                this.highlightElement(element)
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
        // element.style.border = `${borderWidth} ${borderLine} ${borderColor}`
        element.classList.add("guidejs-outline")
    }

    // Adding overlay to the page in accordance to the given settings
    if(highlightSettings.addOverlay) {
    
        const {overlayOpacity, overlayRGB} = highlightSettings
        if (document.querySelectorAll(".guide-overlay").length == 0) {
            const divOverlay = document.createElement("div")
            divOverlay.classList.add("guide-overlay")

            const guidejsDiv = document.querySelector(".guidejs-elements")
            guidejsDiv.appendChild(divOverlay)
        }

        element.classList.add("guidejs-highlight")

        // document.onmousemove = function(e) {
        //     var mousecoords = getMousePos(e);
        //     if ()
            
        // };
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

    // const locationDirection = classArray.filter((className) => className.includes("position"))[0]
    const valPositions = autoPosition(guideBox, element, dist)
    let locationDirection = valPositions[1]

    // const optimalX = findOptimalPositionX(guideBox, element, dist

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
    
        // if (locationDirection.includes("bottom")) {
        //     guideBox.style.top = `${top + height}px`
        // }
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

function autoPosition(guideBox, element, dist) {
    const viewportOffset = element.getBoundingClientRect();
    const top = viewportOffset.top;
    const elementHeight = element.offsetHeight
    const browserHeight = window.innerHeight
    const guideBoxHeight = parseInt(guideBox.offsetHeight) - 6

    const left = viewportOffset.left;
    const elementWidth = element.offsetWidth
    const browserWidth = window.innerWidth
    const guideBoxWidth = parseInt(guideBox.offsetWidth) - 6

    const valPositions = []

    let positionY = 0
    let positionX = 0

    positionY = top - dist - guideBoxHeight
    if (positionY > 0 && positionY < browserHeight) {
        positionX = left + guideBoxWidth 
        if (positionX > 0 && positionX < browserWidth) {
            valPositions.push('above-left')
        }

        positionX = left + elementWidth/2 + guideBoxWidth 
        if (positionX > 0 && positionX < browserWidth) {
            valPositions.push('above-middle')
        }
    }

    positionY = top + elementHeight + dist + guideBoxHeight
    if (positionY > 0 && positionY < browserHeight) {
        console.log(left + guideBoxWidth , browserWidth)
        positionX = left + guideBoxWidth 
        if (positionX > 0 && positionX < browserWidth) {
            valPositions.push('below-left')
        }

        positionX = left + elementWidth/2 + guideBoxWidth 
        if (positionX > 0 && positionX < browserWidth) {
            valPositions.push('below-middle')
        }
    }

    positionX = left - dist - guideBoxWidth
    if (positionX > 0 && positionX < browserWidth) {
        positionY = top + guideBoxHeight 
        if (positionY > 0 && positionY < browserHeight) {
            valPositions.push('side-left-top')
        }

        positionY = top + (elementHeight/2) + guideBoxHeight 
        if (positionY > 0 && positionY < browserHeight) {
            valPositions.push('side-left-middle')
        }
    }

    positionX = left + elementWidth + dist + guideBoxWidth
    if (positionX > 0 && positionX < browserWidth) {
        positionY = top + guideBoxHeight 
        if (positionY > 0 && positionY < browserHeight) {
            valPositions.push('side-right-top')
        }

        positionY = top + (elementHeight/2) + guideBoxHeight 
        if (positionY > 0 && positionY < browserHeight) {
            valPositions.push('side-right-middle')
        }
    }
    console.log(valPositions)
    return valPositions
    
}


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


function getMousePos(e) {
    return {x:e.clientX,y:e.clientY};
}

function updateProgress(guideBox, currentStep, totalSteps) {
    let currentPercentage = currentStep / totalSteps
    const guideBoxWidth = guideBox.offsetWidth - 6
    const guideBoxHeight = guideBox.offsetHeight - 6

    // console.log(currentStep, totalSteps, currentPercentage, guideBox.style.backgroundPosition)

    if (currentPercentage <= 0.25) {
        currentPercentage = (1-currentPercentage) * guideBoxWidth
        console.log
        guideBox.style.backgroundPosition = `-${currentPercentage}px 0px, ${guideBoxWidth-5}px -${guideBoxHeight}px, ${guideBoxWidth}px ${guideBoxHeight-5}px, 0px ${guideBoxHeight}px`

    } else if(currentPercentage <= 0.5) {
        currentPercentage = (1 - ((currentPercentage - 0.25) / 0.25)) * guideBoxHeight
        guideBox.style.backgroundPosition = `0px 0px, ${guideBoxWidth-5}px -${currentPercentage}px, ${guideBoxWidth}px ${guideBoxHeight-5}px, 0px ${guideBoxHeight}px`

    } else if(currentPercentage <= 0.75) {
        currentPercentage = (1- ((currentPercentage - 0.5) / 0.25)) * guideBoxWidth
        guideBox.style.backgroundPosition = `0px 0px, ${guideBoxWidth-5}px 0px, ${currentPercentage}px ${guideBoxHeight-5}px, 0px ${guideBoxHeight}px`

    } else if(currentPercentage <= 1) {
        currentPercentage = (1 - ((currentPercentage - 0.75) / 0.25)) * guideBoxWidth
        guideBox.style.backgroundPosition = `0px 0px, ${guideBoxWidth-5}px 0px, 0px ${guideBoxHeight-5}px, 0px ${currentPercentage}px`
    }

}
