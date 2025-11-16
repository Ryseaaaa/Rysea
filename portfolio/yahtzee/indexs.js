let rollsLeft = 3; // het aantal rollen die in de header moeten staan
let rollDisplay = document.querySelector("#rolls");

let highscore = 0;
let p1Turn = true; //true voor player 1, false voor player 2

//DICE (i really should use objects here huh? well im too lazy)
let dice = document.querySelectorAll(".dice"); //store dice html
let diceValue = [0, 0, 0, 0, 0]; //store dice values
let diceImages = [
  "Images/Dice-1.png",
  "Images/Dice-2.png",
  "Images/Dice-3.png",
  "Images/Dice-4.png",
  "Images/Dice-5.png",
  "Images/Dice-6.png",
]; //store dice images

let turnCount = 0;

let diceLocked = [];
for (let i = 0; i < dice.length; i++) {
  diceLocked.push(false);
} //store dice locked state

//DICE, but as objects

//Create Dice Class
class Dice {
  constructor(value, hold, path, image) {
    this.value = value;
    this.hold = hold;
    this.path = path;
    this.image = image;
  }
}

//Create Array of Dice Objects
let diceObject = [];
for (i = 0; i < 5; i++) {
  diceObject.push(new Dice(0, false, null, null));
}

for (i = 0; i < 5; i++) {
  //Assign Respective HTML Path to Objects
  diceObject[i].path = dice[i];
  //Assign Image 1 to all dice
  diceObject[i].image = diceImages[0];
  //Create Dice Hold Onclick Event
}

//Create Dice Hold Onclick Event
//This is the worst code in existence but I couldn't figure out how else to get the correct index number for each dice without manually writing it out 5 times for every die.
//For some reason using the i from the for loop as index doesn't work here, so I had to get a little creative
for (i = 0; i < 5; i++) {
  diceObject[i].path.onclick = function () {
    if (diceObject[this.id.slice(3, 4) - 1].value != 0) {
      diceObject[this.id.slice(3, 4) - 1].hold =
        !diceObject[this.id.slice(3, 4) - 1].hold;
    }

    if (diceObject[this.id.slice(3, 4) - 1].hold) {
      diceObject[this.id.slice(3, 4) - 1].path.setAttribute(
        "style",
        "filter: contrast(.2)"
      );
    } else {
      diceObject[this.id.slice(3, 4) - 1].path.setAttribute(
        "style",
        "filter: contrast(1)"
      );
    }
  };
}

// !!!!!!!! MIGHT BE UPDATEABLE USING FOREACH

//deze functie voert uit wanneer de speler op roll klikt
function roll() {
  if (rollsLeft > 0) {
    diceRoll();
    diceImageUpdate();
    calcPoints();
  }
  rollDisplay.textContent = rollsLeft;
}

//Import Scores
let scoreIndicatorTmp = [];
let scoreIndicator = document.querySelectorAll(".temp--score");
let scoreLocked = document.querySelectorAll(".locked--score");
let scoreUsed = [];
let scores = [];

//
class Score {
  constructor(indicator, locked, used) {
    this.indicator = indicator;
    this.locked = locked;
    this.used = used;
  }
}
scoreLocked.forEach((element, index) => {
  scores.push(new Score());
  scores[index].locked = 0;
});

//Calculate Scores
function calcPoints() {
  let counter = new Array(null, 0, 0, 0, 0, 0, 0);

  for (i = 0; i < 5; i++) {
    counter[diceObject[i].value]++;
  }

  let total = 0;
  for (i = 0; i < 5; i++) {
    total += diceObject[i].value;
  }

  //N of same value (aces through sixes)
  for (i = 0; i <= 5; i++) {
    scoreIndicatorTmp[i] = (i + 1) * counter[i + 1];
  }

  //3 of a Kind
  if (Math.max(...counter) >= 3) {
    scoreIndicatorTmp[6] = total;
  } else {
    scoreIndicatorTmp[6] = 0;
  }

  //4 of a Kind
  if (Math.max(...counter) >= 4) {
    scoreIndicatorTmp[7] = total;
  } else {
    scoreIndicatorTmp[7] = 0;
  }

  //Full House
  if (counter.includes(3) && counter.includes(2)) {
    scoreIndicatorTmp[8] = 25;
  } else {
    scoreIndicatorTmp[8] = 0;
  }

  //Straights
  let inARow = 0;
  let maxInARow = 0;
  for (i = 1; i <= 6; i++) {
    if (counter[i] >= 1) {
      inARow++;
      maxInARow = Math.max(inARow, maxInARow);
    } else {
      inARow = 0;
    }
  }
  //Small Straight
  if (maxInARow >= 4) {
    scoreIndicatorTmp[9] = 30;
  } else {
    scoreIndicatorTmp[9] = 0;
  }

  //Large Straight
  if (maxInARow >= 5) {
    scoreIndicatorTmp[10] = 40;
  } else {
    scoreIndicatorTmp[10] = 0;
  }

  //Yahtzee
  if (Math.max(...counter) >= 5) {
    scoreIndicatorTmp[11] = 50;
  } else {
    scoreIndicatorTmp[11] = 0;
  }

  //Chance
  scoreIndicatorTmp[12] = total;

  updateScoreIndicator();
}

//Update Scores Indicator
function updateScoreIndicator() {
  scoreIndicator.forEach((element, index) => {
    element.innerHTML = 0;

    //Update
    if (p1Turn && index < 13) {
      element.innerHTML = scoreIndicatorTmp[index];
      scores[index].indicator = scoreIndicatorTmp[index];
    } else if (!p1Turn && index >= 13) {
      element.innerHTML = scoreIndicatorTmp[index - 13];
      scores[index].indicator = scoreIndicatorTmp[index - 13];
    }
  });
}

