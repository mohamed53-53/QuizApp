let countspan = document.querySelector(".count span")
let bullets = document.querySelector(".bullets")
let bulletSpanContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let resultContainer = document.querySelector(".results")
let countdownElement = document.querySelector(".countdown");
let questionindex = 0;
let randomindex = []
let random = [];
let rightAnswers = 0;
let countdownInterval;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
function getQustions() {
    let myRequst = new XMLHttpRequest();

    myRequst.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let qustionObject = JSON.parse(this.responseText)
            let qustionCount = qustionObject.length;
            for (let i = 0; i < qustionCount; i++) {
                randomindex.push(i)

            }
            random = shuffle(randomindex);
            createBullets(qustionCount)
            addQustionData(qustionObject[random[questionindex]], qustionCount)
            submitButton.onclick = () => {
                // Get Right Answer
                let theRightAnswer = qustionObject[random[questionindex]].right_answer;
                console.log(random)

                // Increase Index
                questionindex++;

                // Check The Answer
                checkAnswer(theRightAnswer, random[questionindex]);
                quizArea.innerHTML = ''
                answerArea.innerHTML = ''
                addQustionData(qustionObject[random[questionindex]], qustionCount)
                handelBullets()
                showResult(qustionCount)
                clearInterval(countdownInterval)
                countdown(5, qustionCount)
            }
            countdown(5, qustionCount)
        }

    }
    myRequst.open("GET", "html_qustion.json", true)
    myRequst.send()
}
getQustions()
function createBullets(num) {
    countspan.innerHTML = num

    for (let i = 0; i < num; i++) {

        let bullet = document.createElement("span")
        if (i === 0) {
            bullet.className = "on"
        }
        bulletSpanContainer.appendChild(bullet)
    }
}

function addQustionData(obj, count) {
    if (random[questionindex] < count) {
        let questionTitle = document.createElement('h2')

        let questionText = document.createTextNode(obj.title)

        questionTitle.appendChild(questionText)

        quizArea.appendChild(questionTitle)

        // add answer
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");

            // Add Class To Main Div
            mainDiv.className = "answer";

            // Create Radio Input
            let radioInput = document.createElement("input");

            // Add Type + Name + Id + Data-Attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Make First Option Selected
            if (i === 1) {
                radioInput.checked = true;
            }

            // Create Label
            let theLabel = document.createElement("label");

            // Add For Attribute
            theLabel.htmlFor = `answer_${i}`;

            // Create Label Text
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // Add The Text To Label
            theLabel.appendChild(theLabelText);

            // Add Input + Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // Append All Divs To Answers Area
            answerArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}
let randomnumber = 0;
function handelBullets() {
    let span = document.querySelectorAll(".bullets .spans span")
    
    for (let i = 0; i < span.length; i++) {
        if (i === random[questionindex]) {
            ++randomnumber
            console.log(randomnumber)
            span[randomnumber].className = "on"
        }
    }
}
function showResult(count) {
    let theResults;
    if (randomnumber+1 === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultContainer.innerHTML = theResults;
        resultContainer.style.padding = "10px";
        resultContainer.style.backgroundColor = "white";
        resultContainer.style.marginTop = "10px";
    }
}
function countdown(duration, count) {
    if (random[questionindex] < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;
            --duration

            if (duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}
