// link to all html elements ids&classes
const playButton = document.getElementById("play-btn");
const highscoreButton = document.getElementById("highscore-btn");
const questionContainer = document.getElementById("question-container");
const score = document.getElementById("score");
const pbandhbControls = document.getElementById("controls");
const introContainer = document.getElementById("intro-container");
const questionElement = document.getElementById("Question");
const answerBtnElement = document.getElementById("answer-btns");
const gameOver = document.getElementById("Time-out");
// found out you can actually use querySelector to not only select classes but you can also select ids too
const btnClass = document.querySelector(".btn");
const timer = document.getElementById("count-down-timer");

// I hid the intro in css because I am trying to keep everything on one page so this is me un hiding the intro that way you can actually start the quiz
pbandhbControls.classList.remove("Controls");
introContainer.classList.remove("hideintro");
// variable to shuffle questions
let shuffledQuestions, questionIndex;
// when I click on play the game is started
playButton.addEventListener("click", startgame);
// setting const for score points
const scorePoints = 50;
// adding a variable so I can change the score
let scoreP = 0;
// const because timer will default to 90 seconds
const startingSecs = 90;
// let because time needs to change from 90 down to 0
let time = startingSecs;
// creating a timer for the game
function countdown() {
  setInterval(() => {
    --time;
    if (time >= 0) {
      timer.innerHTML = time;
    }
    if (time <= 1) {
      clearInterval();
      time = startingSecs;
      localStorage.setItem("MostRecentScore", scoreP);
      gameOver.classList.remove("game-over");
      questionContainer.classList.add("Hidequestion");
    }
  }, 1000);
}
// function to start game
function startgame() {
  // hide the intro and and start controls and also hides the game over screen
  pbandhbControls.classList.add("Controls");
  introContainer.classList.add("hideintro");
  gameOver.classList.add("game-over");
  // sets score to 0
  scoreP = 0;
  score.innerText = 0;
  // starts timer
  time = startingSecs;
  countdown();
  // make sure it starts before the questions actually appear
  // found out this cool trick where you can use .sort to sort whatever you want by a number. it can sort positive and negative numbers
  // since I want it to be random if you subtract math.random by .5 it ends either being more than 1 or less than 1 giving a truly random outcome
  shuffledQuestions = questionList.sort(() => Math.random() - 0.5);
  // makes sure you start at the first question
  questionIndex = 0;
  // now unhide the questions
  questionContainer.classList.remove("Hidequestion");
  // this will set the next question
  nextquestion();
}
// function to go to next question after it is answered
function nextquestion() {
  resetButtons();
  showQuestion(shuffledQuestions[questionIndex]);
  // this was a pain to set up but if there are still questions keep changing to the next question if not stop the automation
  if (shuffledQuestions.length > questionIndex + 1) {
    ++questionIndex;
  } else {
    clearTimeout();
  }
}
// function to show questions
function showQuestion(questions) {
  // sets question id to now the new actual questions
  questionElement.innerText = questions.questions;
  // I set the questions in an array so forEach loop targets the whole array and whats inside and then replaces the old html buttons with these new ones that have the answer
  questions.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      // found out I can add a dataset to buttons!! making this if the answer is correct then it will show up as correct. only need to focus on what is right because it doesn't need to be more complicated just cause
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectanswer);
    answerBtnElement.appendChild(button);
  });
}
// function to actually select answers
function selectanswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct;
  setStatusClass(btnClass, correct);
  Array.from(answerBtnElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    if (correct) {
      incrementScore(scorePoints);
    } else {
      decrementScore(scorePoints);
    }
    if (correct) {
      time += 0;
    } else {
      time -= 2;
    }
  });
  function setStatusClass(btnClass, correct) {
    clearStatusClass(btnClass);
    if (correct) {
      btnClass.classList.add("correct");
    } else {
      btnClass.classList.add("wrong");
    }
  }
  function clearStatusClass(btnClass) {
    btnClass.classList.remove("correct");
    btnClass.classList.remove("wrong");
    time -= 0;
  }
  // might have messed something up but either way I got it to = 100 if you get a question right
  function incrementScore(Num) {
    Num = 25;
    scoreP += Num;
    score.innerText = scoreP;
  }
  // can't get it to minus 50 so 48 is cool with me :)
  function decrementScore(num) {
    num = 12;
    scoreP -= num;
    score.innerText = scoreP;
  }
  // automatically sets the next question
  setTimeout(() => {
    nextquestion();
  }, 1500);
}

