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
  return [
    {
      name: "Starter",
      img: allimg[6],
      x: width / 2 - 160,
      y: height / 2 - 60,
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
      y: height / 2 + 100,
      w: 165,
      h: 185,
      counterName: "waterCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Flour",
      img: allimg[11],
      x: width / 2 - 25,
      y: height / 2 - 90,
      w: 165,
      h: 170,
      counterName: "flourCounter",
      useOpaqueHitbox: true,
    },
  ];
}

function drawPantry() {
  background(240);
  imageMode(CORNER);
  image(allimg[28], 0, 0, width, height);

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

    drawIngredientCounter(ingredient);
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
      energy -= int(random(4, 8));
    }
  }
}

function incrementIngredientCounter(counterName) {
  if (counterName === "starterCounter") starterCounter++;
  if (counterName === "saltCounter") saltCounter++;
  if (counterName === "waterCounter") waterCounter++;
  if (counterName === "flourCounter") flourCounter++;
}

function drawIngredientCounter(ingredient) {
  let count = 0;

  if (ingredient.counterName === "starterCounter") count = starterCounter;
  if (ingredient.counterName === "saltCounter") count = saltCounter;
  if (ingredient.counterName === "waterCounter") count = waterCounter;
  if (ingredient.counterName === "flourCounter") count = flourCounter;

  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(
    count,
    ingredient.x + ingredient.w / 2,
    ingredient.y + ingredient.h + 20,
  );
}
