"use strict";

function highlightElement(elementSettings) {

    const element = elementSettings.element
    
    if (elementSettings.addOutline) {
        element.style.border = '4em solid black'
    }
}

modules.export(highlightElement)
