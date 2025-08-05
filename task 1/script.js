// Quiz questions data
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctAnswer: 3
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hypertext Markup Language",
            "Hypertext Machine Language",
            "Hypertext Modeling Language",
            "Hypertext Marking Language"
        ],
        correctAnswer: 0
    },
    {
        question: "What year was JavaScript launched?",
        options: ["1996", "1995", "1994", "1997"],
        correctAnswer: 1
    },
    {
        question: "Which of these is not a JavaScript framework?",
        options: ["React", "Angular", "Vue", "Django"],
        correctAnswer: 3
    }
];

// DOM Elements
const quizIntro = document.getElementById('quiz-intro');
const quizQuestionsSection = document.getElementById('quiz-questions');
const quizResults = document.getElementById('quiz-results');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const totalQuestions = document.getElementById('total-questions');
const feedbackElement = document.getElementById('feedback');

// Quiz state variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let quizCompleted = false;
let timeLeft = 30;
let progressInterval;

// Initialize the quiz
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    updateScore();
    showQuestion();
}

// Show the current question
function showQuestion() {
    resetState();
    resetTimer();
    startTimer();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    
    // Update question counter
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    
    // Create options
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    // Hide/show navigation buttons
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');
    
    if (currentQuestionIndex === quizQuestions.length - 1) {
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

// Reset the question state
function resetState() {
    selectedOption = null;
    optionsContainer.innerHTML = '';
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');
    clearInterval(timer);
    clearInterval(progressInterval);
}

// Timer functions
function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();

    // Update progress bar every 100ms for smoother animation

    progressInterval = setInterval(() => {
        const percentage = (timeLeft / 30) * 100;
        progress.style.width = `${percentage}%`;
    }, 100);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 5) {
            timerElement.classList.add('time-warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            clearInterval(progressInterval);
            timeUp();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    clearInterval(progressInterval);
    timerElement.classList.remove('time-warning');
    timeLeft = 30;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    timerElement.textContent = `Time left: ${timeLeft}s`;
}

function timeUp() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.disabled = true;
    });
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctOption = document.querySelector(`.option-btn:nth-child(${currentQuestion.correctAnswer + 1})`);
    correctOption.classList.add('correct');
    
    // Auto move to next question after 1.5 seconds
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            quizCompleted = true;
            showResults();
        }
    }, 1500);
}


// Handle option selection
function selectOption(index) {
    selectedOption = index;
    const options = document.querySelectorAll('.option-btn');
    
    options.forEach((option, i) => {
        if (i === index) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

      // Stop timer when an option is selected
    clearInterval(timer);
    clearInterval(progressInterval);
}

// Check the selected answer
function checkAnswer() {
    if (selectedOption === null) return false;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
    });
    
    // Mark correct and incorrect answers
    options[currentQuestion.correctAnswer].classList.add('correct');
    
    if (selectedOption !== currentQuestion.correctAnswer) {
        options[selectedOption].classList.add('incorrect');
    }
    
    // Update score if correct
    if (selectedOption === currentQuestion.correctAnswer) {
        score++;
        updateScore();
    }
    
    return selectedOption === currentQuestion.correctAnswer;
}

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

// Show quiz results
function showResults() {
    quizQuestionsSection.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    finalScore.textContent = score;
    totalQuestions.textContent = quizQuestions.length;
    
    // Calculate percentage
    const percentage = (score / quizQuestions.length) * 100;
    
    // Provide feedback based on score
    if (percentage >= 80) {
        feedbackElement.textContent = "Excellent! You know your stuff!";
        feedbackElement.style.backgroundColor = "#dff0d8";
    } else if (percentage >= 50) {
        feedbackElement.textContent = "Good job! Keep learning!";
        feedbackElement.style.backgroundColor = "#d9edf7";
    } else {
        feedbackElement.textContent = "Keep practicing! You'll get better!";
        feedbackElement.style.backgroundColor = "#f2dede";
    }
}

// Event Listeners
startBtn.addEventListener('click', () => {
    quizIntro.classList.add('hidden');
    quizQuestionsSection.classList.remove('hidden');
    initQuiz();
});

nextBtn.addEventListener('click', () => {
    checkAnswer();
    currentQuestionIndex++;
    showQuestion();
});

submitBtn.addEventListener('click', () => {
    checkAnswer();
    quizCompleted = true;
    showResults();
});

restartBtn.addEventListener('click', () => {
    quizResults.classList.add('hidden');
    quizIntro.classList.remove('hidden');
});


   // Add this new function to show feedback after each question
function showQuestionFeedback(isCorrect) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'question-feedback';
    
    if (isCorrect) {
        feedbackDiv.textContent = "Correct! Well done!";
        feedbackDiv.style.backgroundColor = "#dff0d8"; // Light green
    } else {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
        feedbackDiv.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
        feedbackDiv.style.backgroundColor = "#f2dede"; // Light red
    }
    
    // Insert feedback above the next/submit buttons
    const buttonsContainer = document.querySelector('#quiz-questions > button:not(.hidden)').parentNode;
    buttonsContainer.insertBefore(feedbackDiv, buttonsContainer.firstChild);
    
    // Remove feedback after 2 seconds
    setTimeout(() => {
        feedbackDiv.remove();
    }, 2000);
}

// Modify the checkAnswer function to use this feedback
function checkAnswer() {
    if (selectedOption === null) {
        showQuestionFeedback(false); // Show feedback even when no answer selected
        return false;
    }
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
    });
    
    // Mark correct and incorrect answers
    options[currentQuestion.correctAnswer].classList.add('correct');
    
    if (selectedOption !== currentQuestion.correctAnswer) {
        options[selectedOption].classList.add('incorrect');
    }
    
    // Check if answer was correct
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Update score if correct
    if (isCorrect) {
        score++;
        updateScore();
    }
    
    // Show immediate feedback
    showQuestionFeedback(isCorrect);
    
    return isCorrect;
}

// Also update the timeUp function to show feedback
function timeUp() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.disabled = true;
    });
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctOption = document.querySelector(`.option-btn:nth-child(${currentQuestion.correctAnswer + 1})`);
    correctOption.classList.add('correct');
    
    // Show feedback for time up
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'question-feedback';
    feedbackDiv.textContent = `Time's up! The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`;
    feedbackDiv.style.backgroundColor = "#fcf8e3"; // Light yellow
    optionsContainer.after(feedbackDiv);
    
    // Auto move to next question after 1.5 seconds
    setTimeout(() => {
        feedbackDiv.remove();
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            quizCompleted = true;
            showResults();
        }
    }, 1500);
}


// Initialize the app
initQuiz();
