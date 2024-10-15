import "./style.css";

const APP_NAME = "Sticker App";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Step 1 - H1 element with text "Sticker App" -------------------------
const heading = document.createElement("h1");
heading.textContent = APP_NAME;
app.appendChild(heading);

// Creating Canvas Element
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "sticker-canvas"; //css id for styling
app.appendChild(canvas);

// Step 2 - Clear Button and Draw Handler -------------------------------------
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.id = "clear-button";
app.appendChild(clearButton);

// Getting canvas context for drawing
const ctx = canvas.getContext("2d")!;
let isDrawing = false;
let points: Array<Array<{ x: number; y: number }>> = [];  // Array of arrays to store drawing segments
let currentLine: Array<{ x: number; y: number }> = [];

// mouse handling
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currentLine = [];
    const point = { x: e.offsetX, y: e.offsetY };
    currentLine.push(point);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        const point = { x: e.offsetX, y: e.offsetY };
        currentLine.push(point);
        dispatchDrawingChangedEvent();
    }
});

canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        isDrawing = false;
        points.push(currentLine);
        dispatchDrawingChangedEvent();
    }
});

canvas.addEventListener("mouseout", () => {
    if (isDrawing) {
        isDrawing = false;
        points.push(currentLine);
        dispatchDrawingChangedEvent();
    }
});

// clear button handler
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Step 3 - Drawing Changed Event -------------------------------------
function dispatchDrawingChangedEvent() {
    const event = new CustomEvent("drawing-changed");
    canvas.dispatchEvent(event);
}

canvas.addEventListener("drawing-changed", () => { 
    redrawCanvas();
 });

// Function redrawCanvas
function redrawCanvas() {
     // Clear the canvas
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     // Redraw all the lines based on points
     points.forEach(line => {
         if (line.length > 0) {
             ctx.beginPath();
             ctx.moveTo(line[0].x, line[0].y);
             for (let i = 1; i < line.length; i++) {
                 ctx.lineTo(line[i].x, line[i].y);
             }
             ctx.stroke();
             ctx.closePath();
         }
     });
}