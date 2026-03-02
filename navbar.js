// ------------------------------
// Navigation bar visuals
// ------------------------------
function drawNavbar() {
  // Draw a simple navbar at the top of the screen
  fill(255, 255, 255, 0); // Dark gray background for navbar
  rect(width / 2, 0, width, 250); // Draw navbar rectangle

  fill(0);
  textSize(25);
  textAlign(LEFT, CENTER);
  text("ENERGY: " + energy, 30, 35);

  textAlign(RIGHT, CENTER);
  text("BREAD: " + bread, width - 30, 35);

  // Button information
  const homeBtn = {
    x: 100,
    y: 80,
    w: 150,
    h: 50,
    label: "HOME",
  };

  const recipeBtn = {
    x: width - 100,
    y: 80,
    w: 150,
    h: 50,
    label: "RECIPE",
  };

  const endBtn = {
    x: 260,
    y: 80,
    w: 150,
    h: 50,
    label: "END DAY",
  };

  // Draw the buttons on the navbar
  drawButton(homeBtn);
  drawButton(recipeBtn);
  drawButton(endBtn);

  // ---- Cursor feedback ----
  // If the mouse is over the buttons, show a hand cursor so the player knows it is clickable.
  const over = isHover(homeBtn) || isHover(recipeBtn) || isHover(endBtn);
  cursor(over ? HAND : ARROW);
}

// ------------------------------------------------------------
// Mouse input for the navigation bar
// ------------------------------------------------------------
// Called from main.js on every mouse click, regardless of the current screen
function navbarMousePressed() {
  const recipeBtn = { x: width - 100, y: 85, w: 150, h: 50 };
  const endBtn = { x: 260, y: 85, w: 150, h: 50 };
  const homeBtn = { x: 100, y: 85, w: 150, h: 50 };

  // Send the player to the recipe or end screens
  if (isHover(recipeBtn)) {
    currentScreen = "recipe";
  } else if (isHover(endBtn)) {
    currentScreen = "end";
  } else if (currentScreen !== "home" && isHover(homeBtn)) {
    currentScreen = "home";
  }
}
