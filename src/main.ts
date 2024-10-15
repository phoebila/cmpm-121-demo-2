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
