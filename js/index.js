const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answer-text"));
const questionCounterText = document.getElementById("counter");
const scoreText = document.getElementById("score");
const restart = document.getElementById("restart");

function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}


// console.log(questions);
let questionCounter;
let score;
const MAX_QUESTIONS = 1;
let acceptingAnswers;


// function loadFromFile
const loadFromFile = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "databaseQuiz.json", false);
  xhr.send();

  xhr.onload = function(){
    if(this.status == 200){
      
    } else {
      console.log('Oops something went wrong!');
    }
  };
  return xhr.response;
};

let questions = JSON.parse(loadFromFile());


// function getRandomQuestions
const getRandomQuestions = (arr, n) => {

  let len = arr.length;
  if (n > len){
    throw new RangeError("getRandomQuestions: more elements taken than available");
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return (selected = shuffled.slice(0, n));
};


// function displayResaults
const displayResaults = () => {
    // const myModalEl = document.getElementById('myModal');
    const modal = new mdb.Modal(endTestModal);
    const modalBody = document.getElementById('modal-body');
    modalBody.innerText = `You scored: ${score}`; 
    modal.show();
    acceptingAnswers = false;
};


// function getNewQuestions
const getNewQuestions = () => {
 
  if(availableQuestions.length === 0){
    displayResaults();
    return; 
  }

  questionCounter++;
  questionCounterText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;

  currentQuestion = availableQuestions[0];
  currentQuestionRus = currentQuestion['question_ru'];
  translate = currentQuestion['translate'];
  // console.log(currentQuestion['question_ru'])

  // question.innerText = translate ? `${currentQuestion.question}\n${currentQuestionRus}` : currentQuestion.question;
  question.innerText = currentQuestion.question;

  answers.forEach( answer => {
    // console.log(currentQuestion['a_ru']) 
    console.log(currentQuestion[answer.dataset['answer']]) 
    answer.innerText = currentQuestion[answer.dataset['answer']];
  });
  //TODO add randomization 

  answers.forEach( answer => {
    answer.addEventListener('click', e => {

      if(!acceptingAnswers){
        return;
      }

      acceptingAnswers = false;
      const clickedAnswer = e.target;

      const answerLetter = clickedAnswer.dataset['answer']; 

      let classToApply = 'incorrect';
      
      if(answerLetter === currentQuestion.answer){
        score++;
        scoreText.innerText = score;
        classToApply = 'correct';
      }

      clickedAnswer.parentElement.classList.add(classToApply);

      setTimeout(() => {
        clickedAnswer.parentElement.classList.remove(classToApply);
        getNewQuestions();
        acceptingAnswers = true;
      }, 1000);

    });
  });

  availableQuestions.shift();
 
};


// function startQuiz
const startQuiz = () => {
  console.log(questions)
  
  questionCounter = 0;
  score = 0;
  acceptingAnswers = true;
  scoreText.innerText = score;
  
  availableQuestions = getRandomQuestions(questions, MAX_QUESTIONS);

  getNewQuestions();
};

restart.addEventListener('click', startQuiz);


startQuiz();
