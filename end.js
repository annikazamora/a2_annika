function drawEnd() {
  // Background colour for the home screen
  background(180, 225, 220); // soft teal background

  // ---- Title text ----
  fill(30, 50, 60);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Congratulations! You made:", width / 2, 280);
  text("Sourdough Bread: " + bread, width / 2, 350);
  text("Money Earned: $" + bread * 5, width / 2, 420);

  const homeBtn = {
    x: width / 3,
    y: 570,
    w: 340,
    h: 100,
    label: "Make more bread",
  };

  const sleepBtn = {
    x: width - width / 3,
    y: 570,
    w: 340,
    h: 100,
    label: "Go to sleep",
  };

  // Draw all buttons
  drawButton(homeBtn);
  drawButton(sleepBtn);
}

function endMousePressed() {
  // For input checks, we only need x,y,w,h (label is optional)
  const homeBtn = { x: width / 3, y: 570, w: 340, h: 100 };
  const sleepBtn = { x: width - width / 3, y: 570, w: 340, h: 100 };

  // If home button is clicked, go to the home screen
  if (isHover(homeBtn)) {
    currentScreen = "home";
  }
  // If sleep button is clicked, go to the sleep screen
  else if (isHover(sleepBtn)) {
    currentScreen = "";
  }
}
