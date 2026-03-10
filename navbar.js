// ------------------------------
// Navigation bar visuals
// ------------------------------
function drawNavbar() {
  // Draw a simple navbar at the top of the screen
  fill(255, 255, 255, 0); // Dark gray background for navbar
  rect(width / 2, 0, width, 250); // Draw navbar rectangle

  //Counters and labels
  stroke(84, 43, 20);
  fill(84, 43, 20);
  textSize(25);
  strokeWeight(1);
  textAlign(LEFT, CENTER);
  text("ENERGY:", 35, 35);

  textAlign(RIGHT, CENTER);
  text("BREAD: " + bread, width - 30, 35);

  // Energy bar
  if (energy < 30) {
    fill(255, 0, 0); // Red color for low energy
  } else if (energy < 60) {
    fill(255, 212, 23); // Yellow color for medium energy
  } else {
    fill(27, 158, 22); // Green color for high energy
  }
  rectMode(CORNER);
  rect(155, 30, energy * 3, 20, 20);

  // Button information
  const homeBtn = {
    x: 100,
    y: 90,
    w: 130,
    h: 50,
    label: "HOME",
  };

  const recipeBtn = {
    x: width - 210,
    y: 90,
    w: 370,
    h: 50,
    label: "RECIPE INSTRUCTIONS",
  };

  const endBtn = {
    x: 260,
    y: 90,
    w: 170,
    h: 50,
    label: "END DAY",
  };

  // Draw the buttons on the navbar
  const disabled = currentScreen === "sleep";
  drawButton(homeBtn, disabled);
  drawButton(recipeBtn, disabled);
  drawButton(endBtn, disabled);
}

// ------------------------------------------------------------
// Mouse input for the navigation bar
// ------------------------------------------------------------
// Called from main.js on every mouse click, regardless of the current screen
function navbarMousePressed() {
  if (currentScreen === "sleep") return; // buttons are disabled on sleep screen

  const recipeBtn = { x: width - 210, y: 90, w: 370, h: 50 };
  const endBtn = { x: 260, y: 90, w: 170, h: 50 };
  const homeBtn = { x: 100, y: 90, w: 150, h: 50 };

  // Send the player to the recipe or end screens
  if (isHover(recipeBtn)) {
    currentScreen = "recipe";
  } else if (isHover(endBtn)) {
    currentScreen = "end";
  } else if (currentScreen !== "home" && isHover(homeBtn)) {
    currentScreen = "home";
  }
}
