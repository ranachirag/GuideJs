/* GuideJs Library usage examples */
"use strict";

console.log(document.querySelector("p").style.width)
const guide = new GuideJs()
guide.highlightGivenElement(document.querySelector("p"))
guide.highlightGivenElement(document.querySelector("h1"))