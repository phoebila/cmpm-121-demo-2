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

// mouse handling
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY); //starting at mouse location
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.closePath();
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

// clear button handler
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});