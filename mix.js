let mixProgress = 0;
let mixGoal = 120;
let mixDragging = false;
let mixLastAngle = null;
let mixEnergyTick = 0;
let mixBowl = { x: 0, y: 0, r: 120 };

function startMixStage() {
  mixProgress = 0;
  mixDragging = false;
  mixLastAngle = null;
  mixEnergyTick = 0;
}

function drawMix() {
  imageMode(CORNER);
  if (allimg[31]) image(allimg[31], 0, 0, width, height);
  else background(230, 220, 210);

  fill(84, 43, 20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(30);
  text("MIX THE DOUGH!", width / 2, 80);

  textSize(18);
  text("Drag around the bowl in circles", width / 2, 120);

  mixBowl.x = width / 2;
  mixBowl.y = height / 2 + 20;

  imageMode(CENTER);
  if (allimg[9]) image(allimg[9], mixBowl.x, mixBowl.y, 420, 280);

  noFill();
  stroke(220);
  strokeWeight(16);
  ellipse(mixBowl.x, mixBowl.y, 260, 260);

  let progressRatio = constrain(mixProgress / mixGoal, 0, 1);

  stroke(120, 75, 30);
  if (progressRatio >= 1) {
    ellipse(mixBowl.x, mixBowl.y, 260, 260);
  } else {
    arc(mixBowl.x, mixBowl.y, 260, 260, -90, -90 + 360 * progressRatio, OPEN);
  }

  noStroke();
  fill(84, 43, 20);
  textSize(22);
  text(`${floor((mixProgress / mixGoal) * 100)}%`, mixBowl.x, mixBowl.y);

  if (mixProgress >= mixGoal) {
    wbMixed = true;
    currentScreen = "workbench";
  }
}

function mixMousePressed() {
  mixDragging = true;
  mixLastAngle = atan2(mouseY - mixBowl.y, mouseX - mixBowl.x);
}

function mixMouseDragged() {
  if (!mixDragging || mixProgress >= mixGoal) return;

  const angle = atan2(mouseY - mixBowl.y, mouseX - mixBowl.x);
  const d = dist(mouseX, mouseY, mixBowl.x, mixBowl.y);

  if (mixLastAngle !== null) {
    let delta = angle - mixLastAngle;

    if (delta > PI) delta -= TWO_PI;
    if (delta < -PI) delta += TWO_PI;

    const movement = abs(delta);

    // Easier: count most circular-ish movement near the bowl
    if (d > 40 && d < 190 && movement > 0.015) {
      mixProgress += 1.2;
      mixEnergyTick += 1.2;

      if (mixEnergyTick >= 25) {
        energy = max(0, energy - 1);
        mixEnergyTick = 0;
      }
    }
  }

  mixLastAngle = angle;
}

function mixMouseReleased() {
  mixDragging = false;
  mixLastAngle = null;
}

function mixKeyPressed() {}
