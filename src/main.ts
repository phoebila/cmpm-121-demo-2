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

// Step 8 - Emoji Stickers -------------------------------------
 // Refactored JSON style data to array
const stickerData = [
    { emoji: "🤠", label: "Cowboy" },
    { emoji: "🌵", label: "Cactus" },
    { emoji: "🎲", label: "Dice" },
];

// Create sticker buttons dynamically based on the sticker data
const stickerButtons: HTMLButtonElement[] = [];
stickerData.forEach(sticker => {
    const button = document.createElement("button");
    button.textContent = sticker.emoji;
    button.id = `${sticker.label.toLowerCase()}-button`;

    // Add an event listener to set the selected emoji
    button.addEventListener('click', () => {
        selectedEmoji = sticker.emoji; // Set the emoji to the selected one
        updateToolSelection(button);
    });

    stickerButtons.push(button);
});

// Step 9 - Custom Stickers -------------------------------------
const customStickerButton = document.createElement("button");
customStickerButton.textContent = "Add Custom Sticker";
customStickerButton.id = "custom-sticker-button";

// Step 10 - Export Button -------------------------------------
const exportButton = document.createElement("button");
exportButton.textContent = "Export as PNG";
exportButton.id = "export-button";

// adding button container for better positioning
const buttonContainer = document.createElement("div");
buttonContainer.id = "button-container";
buttonContainer.appendChild(clearButton);
buttonContainer.appendChild(undoButton);
buttonContainer.appendChild(redoButton);
buttonContainer.appendChild(thinButton);
buttonContainer.appendChild(thickButton);
stickerButtons.forEach(button => buttonContainer.appendChild(button));
buttonContainer.appendChild(customStickerButton);
buttonContainer.appendChild(exportButton);
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

// Step 8 - Sticker Class -------------------------------------
class EmojiSticker {
    constructor(public x: number, public y: number, public emoji: string) {}
    
    display(ctx: CanvasRenderingContext2D) {
        ctx.font = '48px Arial'; // Adjust font size as necessary
        ctx.fillText(this.emoji, this.x, this.y); // Draw the emoji
    }
}

// Rewriting marker lines with Marker class
const displayList: (Marker | EmojiSticker)[] = [];
let currentLine: Marker | null = null;
let currentEmoji: EmojiSticker | null = null;

// Preview variables
let previewX: number = 0;
let previewY: number = 0;
let isMouseDown: boolean = false;
let selectedEmoji: string | null = null; // For selected emoji

// mouse handling
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedEmoji) {
        // Place the selected emoji sticker
        const newSticker = new EmojiSticker(x, y, selectedEmoji);
        displayList.push(newSticker);
        currentEmoji = null; // Clear current emoji reference
    } else {
        // Create a new marker line at the mouse position
        currentLine = new Marker(x, y, currThickness);
        displayList.push(currentLine);
    }

    isMouseDown = true; // Set mouse down state
});

// Observer for the "drawing-changed" event
canvas.addEventListener("drawing-changed", () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Redraw all marker lines and stickers
    displayList.forEach((item) => {
        if (item instanceof Marker) {
            item.display(ctx);
        } else if (item instanceof EmojiSticker) {
            item.display(ctx);
        }
    });
});

// Step 9 - Custom Sticker Handler -------------------------------------
customStickerButton.addEventListener('click', () => {
    const emoji = prompt("Enter a sticker emoji:", "😀"); // Default emoji for prompt
    if (emoji) {
        // Create a new sticker object
        const newSticker = { emoji, label: `Custom ${stickerData.length + 1}` };

        // Add the new sticker to the sticker data array
        stickerData.push(newSticker);

        // Create a new button for the custom sticker
        const button = document.createElement("button");
        button.textContent = newSticker.emoji;
        button.id = `${newSticker.label.toLowerCase()}-button`;

        // Add an event listener to set the selected emoji
        button.addEventListener('click', () => {
            selectedEmoji = newSticker.emoji; // Set the emoji to the selected one
            updateToolSelection(button);
        });

        // Add the new button to the button container
        buttonContainer.appendChild(button);
    }
});

// Step 10 - Export Button Handler -------------------------------------
exportButton.addEventListener('click', () => {
    // Create a new canvas and context
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1024;  // New canvas size
    exportCanvas.height = 1024;

    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    // Scale the context to fit the larger canvas (4x larger in each dimension)
    exportCtx.scale(4, 4);

    // Draw all items in the display list onto the new canvas
    displayList.forEach((item) => {
        if (item instanceof Marker) {
            item.display(exportCtx);
        } else if (item instanceof EmojiSticker) {
            item.display(exportCtx);
        }
    });

    // Trigger download of the canvas as PNG
    exportCanvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sticker-export.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the URL object
        }
    }, 'image/png');
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
    stickerButtons.forEach(button => button.classList.remove("selected"));
    // Add the selected class to the clicked button
    selectedButton.classList.add("selected");
}

// rewriting undo/redo logic    
const undoStack: (Marker | EmojiSticker)[] = [];
const redoStack: (Marker | EmojiSticker)[] = [];

function undo() {
    if (displayList.length === 0) return;

    // Pop the last line from the display list
    const item = displayList.pop();
    if (item) {
        redoStack.push(item); // Add to redo stack
        canvas.dispatchEvent(new Event("drawing-changed")); // Trigger redraw
    }
}

function redo() {
    if (redoStack.length === 0) return;

    // Pop from the redo stack and add it back to the display list
    const item = redoStack.pop();
    if (item) {
        displayList.push(item);
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

// Step 7 - Tool Preview -------------------------------------
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update preview position
    previewX = x;
    previewY = y;

    // Dispatch the "tool-moved" event
    canvas.dispatchEvent(new Event("tool-moved"));

    // If mouse is down, update the current line
    if (isMouseDown && currentLine) {
        currentLine.drag(x, y);
        canvas.dispatchEvent(new Event("drawing-changed")); // Trigger redraw
    }
});

// Observer for the "tool-moved" event
canvas.addEventListener("tool-moved", () => {
    const ctx = canvas.getContext("2d");
    if (!ctx || isMouseDown) return; // Don't draw preview if mouse is down

    // Clear the canvas for the preview
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw existing marker lines and stickers
    displayList.forEach((item) => {
        if (item instanceof Marker) {
            item.display(ctx);
        } else if (item instanceof EmojiSticker) {
            item.display(ctx);
        }
    });

    // Draw the tool preview
    if (selectedEmoji) {
        ctx.font = '48px Arial'; // Match the emoji font size
        ctx.fillText(selectedEmoji, previewX, previewY); // Draw a preview of the emoji
    } else if (currThickness) {
        ctx.beginPath();
        ctx.arc(previewX, previewY, currThickness, 0, Math.PI * 2); // Draw a circle for preview
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Light gray color for preview
        ctx.lineWidth = currThickness; // Match the current tool thickness
        ctx.stroke();
        ctx.closePath();
    }
});

canvas.addEventListener("mouseup", () => {
    if (currentLine) {
        currentLine = null; // Finalize the current line
    }
    isMouseDown = false; // Reset mouse down state
});

// Deselect emoji when clicking outside of the buttons (optional)
document.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLButtonElement) || 
        !event.target.closest('#button-container')) {
        selectedEmoji = null; // Deselect emoji if clicking outside the button container
    }
});

// Add event listeners to undo and redo buttons
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
clearButton.addEventListener('click', clear);