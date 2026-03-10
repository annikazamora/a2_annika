// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawPantry() → what the pantry screen looks like
// 2) input handlers → how the player returns to the home screen
// 3) helper functions specific to this screen

// ------------------------------
// Main draw function for pantry screen
// ------------------------------
// drawPantry() is called from main.js
// only when currentScreen === "pantry"

function drawPantry() {
  // Light neutral background
  background(240);

  // ---- Draw shelves ----
  fill(184, 164, 126); // shelf color
  const shelfHeight = 20;
  const shelfYs = [height * 0.5, height * 0.9];
  shelfYs.forEach((y) => {
    rect(width / 2, y, width, shelfHeight);
  });

  // ---- INGREDIENTS ----
  // flour
  const flourBagWidthBtn = 120;
  const flourBagHeightBtn = 180;
  const flourBagXBtn = width * 0.25;
  const flourBagYBtn = shelfYs[0] - flourBagHeightBtn / 2;

  // water
  const waterBtn = {
    w: 120,
    h: 180,
    x: width * 0.5,
    y: shelfYs[0] - 90,
    label: "Water",
  };

  // sourdough starter
  const starterBtn = {
    w: 80,
    h: 140,
    x: width * 0.25,
    y: shelfYs[1] - 70,
    label: "Starter",
  };

  // salt
  const saltBtn = {
    w: 50,
    h: 100,
    x: width * 0.75,
    y: shelfYs[1] - 50,
    label: "Salt",
  };

  // Draw all buttons
  drawButton(waterBtn);
  drawButton(starterBtn);
  drawButton(saltBtn);

  text(waterCounter, waterBtn.x, waterBtn.y + 20);
  text(saltCounter, saltBtn.x, saltBtn.y + 20);
  text(starterCounter, starterBtn.x, starterBtn.y + 20);
}

// ------------------------------
// Mouse input for instructions screen
// ------------------------------
// Called from main.js only when currentScreen === "pantry"
function pantryMousePressed() {
  const backBtn = { x: width / 2, y: 560, w: 220, h: 70 };

  const waterBtn = { x: width * 0.5, y: height * 0.5 - 90, w: 120, h: 180 };
  const starterBtn = { x: width * 0.25, y: height * 0.9 - 70, w: 80, h: 140 };
  const saltBtn = { x: width * 0.75, y: height * 0.9 - 50, w: 50, h: 100 };

  // If the button is clicked, return to the home screen
  if (isHover(backBtn)) {
    currentScreen = "home";
    return;
  }

  //checks if ingredients are clicked
  if (isHover(starterBtn)) {
    starterCounter++;
    energy = energy - int(random(4, 8));
  }
  if (isHover(saltBtn)) {
    saltCounter++;
    energy = energy - int(random(4, 8));
  }

  if (isHover(waterBtn)) {
    waterCounter++;
    energy = energy - int(random(4, 8));
  }
}

// ------------------------------
// Keyboard input for instructions screen
// ------------------------------
// Provides keyboard-only navigation
function pantryKeyPressed() {
  // ESC is a common “go back” key in games and apps
  if (keyCode === ESCAPE) {
    currentScreen = "home";
  }

  // B key is an additional, explicit shortcut for “back”
  if (key === "b" || key === "B") {
    currentScreen = "home";
  }
}

// ------------------------------
// Button drawing helper (instructions screen)
// ------------------------------
// This function is only responsible for drawing the button.
// It is kept separate so the visual style can be changed
// without touching input or game logic.
function drawPantryButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  // Check whether the mouse is hovering over the button
  const hover = isHover({ x, y, w, h });

  noStroke();

  // Subtle colour change on hover for visual feedback
  fill(hover ? color(200, 200, 255, 200) : color(220, 220, 255, 170));

  // Draw the button shape
  rect(x, y, w, h, 12);

  // Draw the button text
  fill(0);
  textSize(26);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}
