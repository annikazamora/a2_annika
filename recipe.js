// ------------------------------
// Recipe page-turn hitboxes
// ------------------------------
const recipeNextBtn = { x: 1070, y: 220, w: 120, h: 120 }; // top right of book
const recipePrevBtn = { x: 275, y: 220, w: 120, h: 120 }; // top left of book

// ------------------------------
// Main draw function for recipe screen
// ------------------------------
function drawRecipe() {
  background(235, 223, 226);

  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // recipe background image
  image(allimg[51], width / 2, 440, 1200, 650); // recipe book image

  fill(0);
  textAlign(LEFT, CENTER);
  textSize(25);

  // ------------------------------
  // PAGE 1
  // ------------------------------
  if (recipePage === 0) {
    textSize(40);
    text("Plain Sourdough", 240, 220);
    textSize(25);
    text("Today we are making my", 240, 300);
    text("favourite sourdough bread!", 240, 335);

    text("We have multiple orders,", 240, 400);
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
    text("bake the dough in the oven", 760, 625);
    text("at 175°C.", 760, 660);
  }

  // ------------------------------
  // PAGE 2
  // ------------------------------
  else if (recipePage === 1) {
    textSize(40);
    text("Sun-Dried Tomato", 240, 220);
    text("Sourdough", 240, 270);
    textSize(25);
    text("This recipe requires", 240, 350);
    text("an extra special ingredient!", 240, 385);

    text("You can keep checking", 240, 450);
    text("the counters to see", 240, 485);
    text("what is still missing.", 240, 520);

    text("Ingredients:", 760, 200);
    text("- Flour: " + flourCounter + "/3", 760, 250);
    text("- Water: " + waterCounter + "/2", 760, 305);
    text("- Starter: " + starterCounter + "/1", 760, 355);
    text("- Salt: " + saltCounter + "/1", 760, 405);
    text("- Tomatoes: " + tomatoCounter + "/2", 760, 455);

    text("Combine all ingredients,", 760, 590);
    text("bake at 175°C.", 760, 625);
  }

  // ------------------------------
  // PAGE 3
  // ------------------------------
  else if (recipePage === 2) {
    textSize(40);
    text("Blueberry Crumble", 240, 220);
    text("Sourdough", 240, 270);
    textSize(25);
    text("This recipe requires", 240, 350);
    text("two new ingredients!", 240, 385);

    text("You can keep checking", 240, 450);
    text("the counters to see", 240, 485);
    text("what is still missing.", 240, 520);

    text("Ingredients:", 760, 200);
    text("- Flour: " + flourCounter + "/3", 760, 250);
    text("- Water: " + waterCounter + "/2", 760, 305);
    text("- Starter: " + starterCounter + "/1", 760, 355);
    text("- Salt: " + saltCounter + "/1", 760, 405);
    text("- Blueberries: " + blueberryCounter + "/3", 760, 455);
    text("- Sugar: " + sugarCounter + "/2", 760, 505);

    text("Combine all ingredients,", 760, 590);
    text("bake at 175°C.", 760, 625);
  }

  // ------------------------------
  // PAGE 4
  // ------------------------------
  else if (recipePage === 3) {
    textSize(40);
    text("Apple Cinnamon", 240, 220);
    text("Sourdough", 240, 270);
    textSize(25);
    text("This recipe is perfect", 240, 350);
    text("for the Fall time!", 240, 385);

    text("You can keep checking", 240, 450);
    text("the counters to see", 240, 485);
    text("what is still missing.", 240, 520);

    text("Ingredients:", 760, 200);
    text("- Flour: " + flourCounter + "/3", 760, 250);
    text("- Water: " + waterCounter + "/2", 760, 305);
    text("- Starter: " + starterCounter + "/1", 760, 355);
    text("- Salt: " + saltCounter + "/1", 760, 405);
    text("- Apples: " + appleCounter + "/3", 760, 455);
    text("- Cinnamon: " + cinnamonCounter + "/1", 760, 505);

    text("Combine all ingredients,", 760, 590);
    text("bake at 175°C.", 760, 625);
  }

  // Optional: page number
  textAlign(CENTER, CENTER);
  textSize(20);
  text(
    "Page " + (recipePage + 1) + " / " + (LAST_RECIPE_PAGE + 1),
    width / 2 - 100,
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
