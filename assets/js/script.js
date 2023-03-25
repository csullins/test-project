var categoryButtons = document.querySelectorAll(".button");
var main = document.querySelector(".main");
var questionAnswerEl = document.querySelector(".questions-and-answers");
var brainHandEl = document.querySelector("figure");
var questionBox = document.querySelector(".questions");
var answerBox = document.querySelector(".answers");
var progressBar = document.querySelector(".progress");
let questionIndex = 0;
var score = 0;
var categoryChoice;
var questions = [];

// API call to trivia categories
var getQuestionCategory = function (categoryChoice, questionIndex) {
  if (questions.length === 0) {
    fetch(
      `https://the-trivia-api.com/api/questions?categories=${categoryChoice}`
    )
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        // console.log(responseData);
        questions = responseData;
        displayQuestionAndAnswers(questionIndex);
      })
      .catch((error) => {
        console.log(error);
        questionAnswerEl.style.display = "none";
        return;
      });
  } else if(questionIndex >= questions.length){
    console.log('quiz has ended')
    answerBox.style.display = "none";
    questionBox.innerHTML = `Quiz has ended! Your Score is ${score}`
    document.querySelector('.progress-bar').style.display = 'none';
    return;
  }else{
    displayQuestionAndAnswers(questionIndex);
  }
  startTimer();
};

var displayQuestionAndAnswers = function (questionIndex) {
  let currentQuestion = questions[questionIndex].question;
  console.log(currentQuestion);
  questionBox.innerHTML = currentQuestion;
  createAnswers(questions[questionIndex]);
};

// getting the value of the button clicked
function categoryButtonClicked() {
  categoryChoice = this.value;
  console.log(categoryChoice);

  main.style.display = "none";
  brainHandEl.style.display = "none";
  questionAnswerEl.style.display = "block";

  getQuestionCategory(categoryChoice, questionIndex);
}

// Clicking on each category button
for (const categoryButton of categoryButtons) {
  categoryButton.addEventListener("click", categoryButtonClicked);
}

let timeInterval;

function startTimer() {
    console.log("Time started");
    startProgressBar();
    // 5 second timer
    timeInterval = setInterval(function () {
      console.log("Time ended.");
     // When timer runs out 
      clearInterval(timeInterval); // Clear the timer after 5s
      questionIndex++;
      getQuestionCategory(categoryChoice, questionIndex);
    }, 5000);
  }

  function startProgressBar() {
    progressBar.classList.add('notransition'); // Disable transitions
    progressBar.style.width = "100%";
    progressBar.offsetHeight; // Trigger a reflow, flushing the CSS changes
    progressBar.classList.remove('notransition'); // Re-enable transitions
    progressBar.style.width = "0%";
  }
  
// Creating answer choices array from api answers and displaying
var createAnswers = function (questionData) {
  $("#answers").empty();
  let answersArr = [];

  answersArr.push(questionData.correctAnswer);
  for (let i = 0; i < 3; i++) {
    answersArr.push(questionData.incorrectAnswers[i]);
  }
  let shuffledArray = answersArr.sort((a, b) => 0.5 - Math.random());

  // Append array indexes to buttons
  for (let i = 0; i < answersArr.length; i++) {
    let answerBtns = document.createElement("button");
    answerBtns.innerHTML = shuffledArray[i];
    var classArr = ["is-primary", "is-danger", "is-warning", "is-link"];
    answerBtns.classList.add(
      "button",
      classArr[i % classArr.length],
      "is-outlined",
      "is-mobile",
      "btngap"
    );
    answerBox.append(answerBtns);
    answerBtns.addEventListener("click", function (event) {
      answerClicked(event);
    });
  }

  function answerClicked(event) {
    console.log("answer clicked");
    clearInterval(timeInterval);

    const selectedAnswer = event.target.innerHTML;
    if (selectedAnswer === questionData.correctAnswer) {
      // function for tracking points
      score++;
      console.log(`correct! ${score}`);
    } else {
      console.log("incorrect");
    }
  
    questionIndex++;
    getQuestionCategory(categoryChoice, questionIndex);
    
    localStorage.setItem("score", score)
  }
};
