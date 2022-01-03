// Using API to get random quotes
const quoteUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.querySelector("#quote");
const userInput = document.querySelector("#quote-input");

let startBtn = document.querySelector("#start-test");
let endBtn = document.querySelector("#stop-test");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

const renderNewQuote = async () => {
    // Fetch quotes from specified url
    const response = await fetch(quoteUrl);
    let data = await response.json();

    // Access the content of quote
    quote = data.content;

    // Each span contains one character
    let arr = quote.split("").map((value) => {
        return `<span class="quote-chars">${value}</span>`
    });

    quoteSection.innerHTML += arr.join("");
}

userInput.addEventListener('input', () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);
    let userInputChars = userInput.value.split("");
    quoteChars.forEach((char, index) => {
        if (char.innerText === userInputChars[index]) {
            char.classList.add("success");
        } else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        } else {
            if (!char.classList.contains("fails")) {
                mistakes += 1;
                char.classList.add("fail")
            }
            document.querySelector("#mistakes").innerText = mistakes;
        }
        let check = quoteChars.every(element => {
            return element.classList.contains("success")
        });
        if (check) {
            displayResult();
        }
    })
});

const updateTimer = function() {
    if (time === 0) {
        displayResult();
    } else {
        document.querySelector("#timer").innerText = --time + "s"; 
    }
}

const timeReduce = function() {
    time = 60;
    timer = setInterval(updateTimer, 1000)
}

const displayResult = function() {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.querySelector("#stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time !== 0) {
        timeTaken = (60 - time) / 60;
    }
    const inputLength = userInput.value.length;
    document.querySelector("#wpm").innerText = `${(
      inputLength /
      5 /
      timeTaken
    ).toFixed(2)} wpm`;
    document.querySelector("#accuracy").innerText = `${Math.round(
      ((inputLength - mistakes) / inputLength) * 100)} %`;
}

const startTest = function() {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    startBtn.style.display = "none";
    endBtn.style.display = "block";
};

window.onload = () => {
    userInput.value = "";
    startBtn.style.display = "block";
    endBtn.style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}