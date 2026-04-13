function drawPopup() {
  // Draw the popup background
  imageMode(CENTER);
  image(allimg[58], width / 2, height / 2, 800, 500); // Popup background image
  fill(84, 43, 20);
  text(tut, width / 2, height / 2 - 40);
  text(tut2, width / 2, height / 2);
  text(tut3, width / 2, height / 2 + 40);

  const exitBtn = {
    x: 970,
    y: 200,
    w: 30,
    h: 30,
    label: "X",
  };

  // Draw all buttons
  drawButton(exitBtn);
}

function popupMousePressed() {
  const exitBtn = { x: 970, y: 200, w: 30, h: 30 };

  if (
    isHover(exitBtn) &&
    prevScreen == "home" &&
    lev3 == false &&
    inst == true &&
    eng == true
  ) {
    lev3 = true; // Mark the energy tutorial as completed
    currentScreen = "home";
  }

  if (isHover(exitBtn) && prevScreen == "home" && day2 == false && day == 2) {
    day2 = true; // Mark the day 2 tutorial as completed
    currentScreen = "home";
  }

  if (
    isHover(exitBtn) &&
    prevScreen == "home" &&
    eng == false &&
    inst == true
  ) {
    eng = true; // Mark the energy tutorial as completed
    currentScreen = "home";
  }

  if (
    isHover(exitBtn) &&
    prevScreen == "workbench" &&
    lev2 == false &&
    work == true
  ) {
    lev2 = true;
    currentScreen = "workbench";
  }

  if (isHover(exitBtn) && prevScreen == "home" && inst == false) {
    inst = true; // Mark the recipe tutorial as completed
    currentScreen = "home";
  }

  if (isHover(exitBtn) && prevScreen == "recipe" && recp == false) {
    recp = true; // Mark the recipe tutorial as completed
    currentScreen = "recipe";
    prevScreen = "home";
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

  if (isHover(exitBtn) && prevScreen == "shop" && shp == false) {
    shp = true; // Mark the shop tutorial as completed
    currentScreen = "shop";
  }
}
