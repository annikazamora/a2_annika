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

function getPantryIngredients() {
  energy--; // Decrease energy by 1 each frame (60 frames per second, so this is 1 energy per second)

  return [
    {
      name: "Starter",
      img: allimg[6],
      x: width / 2 - 130,
      y: height / 2 - 50,
      w: 140,
      h: 140,
      counterName: "starterCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Salt",
      img: allimg[5],
      x: width / 2 - 110,
      y: height / 2 + 170,
      w: 105,
      h: 105,
      counterName: "saltCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Water",
      img: allimg[13],
      x: width / 2 - 12,
      y: height / 2 - 85,
      w: 165,
      h: 185,
      counterName: "waterCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Flour",
      img: allimg[11],
      x: width / 2 - 15,
      y: height / 2 + 125,
      w: 165,
      h: 170,
      counterName: "flourCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Apple",
      img: allimg[37],
      x: width / 4 - 210,
      y: height / 2 - 85,
      w: 145,
      h: 170,
      counterName: "appleCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Blueberry",
      img: allimg[38],
      x: width / 4 - 100,
      y: height / 2 - 85,
      w: 145,
      h: 170,
      counterName: "blueberryCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Cinnamon",
      img: allimg[39],
      x: width / 4 - 210,
      y: height / 2 + 125,
      w: 145,
      h: 170,
      counterName: "cinnamonCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Sugar",
      img: allimg[40],
      x: width / 4 - 100,
      y: height / 2 + 125,
      w: 145,
      h: 170,
      counterName: "sugarCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Tomato",
      img: allimg[41],
      x: (width / 4) * 3 + 10,
      y: height / 2 + 125,
      w: 145,
      h: 170,
      counterName: "tomatoCounter",
      useOpaqueHitbox: true,
    },
  ];
}

function drawPantry() {
  background(240);
  imageMode(CORNER);
  image(allimg[31], 0, 0, width, height); // background
  image(allimg[34], width / 2 - 250, 0, 550, 800); // middle pantry shelf
  image(allimg[36], 50, height / 2 - 170, 400, 550); //left pantry shelf
  image(allimg[36], width - 430, height / 2 - 120, 350, 500); // right pantry shelf

  const ingredients = getPantryIngredients();

  for (let ingredient of ingredients) {
    const hovering = isMouseOverOpaqueImage(
      ingredient.img,
      ingredient.x,
      ingredient.y,
      ingredient.w,
      ingredient.h,
    );

    tint(hovering ? 150 : 255);
    image(
      ingredient.img,
      ingredient.x,
      ingredient.y,
      ingredient.w,
      ingredient.h,
    );
    noTint();
  }

  screen = "pantry";

  if (pan == false) {
    tut = "Click on the ingredients";
    tut2 = "to collect them. Check";
    tut3 = "the recipe for counts!";
    image(allimg[54], width / 2 - 100, height - 150, 150, 175);
    prevScreen = currentScreen;
    currentScreen = "popup";
  }
}

function isMouseOverOpaqueImage(img, x, y, w, h) {
  if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) {
    return false;
  }

  let imgX = floor(map(mouseX, x, x + w, 0, img.width));
  let imgY = floor(map(mouseY, y, y + h, 0, img.height));

  imgX = constrain(imgX, 0, img.width - 1);
  imgY = constrain(imgY, 0, img.height - 1);

  let c = img.get(imgX, imgY);
  let alphaValue = c[3];

  return alphaValue > 10;
}

function pantryMousePressed() {
  const ingredients = getPantryIngredients();

  for (let ingredient of ingredients) {
    const clicked = isMouseOverOpaqueImage(
      ingredient.img,
      ingredient.x,
      ingredient.y,
      ingredient.w,
      ingredient.h,
    );

    if (clicked) {
      incrementIngredientCounter(ingredient.counterName);
      energy -= int(random(5, 10));
      click.setVolume(2);
      click.stop();
      click.play();
    }
  }
}

function incrementIngredientCounter(counterName) {
  if (counterName === "starterCounter") starterCounter++;
  else if (counterName === "saltCounter") saltCounter++;
  else if (counterName === "waterCounter") waterCounter++;
  else if (counterName === "flourCounter") flourCounter++;
  else if (counterName === "tomatoCounter") tomatoCounter++;
  else if (counterName === "appleCounter") appleCounter++;
  else if (counterName === "blueberryCounter") blueberryCounter++;
  else if (counterName === "cinnamonCounter") cinnamonCounter++;
  else if (counterName === "sugarCounter") sugarCounter++;
}

function drawIngredientCounter(ingredient) {
  let count = 0;

  if (ingredient.counterName === "starterCounter") count = starterCounter;
  else if (ingredient.counterName === "saltCounter") count = saltCounter;
  else if (ingredient.counterName === "waterCounter") count = waterCounter;
  else if (ingredient.counterName === "flourCounter") count = flourCounter;
  else if (ingredient.counterName === "tomatoCounter") count = tomatoCounter;
  else if (ingredient.counterName === "appleCounter") count = appleCounter;
  else if (ingredient.counterName === "blueberryCounter")
    count = blueberryCounter;
  else if (ingredient.counterName === "cinnamonCounter")
    count = cinnamonCounter;
  else if (ingredient.counterName === "sugarCounter") count = sugarCounter;

  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(
    count,
    ingredient.x + ingredient.w / 2,
    ingredient.y + ingredient.h + 20,
  );
}