//onclick event for all scores that locks the score if it hasn't already
function lockScore(index) {
  if (
    !scores[index].used &&
    rollsLeft != 3 &&
    //check if points are clicked on the correct player's side
    ((p1Turn && index < 13) || (!p1Turn && index >= 13))
  ) {
    let offset = 0;
    switch (index) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        offset = 0;
        break;
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        offset = 3;
        break;
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
        offset = 7;
        break;
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
        offset = 10;
        break;
      default:
        break;
    }

    //set score to used
    scores[index].used = !scores[index].used;
    scoreIndicator[index].setAttribute("style", "filter: contrast(.2)");
    //set locked score with correct offset
    scores[index + offset].locked = scores[index].indicator;
    scoreLocked[index + offset].innerHTML = scores[index + offset].locked;

    //Calculate sums
    //Instead of writing p1 and p2 separately, could use an offset on every index when !p1Turn
    //Offset for p2
    let offsetLocked = 0;
    if (!p1Turn) {
      offsetLocked = 20;
    }

    //Subtotal
    let sum = 0;
    for (i = 0; i < 6; i++) {
      if (!(scores[i + offsetLocked].locked === undefined))
        sum += scores[i + offsetLocked].locked;
    }
    scores[6 + offsetLocked].locked = sum;
    scoreLocked[6 + offsetLocked].innerHTML = sum;

    //Bonus
    //if subtotal >= 63, set bonus to 35
    if (scores[6 + offsetLocked].locked >= 63) {
      scores[7 + offsetLocked].locked = 35;
      scoreLocked[7 + offsetLocked].innerHTML = 35;
    }

    //Total Top
    sum += scores[7 + offsetLocked].locked;
    scores[8 + offsetLocked].locked = sum;
    scoreLocked[8 + offsetLocked].innerHTML = sum;
    scores[17 + offsetLocked].locked = sum;
    scoreLocked[17 + offsetLocked].innerHTML = sum;

    //Total Bottom
    sum = 0;
    for (i = 9; i <= 15; i++) {
      if (!(scores[i + offsetLocked].locked === undefined))
        sum += scores[i + offsetLocked].locked;
    }
    scores[16 + offsetLocked].locked = sum;
    scoreLocked[16 + offsetLocked].innerHTML = sum;
    scores[18 + offsetLocked].locked = sum;
    scoreLocked[18 + offsetLocked].innerHTML = sum;
    //Grand total
    sum = scores[18 + offsetLocked].locked + scores[17 + offsetLocked].locked;
    scores[19 + offsetLocked].locked = sum;
    scoreLocked[19 + offsetLocked].innerHTML = sum;

    //set highscore
    highscore = Math.max(highscore, scores[19].locked, scores[39].locked);
    document.getElementById("highscore").innerHTML = highscore;

    swapTurns();
    turnCount++;
  }

  if (turnCount == 26) {
    displayWinner();
  }
}

function swapTurns() {
  resetScores();
  resetDice();

  p1Turn = !p1Turn;
  rollsLeft = 3;

  //update display
  rollDisplay.textContent = rollsLeft;
  updateNames();
}

function resetScores() {
  scoreIndicator.forEach((element) => {
    element.innerHTML = 0;
  });
}

function resetDice() {
  diceObject.forEach((element) => {
    element.value = 0;

    //Undo Hold
    element.path.setAttribute("style", "filter: contrast(1)");
    element.hold = false;

    //Reset Image
    element.path.src = diceImages[0];
  });
}

function diceRoll() {
  for (let i = 0; i < dice.length; i++) {
    //Object
    if (!diceObject[i].hold) {
      diceObject[i].value = 1 + Math.floor(6 * Math.random());
    }
  }
  rollsLeft -= 1;
}

function diceImageUpdate() {
  for (let i = 0; i < dice.length; i++) {
    diceObject[i].path.src = diceImages[diceObject[i].value - 1];
  }
}

let names = [];

//Name Input
let name1Path = document.getElementById("name1");
let name2Path = document.getElementById("name2");
let displayName1 = document.getElementById("displayName1");
let displayName2 = document.getElementById("displayName2");

name1Path.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    updateNames();
  }
});
name2Path.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    updateNames();
  }
});

function updateNames() {
  //Update Variables
  names[1] = name1Path.value;
  names[2] = name2Path.value;

  //Update display
  displayName1.innerHTML = names[1];
  displayName2.innerHTML = names[2];
  if (p1Turn) {
    document.getElementById("turn").innerHTML = names[1];
  } else {
    document.getElementById("turn").innerHTML = names[2];
  }
}

function resetGame() {
  //reset turn count
  turnCount = 0;

  //set p1
  p1Turn = true;
  updateNames();

  //reset score indicators and dice
  resetScores();
  resetDice();
  rollsLeft = 3;
  rollDisplay.innerHTML = rollsLeft;

  //reset locked scores
  scores.forEach((element, index) => {
    element.locked = 0;
    scoreLocked[index].innerHTML = 0;

    element.used = false;
    element.indicator = 0;
  });

  scoreIndicator.forEach((element) => {
    element.setAttribute("style", "filter: contrast(1)");
  });

  //reset winner display
  document.getElementById("winner").innerHTML = "______";
}

function displayWinner() {
  if (scores[19].locked > scores[39].locked) {
    document.getElementById("winner").innerHTML = names[1];
  } else if (scores[39].locked > scores[19].locked) {
    document.getElementById("winner").innerHTML = names[2];
  } else {
    document.getElementById("winner").innerHTML = "It's a tie!";
  }

  rollsLeft = 0;
  rollDisplay.innerHTML = 0;
}
