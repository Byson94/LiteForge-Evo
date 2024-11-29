// LFJS code

// Initializing konva
const gameCanvasDisplayed = document.querySelector('.gameCanvas');

var stage;
var layer;
function initKonva() {
    stage = new Konva.Stage({
        container: gameCanvasDisplayed,
        width: gameCanvasDisplayed.offsetWidth, 
        height: gameCanvasDisplayed.offsetHeight
      });
      
      layer = new Konva.Layer();
      
      stage.add(layer);
      let returningVal = { layer, stage };
      return returningVal;      
}

// Konva initialized, now other setps
function drawShape(obj, x, y, w0r, h0r, id) {
    if (obj === "circle") {
        let circle = new Konva.Circle({
            x: x, 
            y: y, 
            radius: w0r, 
            fill: 'red', 
            stroke: 'black',  
            strokeWidth: 4  
        });
        layer.add(circle); 
    } 
    // Create a rectangle
    else if (obj === "rectangle") {
        let rectangle = new Konva.Rect({
            x: x, 
            y: y,
            width: w0r,  
            height: h0r, 
            fill: 'blue', 
            stroke: 'black',  
            strokeWidth: 4  
        });
        layer.add(rectangle); 
    } 
    else if (obj === "arc") {
        let arc = new Konva.Arc({
            x: x,
            y: y,
            innerRadius: w0r,
            outerRadius: h0r,
            angle: 90,
            fill: 'yellow',
            stroke: 'orange',
            strokeWidth: 4
        });
        layer.add(arc);
    } 
    else {
        return "Object not recognized";
    }
}

export { drawShape, initKonva }