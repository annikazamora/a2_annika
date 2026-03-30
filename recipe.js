// ------------------------------
// Recipe page-turn hitboxes
// ------------------------------
const recipeNextBtn = { x: 1140, y: 95, w: 120, h: 120 }; // top right
const recipePrevBtn = { x: 205, y: 95, w: 120, h: 120 }; // top left

// ------------------------------
// Main draw function for recipe screen
// ------------------------------
function drawRecipe() {
  background(235, 223, 226);

  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // recipe background image
  image(allimg[3], width / 2, 440, 1200, 650); // recipe book image

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(25);

  // ------------------------------
  // PAGE 1
  // ------------------------------
  if (recipePage === 0) {
    text("Today we are making my", 240, 300);
    text("favourite sourdough bread!", 240, 335);

    text("We have 3 orders,", 240, 400);
    text("but we might not be able", 240, 435);
    text("to make them all today.", 240, 470);

    text("Balancing our energy is", 240, 535);
    text("just as important as", 240, 570);
    text("filling orders!", 240, 605);

    text("Collect the following", 760, 200);
    text("items from the pantry.", 760, 235);
    text("Ingredients:", 760, 290);
    text("- Flour: " + flourCounter + "/3", 760, 340);
    text("- Water: " + waterCounter + "/2", 760, 390);
    text("- Starter: " + starterCounter + "/1", 760, 440);
    text("- Salt: " + saltCounter + "/1", 760, 490);

    text("Combine all the ingredients", 760, 555);
    text("on the workbench, then", 760, 590);
    text("bake the dough in the oven.", 760, 625);
  }

  // ------------------------------
  // PAGE 2
  // ------------------------------
  else if (recipePage === 1) {
    text("Step 1: Pantry", 240, 250);
    text("Find all the ingredients", 240, 300);
    text("you need for the recipe.", 240, 335);

    text("You can keep checking", 240, 400);
    text("the counters to see", 240, 435);
    text("what is still missing.", 240, 470);

    text("Current progress:", 760, 250);
    text("- Flour: " + flourCounter + "/3", 760, 320);
    text("- Water: " + waterCounter + "/2", 760, 370);
    text("- Starter: " + starterCounter + "/1", 760, 420);
    text("- Salt: " + saltCounter + "/1", 760, 470);

    text("Once everything is collected,", 760, 550);
    text("go to the workbench.", 760, 585);
  }

  // ------------------------------
  // PAGE 3
  // ------------------------------
  else if (recipePage === 2) {
    text("Step 2: Workbench + Oven", 240, 250);
    text("Drag ingredients into the bowl", 240, 300);
    text("on the workbench to combine them.", 240, 335);

    text("After that, move to the oven", 240, 420);
    text("to bake the bread.", 240, 455);

    text("Remember:", 760, 250);
    text("- Watch your energy", 760, 320);
    text("- Finish orders before resting", 760, 370);
    text("- Balance speed and accuracy", 760, 420);

    text("Good luck baking!", 760, 540);
  }

  // Optional: page number
  textAlign(CENTER, CENTER);
  textSize(20);
  text(
    "Page " + (recipePage + 1) + " / " + (LAST_RECIPE_PAGE + 1),
    width / 2,
    685,
  );

  // Optional: invisible click zones for debugging
  // noFill();
  // stroke(255, 0, 0);
  // rectMode(CENTER);
  // rect(recipePrevBtn.x, recipePrevBtn.y, recipePrevBtn.w, recipePrevBtn.h);
  // rect(recipeNextBtn.x, recipeNextBtn.y, recipeNextBtn.w, recipeNextBtn.h);
}

// ------------------------------
// Mouse input for recipe screen
// ------------------------------
function recipeMousePressed() {
  // top right = next page
  if (isHover(recipeNextBtn) && recipePage < LAST_RECIPE_PAGE) {
    recipePage++;
  }

  // top left = previous page
  else if (isHover(recipePrevBtn) && recipePage > 0) {
    recipePage--;
  }
}

// ------------------------------
// Keyboard input for recipe screen
// ------------------------------
function recipeKeyPressed() {
  if (
    (key === "d" || key === "D" || keyCode === RIGHT_ARROW) &&
    recipePage < LAST_RECIPE_PAGE
  ) {
    recipePage++;
  } else if (
    (key === "a" || key === "A" || keyCode === LEFT_ARROW) &&
    recipePage > 0
  ) {
    recipePage--;
  }
}
