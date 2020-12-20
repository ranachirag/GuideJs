/* GuideJs Library usage examples */
"use strict";


const guide = new GuideJs()

function example() {
    guide.setOptions({
        addOutline: true,
        addOverlay: true,
        theme: "red",
        overlayOpacity: 0.9,
        elementDescriptions: ["Welcome to Guide.Js tutorial. This tutorial will introduce you to an example website for creating flowcharts.", 
                            'But first note, this website is a dummy. \n It is purely to demonstrate the Guide.Js Library. \n Note that text can be highlighted.',
                            "Let's start with some buttons. \n With this Button you can add Text.",
                            'Note the red theme, you can select other themes when you create your own guide.', 
                            'Fact: The guide box is automatically positioned!',
                            'It can be positioned all around an element, the optimal position is selected.',
                            'You can simply create a guide by adding classes your html code and customize using Javascript. \n See API page for more details.',
                            'Note the progress bar (border of the guide box) showing how much of the guide is complete.',
                            'Save your flow chart.',
                            'This the demo for Guide.js complete. Thank You for viewing!'],
        textHighlightColor: 'yellow',
        guideDistance: 20,
        guideHeight: '150px'
    })
    
    guide.start()
}

example()


