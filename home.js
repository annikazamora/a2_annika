// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawHome() → what the home/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons

// ------------------------------------------------------------
// Home screen visuals
// ------------------------------------------------------------
// drawHome() is called from main.js only when:
// currentScreen === "home"
function drawHome() {
  // Background colour for the home screen
  background(180, 225, 220); // soft teal background

  // ---- Title text ----
  fill(30, 50, 60);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Pantry", width / 5, 180);

  fill(30, 50, 60);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Workbench", width / 2, 180);

  fill(30, 50, 60);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Oven", width - width / 5, 180);

  // ---- Buttons (data only) ----
  // These objects store the position/size/label for each button.
  // Using objects makes it easy to pass them into drawButton()
  // and also reuse the same information for hover checks.
  const pantryBtn = {
    x: width / 5,
    y: 520,
    w: 240,
    h: 420,
    label: "",
  };

  const workBtn = {
    x: width / 2,
    y: 570,
    w: 340,
    h: 320,
    label: "",
  };

  const ovenBtn = {
    x: width - width / 5,
    y: 520,
    w: 240,
    h: 420,
    label: "",
  };

  // Draw all buttons
  drawButton(pantryBtn);
  drawButton(workBtn);
  drawButton(ovenBtn);

  // ---- Cursor feedback ----
  // If the mouse is over the buttons, show a hand cursor so the player knows it is clickable.
  const over = isHover(workBtn) || isHover(pantryBtn) || isHover(ovenBtn);
  cursor(over ? HAND : ARROW);
}

// ------------------------------------------------------------
// Mouse input for the home screen
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "home"
function homeMousePressed() {
  // For input checks, we only need x,y,w,h (label is optional)
  const pantryBtn = { x: width / 5, y: 520, w: 240, h: 420 };
  const workBtn = { x: width / 2, y: 570, w: 340, h: 320 };
  const ovenBtn = { x: width - width / 5, y: 520, w: 240, h: 420 };

  // If workbench is clicked, go to the workbench screen
  if (isHover(workBtn)) {
    currentScreen = "workbench";
  }
  // If INSTRUCTIONS is clicked, go to the instructions screen
  else if (isHover(pantryBtn)) {
    currentScreen = "pantry";
  }
  // If OVEN is clicked, go to the oven screen
  else if (isHover(ovenBtn)) {
    currentScreen = "oven";
  }
}

// ------------------------------------------------------------
// Helper: drawButton()
// ------------------------------------------------------------
// This function draws a button and changes its appearance on hover.
// It does NOT decide what happens when you click the button.
// That logic lives in homeMousePressed() above.
//
// Keeping drawing separate from input/logic makes code easier to read.
function drawButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check if the mouse is over the button rectangle
  const hover = isHover({ x, y, w, h });

  noStroke();

  // ---- Visual feedback (hover vs not hover) ----
  // This is a common UI idea:
  // - normal state is calmer
  // - hover state is brighter + more “active”
  //
  // We also add a shadow using drawingContext (p5 lets you access the
  // underlying canvas context for effects like shadows).
  if (hover) {
    fill(255, 200, 150, 220); // warm coral on hover

    // Shadow settings (only when hovered)
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 180, 120);
  } else {
    fill(255, 240, 210, 210); // soft cream base

    // Softer shadow when not hovered
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(220, 220, 220);
  }

  // Draw the rounded rectangle button
  rect(x, y, w, h, 14);

  // Important: reset shadow so it does not affect other drawings
  drawingContext.shadowBlur = 0;

  // Draw the label text on top of the button
  fill(40, 60, 70);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}
