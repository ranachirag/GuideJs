"use strict";
(function(global, document) {
    /**
     * Guide.js library.
     *
     * @class GuideJs
     */
    function GuideJs() {
        this.elementDescriptions = []
        this.numElements = this.elementDescriptions.length

        this.currentStep = 1
        this.guideBox = null

        this.elementHighlight = {
            element: null, // Element to highlight
            addOutline: true, 
            addOverlay: true,
            theme: 'blue',
            overlayOpacity: 0.9,
            textHighlightColor: '#ffff00'
        }

        this.guideBoxSettings = {
            element: null,       
            width: '250px',
            height: '120px', 
            dist: 20         
        }

    }

    /* Prototype of GuideJs object. Use the given functions to create one instance of a walkthrough guide. */
    GuideJs.prototype = {

        setOptions: function (settings) {
            const { addOutline, addOverlay, theme, overlayOpacity, elementDescriptions, guideWidth, guideHeight, textHighlightColor, guideDistance } = settings 
            // addOutline=true, addOverlay=true, outlineColor='rgb(18, 195, 248)', overlayOpacity=0.8, descriptsions, textHighlightColor='#ffff00', dist=20

            if(addOutline !== undefined) {
                this.elementHighlight.addOutline = addOutline
            } 

            if(addOverlay !== undefined) {
                this.elementHighlight.addOverlay = addOverlay
            }
            if(theme !== undefined) {
                this.elementHighlight.theme = theme
            }

            if(overlayOpacity !== undefined) {
                this.elementHighlight.overlayOpacity = overlayOpacity
            }

            if (elementDescriptions !== undefined) {
                this.elementDescriptions = elementDescriptions
                this.numElements = this.elementDescriptions.length
            }

            if (guideWidth !== undefined) {
                this.guideBoxSettings.width = guideWidth
            }

            if (guideHeight !== undefined) {
                this.guideBoxSettings.height = guideHeight
            }

            if (textHighlightColor !== undefined) {
                this.elementHighlight.textHighlightColor = textHighlightColor
            }

            if (guideDistance !== undefined) {
                this.guideBoxSettings.dist = guideDistance
            }

        },

        /* Start the guide */
        start: function() {
            this.initializeGuideJsElements()
            if (this.numElements > 0) {
                const element = this.getElementByStepNumber()
                const elementDescriptions = this.elementDescriptions[this.currentStep-1]
                this.makeGuideBox(element, elementDescriptions)
            }
        },

        /* Stop the guide manually */
        stop: function() {
            document.querySelector(`.guidejs-elements`).remove()
        },

        makeGuideBox: function(element, elementDescription) {
            
            this.guideBoxSettings.element = element
            this.makeGuideBoxDOM()
            this.setElementDescription(elementDescription)
            this.highlightElement(element)

            if(this.currentStep < this.numElements){

                const skipBtn = this.addSkipButton()
                skipBtn.addEventListener("click", () => {
                    const el = this.getElementByStepNumber()
                    if(el.tagName.toLowerCase() == 'span') {
                        el.classList.remove("guidejs-span-highlight")
                    } else {
                        el.classList.remove(`guidejs-outline-${this.elementHighlight.theme}`)
                    }
                    this.stop()

                }) 

                const prevBtn = this.addPreviousButton()
                prevBtn.style.display = "none"
                prevBtn.addEventListener("click", () => {
                    const el = this.getElementByStepNumber()
                    el.classList.remove("guidejs-highlight")
                    if(el.tagName.toLowerCase() == 'span') {
                        el.classList.remove("guidejs-span-highlight")
                    } else {
                        el.classList.remove(`guidejs-outline-${this.elementHighlight.theme}`)
                    }
                    
                    this.currentStep -= 1
                    this.updateProgress(this.guideBox, this.currentStep, this.numElements)
                    if (this.currentStep === 1) {
                        prevBtn.style.display = "none"
                    }
                    if (this.currentStep < this.numElements) {
                        nextBtn.style.display = ""
                        skipBtn.innerText = "Skip"
                    }
                    const element = this.getElementByStepNumber()
                    const elementDescription = this.elementDescriptions[this.currentStep-1]
                    this.setGuideBoxPosition(element)
                    this.setElementDescription(elementDescription)
                    this.highlightElement(element)
                })
            
                const nextBtn = this.addNextButton()
                nextBtn.addEventListener("click", () => {
                    const el = this.getElementByStepNumber()
                    el.classList.remove("guidejs-highlight")
                    if(el.tagName.toLowerCase() == 'span') {
                        el.classList.remove("guidejs-span-highlight")
                    } else {
                        el.classList.remove(`guidejs-outline-${this.elementHighlight.theme}`)
                    }
        
                    this.currentStep += 1
                    this.updateProgress(this.guideBox, this.currentStep, this.numElements)
                    if (this.currentStep > 1) {
                        prevBtn.style.display = ""
                    }
                    if (this.currentStep === this.numElements) {
                        nextBtn.style.display = "none"
                        skipBtn.innerText = "Done"
                    }

                    const element = this.getElementByStepNumber()
                    const elementDescription = this.elementDescriptions[this.currentStep-1]
                    this.setGuideBoxPosition(element)
                    this.setElementDescription(elementDescription)
                    this.highlightElement(element)
                })

            } else {
                const skipBtn = this.addSkipButton()
                skipBtn.addEventListener("click", this.stop) 
            }
        },

        getElementByStepNumber: function () {
            return document.querySelector(`.guidejs-step-${this.currentStep}`)
        },

        initializeGuideJsElements: function() {
            const guidejsDiv = document.createElement("div")
            guidejsDiv.classList.add("guidejs-elements")

            const body = document.querySelector("body")
            body.appendChild(guidejsDiv)
        },

        /* Highlights an element with settings given by user */
        highlightElement: function (element) {
            this.elementHighlight.element = element

            // Adding outline to the given element in accordance to the given settings
            if (this.elementHighlight.addOutline) {
                const {theme} = this.elementHighlight
                // element.style.border = `${borderWidth} ${borderLine} ${borderColor}`
                if (element.tagName.toLowerCase() == 'span') {
                    element.classList.add("guidejs-span-highlight")
                } else {
                    element.classList.add(`guidejs-outline-${theme}`)
                }
                
            }

            // Adding overlay to the page in accordance to the given settings
            if(this.elementHighlight.addOverlay) {
            
                const { overlayOpacity } = this.elementHighlight
                if (document.querySelectorAll(".guide-overlay").length == 0) {
                    const divOverlay = document.createElement("div")
                    divOverlay.classList.add("guide-overlay")

                    const guidejsDiv = document.querySelector(".guidejs-elements")
                    divOverlay.style.opacity = overlayOpacity
                    guidejsDiv.appendChild(divOverlay)
                }

                element.classList.add("guidejs-highlight")

            }
        },

        /* Makes a guide box that gives users context for steps */
        makeGuideBoxDOM: function() {

            const { width, height } = this.guideBoxSettings
            const guideBox = document.createElement("div")
            guideBox.classList.add(`guide-box-${this.elementHighlight.theme}`)

            const guidejsDiv = document.querySelector(".guidejs-elements")
            guidejsDiv.appendChild(guideBox)

            const descriptionDiv = document.createElement("div")
            descriptionDiv.classList.add("guide-box-description")
            guideBox.appendChild(descriptionDiv)

            guideBox.style.width = width
            guideBox.style.height = height
            guideBox.style.backgroundPosition = `-${width}px 0px, ${width-5}px -${height}px, ${width}px ${height-5}px, 0px ${height}px`
    

            const {element} = this.guideBoxSettings 
            this.guideBox = guideBox
            this.setGuideBoxPosition(element)

        },

        setGuideBoxPosition: function(element) {
            const guideBox = this.guideBox
            const dist = this.guideBoxSettings.dist

            const viewportOffset = element.getBoundingClientRect();
            const top = viewportOffset.top;
            const left = viewportOffset.left;
            const width = element.offsetWidth
            const height = element.offsetHeight
            const guideBoxWidth = guideBox.offsetWidth
            const guideBoxHeight = guideBox.offsetHeight

            guideBox.style.position = "fixed"


            // const locationDirection = classArray.filter((className) => className.includes("position"))[0]
            const valPositions = this.autoPosition(element)
            let locationDirection = valPositions[0]


            if (locationDirection.includes("side")){
                if (locationDirection.includes("right")) {
                    guideBox.style.left = `${left + width + dist}px`
                }
            
                if (locationDirection.includes("left")) {
                    guideBox.style.left = `${left - guideBoxWidth - dist}px`
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

        },

        /* Find the Optimal positions for the guide box in reference to the element it provides context for */
        autoPosition: function(element) {
            const guideBox = this.guideBox
            const dist = this.guideBoxSettings.dist


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

                positionX = left + elementWidth - guideBoxWidth 
                if (positionX > 0 && positionX < browserWidth) {
                    valPositions.push('above-right')
                }
            }

            positionY = top + elementHeight + dist + guideBoxHeight
            if (positionY > 0 && positionY < browserHeight) {
                positionX = left + guideBoxWidth 
                if (positionX > 0 && positionX < browserWidth) {
                    valPositions.push('below-left')
                }

                positionX = left + elementWidth/2 + guideBoxWidth 
                if (positionX > 0 && positionX < browserWidth) {
                    valPositions.push('below-middle')
                }

                positionX = left + elementWidth - guideBoxWidth 
                if (positionX > 0 && positionX < browserWidth) {
                    valPositions.push('below-right')
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
            console.log(valPositions, left)
            return valPositions

        },

        /* Sets the context for associated element with provided text. */
        setElementDescription: function(elementDescription) {
            const descriptionDiv = document.querySelector(".guide-box-description")
            descriptionDiv.innerText = elementDescription
        },

        /* Add Next Button to Guide Box  */
        addNextButton: function () {
            const nextBtn = document.createElement("button")
            this.guideBox.appendChild(nextBtn)
            nextBtn.classList.add(`guide-next-btn-${this.elementHighlight.theme}`)
            nextBtn.innerText = "Next"
            return nextBtn
        },

        /* Add Previous Button to Guide Box */
        addPreviousButton: function() {
            const prevBtn = document.createElement("button")
            this.guideBox.appendChild(prevBtn)
            prevBtn.innerText = "Previous"
            prevBtn.classList.add(`guide-previous-btn-${this.elementHighlight.theme}`)
            return prevBtn
        },

        /* Add Skip Button to Guide Box */
        addSkipButton: function(guideBox) {
            const skipBtn = document.createElement("button")
            this.guideBox.appendChild(skipBtn)
            skipBtn.innerHTML = `Skip`
            skipBtn.classList.add(`guide-skip-btn-${this.elementHighlight.theme}`)
            return skipBtn
        },

        updateProgress: function(guideBox, currentStep, totalSteps) {
            // const guideBox = this.guideBox
            // const currentStep = this.currentStep
            // const totalSteps = this.totalSteps

            let currentPercentage = currentStep / totalSteps
            const guideBoxWidth = guideBox.offsetWidth - 6
            const guideBoxHeight = guideBox.offsetHeight - 6

            // console.log(currentStep, totalSteps, currentPercentage, guideBox.style.backgroundPosition)

            if (currentPercentage <= 0.25) {
                currentPercentage = (1-currentPercentage) * guideBoxWidth
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

    }

    global.GuideJs = global.GuideJs || GuideJs

})(window, window.document);


