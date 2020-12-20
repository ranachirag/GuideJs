# Guide.Js

## Get Started

### Download Guide.Js

- Clone this repository.

### JavaScript - Required Files

- The files guide.js and guidejs.css are required to use this library.
- Include this script in the <head> of your html page:
  
```javascript
<link rel="stylesheet" type="text/css" href="./styles/guidejs.css" />
<script defer type="text/javascript" src='./javascript/guide.js'></script>
```
### Basic Example for Guide.Js Usage

- Here is a basic example of the Guide.Js library usage. 

#### Javascript

```javascript
const guide = new GuideJs()

guide.setOptions({
  elementDescriptions: ['Button 1 - Shows First Step', 
                        'Button 2 - Shows Second Step', 
                        'Here is some Example Text to show Highlighting'],
  addOverlay: true,
  overlayOpacity: 1,
  addOutline: true,
  theme: "red",
  guideWidth: '500px',
  guideHeight: '300px',
  guideDistance: 30,
})

guide.start()
```

#### HTML

```html
<div class="example" >
    <button class="guidejs-step-1">Button 1 </button >
    <button class="guidejs-step-2">Button 2 </button >
    <span class="guidejs-step-3" > Example Text </span >
</div >

```

### Image of Example
![example](https://github.com/csc309-fall-2020/js-library-ranachir/blob/master/image.png "Example")

