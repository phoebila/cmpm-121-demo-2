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

// Step 6 - Thickness Styling -------------------------------------
const thinButton = document.createElement("button");
thinButton.textContent = "Thin Marker";
thinButton.id = "thin-button";

const thickButton = document.createElement("button");
thickButton.textContent = "Thick Marker";
thickButton.id = "thick-button";

// adding button container for better positioning
const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";
buttonContainer.appendChild(clearButton);
buttonContainer.appendChild(undoButton);
buttonContainer.appendChild(redoButton);
buttonContainer.appendChild(thinButton);
buttonContainer.appendChild(thickButton);
app.appendChild(buttonContainer);

// Step 5 - Marker Class -------------------------------------
class Marker {
    private startX: number;
    private startY: number;
    private endX: number;
    private endY: number;
    private thickness: number;

    constructor(startX: number, startY: number, thickness: number) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX; // Initially, the end point is the same as the start point
        this.endY = startY;
        this.thickness = thickness;
    }

    drag(x: number, y: number) {
        // Update the end coordinates as the user drags
        this.endX = x;
        this.endY = y;
    }

    display(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = '#fff'; // You can customize the color
        ctx.lineWidth = this.thickness; // You can customize the line width
        ctx.stroke();
        ctx.closePath();
    }
}

// Rewriting marker lines with Marker class
const displayList: Marker[] = [];
let currentLine: Marker | null = null;

// mouse handling
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a new marker line at the mouse position
    currentLine = new Marker(x, y, currThickness);
    displayList.push(currentLine);
});

canvas.addEventListener("mousemove", (e) => {
    if (!currentLine) return; // Do nothing if there's no current line

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update the line's end point as the mouse moves
    currentLine.drag(x, y);

    // Dispatch a "drawing-changed" event to redraw the canvas
    canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mouseup", () => {
    currentLine = null; // Finalize the current line
});

// Observer for the "drawing-changed" event
canvas.addEventListener("drawing-changed", () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Redraw all marker lines
    displayList.forEach((line) => {
        line.display(ctx);
    });
});

// Step 6 - Thickness Styling -------------------------------------
let currThickness = 2;

// event listeners
thinButton.addEventListener('click', () => {
    currThickness = 2;
    updateToolSelection(thinButton)
});

thickButton.addEventListener('click', () => {
    currThickness = 5;
    updateToolSelection(thickButton)
});

function updateToolSelection(selectedButton: HTMLButtonElement) {
    // Remove the selected class from all buttons
    thinButton.classList.remove("selected");
    thickButton.classList.remove("selected");

    // Add the selected class to the clicked button
    selectedButton.classList.add("selected");
}

// rewriting undo/redo logic    
const undoStack: Marker[] = [];
const redoStack: Marker[] = [];

function undo() {
    if (displayList.length === 0) return;

    // Pop the last line from the display list
    const line = displayList.pop();
    if (line) {
        redoStack.push(line); // Add to redo stack
        canvas.dispatchEvent(new Event("drawing-changed")); // Trigger redraw
    }
}

function redo() {
    if (redoStack.length === 0) return;

    // Pop from the redo stack and add it back to the display list
    const line = redoStack.pop();
    if (line) {
        displayList.push(line);
        canvas.dispatchEvent(new Event("drawing-changed")); // Trigger redraw
    }
}

function clear(){
    // Clear the display list
    displayList.length = 0;  // Clear the array

    // Clear the canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Dispatch a "drawing-changed" event to update the canvas (if needed)
    canvas.dispatchEvent(new Event("drawing-changed"));
}

// Add event listeners to undo and redo buttons
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
clearButton.addEventListener('click', clear);