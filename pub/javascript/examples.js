/* GuideJs Library usage examples */
"use strict";
const guide = new GuideJs()

guide.setOptions({
    addOutline: true,
    addOverlay: true,
    // theme: "red",
    overlayOpacity: 1,
    elementDescriptions: ["Welcome to Guide.Js tutorial. This tutorial will introduce you to tools on how to create a flowchart. (Note: It is a dummy website)", 
                        'Add Text to an Object. \n (You can stick the Guide.js box to elements and position it around them)',
                        'Add a Line. \n (Then move from element to element giving context).',
                        'Add a Rectangle.', 
                        'Add a Square.',
                        'Add an Oval.',
                        'Add a Circle.',
                        'Add a Triangle.',
                        'Add a Parallelogram. \n (Notice the Guide.js box can be positioned below the element)',
                        'This is the space where you will create your flowchart. \n (Or it can be positioned above)',
                        'Here you can control the view of your flow chart.',
                        'Save your flow chart.',
                        'This the demo for Guide.js complete. More exciting features will be added. Thank You for viewing.',
                        'nothing'],
    textHighlightColor: 'yellow',
    guideDistance: 20,
})

guide.start()