// automatic timer to set the question to the next one
function resetButtons() {
  while (answerBtnElement.firstChild) {
    answerBtnElement.removeChild(answerBtnElement.firstChild);
  }
}
// adding questions
let questionList = [
  {
    questions: "What is a real data type?",
    answers: [
      { text: "number", correct: true },
      { text: "num", correct: false },
      { text: "string set", correct: false },
      { text: "symbol character", correct: false },
    ],
  },
  {
    questions: 'Functions are the main "what" of the program?',
    answers: [
      { text: "ideas", correct: false },
      { text: "puzzle pieces", correct: false },
      { text: "building blocks", correct: true },
      { text: "concepts", correct: false },
    ],
  },
  {
    questions: "What are real variables?",
    answers: [
      { text: "let", correct: true },
      { text: "var", correct: true },
      { text: "const", correct: true },
      { text: "is", correct: false },
    ],
  },
  {
    questions: "What does an arrow function look like?",
    answers: [
      { text: "=>", correct: true },
      { text: ">", correct: false },
      { text: ">>", correct: false },
      { text: "==>", correct: false },
    ],
  },
];

// quiz logic over now begins save highscore function
// linking elements
const recentScore = localStorage.getItem("MostRecentScore");
const initial = document.getElementById("intitials");
const saveScoreBtn = document.getElementById("save-score-Btn");
const finalScore = document.getElementById("Final-score");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const maxHighScore = 5;
finalScore.innerText = recentScore;
// => is a really neat feature where you can add a function which basically makes it easier to make functions or concepts chain together
// makes sure you can't save without entering your intials first. the ! makes sure you can save only by entering your initials because if you don't have have that the opposite effect happens
initial.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !initial.value;
  saveScoreBtn.classList.remove("Highscore-btn:hover");
});
// I wrote it twice just to make sure for real but => is just a way to write out function a regular function just without having to write the word function = just means function () because both would pass event through
// had some trial and error stuff going on basically i didn't call prevent default right so I reverted the cool way to make a function when all I had to do was get rid of prevent default
// had to record myself (while watching back frame by frame) enterting save just to see what was even going on :/
// this saves the highscore and makes sure to only add up to 5 scores that will get saved to the pc
function saveHighScore() {
  const Score = {
    score: recentScore,
    name: initial.value,
  };
  highScores.push(Score);
  highScores.sort((a, b) => {
    return b.Score - a.Score;
  });
  highScores.splice(maxHighScore);
  localStorage.setItem("highScores", JSON.stringify(highScores));
}
// save function in time out screen is done this is the highscores logic now
// linking elements
const highscores = document.getElementById("highscores");
const highScoreList = document.getElementById("highscores-list");
highscoreButton.addEventListener("click", highScoresPage);
function highScoresPage() {
  highscores.classList.remove("hide-highscores");
  introContainer.classList.add("hideintro");
  pbandhbControls.classList.add("Controls");
  // makes sure the list tag in html creates a list of what I wrote down in the saveScore array that way you can see the scores when you click highscores
  // backticks create a template literal which just means I can write in this case, a tag of what the innerhtml is going to represent.
  // so I can actually create a tag that will replace the html tag and I can also give this new tag a class that I can manipulate in css
  // $ is used to assign something in js and I am using the curly brackets to separate them from the backtick string that. I am using curly brackets because [] I am pretty sure will just turn them into single element arrays and I don't want that
  // - doesn't actually mean anything and is there just to act as a divider that way you can distinguish the two
  // lastly join this to a sting and boom you got a highscore list
  highScoreList.innerHTML = highScores
    .map((Score) => {
      return `<li class="highscore-list"> ${Score.name} - ${Score.score}</li>`;
    })
    .join("");
}
