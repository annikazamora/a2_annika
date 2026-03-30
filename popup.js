function drawPopup() {
  // Draw the popup background
  fill(255, 255, 255, 240); // White with some transparency
  rect(width / 2, height / 2, 470, 500, 10); // Rounded rectangle
  fill(84, 43, 20);
  text(tut, width / 2, height / 2 - 20);
  text(tut2, width / 2, height / 2 + 20);
  text(tut3, width / 2, height / 2 + 60);

  const exitBtn = {
    x: 870,
    y: 150,
    w: 30,
    h: 30,
    label: "X",
  };

  // Draw all buttons
  drawButton(exitBtn);
}

function popupMousePressed() {
  const exitBtn = { x: 870, y: 150, w: 30, h: 30 };

  if (isHover(exitBtn) && prevScreen == "home" && inst == false) {
    inst = true; // Mark the recipe tutorial as completed
    currentScreen = "home";
  }

  if (isHover(exitBtn) && prevScreen == "recipe" && recp == false) {
    recp = true; // Mark the recipe tutorial as completed
    currentScreen = "recipe";
  }

  if (isHover(exitBtn) && prevScreen == "pantry" && pan == false) {
    pan = true; // Mark the pantry tutorial as completed
    currentScreen = "pantry";
  }

  if (isHover(exitBtn) && prevScreen == "workbench" && work == false) {
    work = true; // Mark the workbench tutorial as completed
    currentScreen = "workbench";
  }

  if (isHover(exitBtn) && prevScreen == "oven" && ovn == false) {
    ovn = true; // Mark the oven tutorial as completed
    currentScreen = "oven";
  }

  if (isHover(exitBtn) && prevScreen == "home" && eng == false) {
    eng = true; // Mark the energy tutorial as completed
    currentScreen = "home";
  }
}
