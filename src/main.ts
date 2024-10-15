import "./style.css";

const APP_NAME = "Sticker App";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

// Step 1 - H1 element with text "Sticker App" -------------------------
const heading = document.createElement("h1");
heading.textContent = APP_NAME;
// app.appendChild(heading);

// Creating Canvas Element
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "sticker-canvas"; //css id for styling
// app.appendChild(canvas);

// Adding canvas and heading to a container for better positioning
const container = document.createElement("div");
container.id = "canvas-container";
container.appendChild(heading);
container.appendChild(canvas);
app.appendChild(container);

// Step 2 - Clear Button and Draw Handler -------------------------------------
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.id = "clear-button";

// undo/redo buttons
const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
undoButton.id = "undo-button";

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
redoButton.id = "redo-button";

// adding button container for better positioning
const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";
buttonContainer.appendChild(clearButton);
buttonContainer.appendChild(undoButton);
buttonContainer.appendChild(redoButton);
app.appendChild(buttonContainer);

// Getting canvas context for drawing
const ctx = canvas.getContext("2d")!;
let isDrawing = false;
let points: Array<Array<{ x: number; y: number }>> = [];  // Array of arrays to store drawing segments
let currentLine: Array<{ x: number; y: number }> = [];
let redoStack: Array<Array<{ x: number; y: number }>> = [];  // Redo stack

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
        redoStack = [];  // Clear redo stack because a new line has been drawn
        dispatchDrawingChangedEvent();
    }
});

canvas.addEventListener("mouseout", () => {
    if (isDrawing) {
        isDrawing = false;
        points.push(currentLine);
        redoStack = [];  // Clear redo stack
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

// Step 4 - Undo/Redo Button -------------------------------------
// Undo button handler
undoButton.addEventListener("click", () => {
    if (points.length > 0) {
        const lastLine = points.pop();  // Remove the last drawn line
        if (lastLine) {
            redoStack.push(lastLine);  // Move it to the redo stack
        }
        dispatchDrawingChangedEvent();  // Trigger redraw
    }
});

// Redo button handler
redoButton.addEventListener("click", () => {
    if (redoStack.length > 0) {
        const lastRedoLine = redoStack.pop();  // Remove the last line from redo stack
        if (lastRedoLine) {
            points.push(lastRedoLine);  // Add it back to the undo stack
        }
        dispatchDrawingChangedEvent();  // Trigger redraw
    }
});