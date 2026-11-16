let currentCategory = "Any";
let currentJoke = "";

let setupEl = document.getElementById("setup");
let punchlineEl = document.getElementById("punchline");
let jokeCard = document.getElementById("jokeCard");
let jokeIcon = document.getElementById("jokeIcon");
let jokeBtn = document.getElementById("jokeBtn");

const funnyIcons = ["😂", "🤣", "😹", "😆", "🤪", "😜"];

function setCategory(category, btn) {
    currentCategory = category;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    getJoke();
}

async function getJoke() {
    jokeBtn.disabled = true;
    jokeBtn.innerHTML = "<span>Loading Luxury Laugh... 👑</span>";
    setupEl.textContent = "Polishing a golden joke for you...";
    punchlineEl.textContent = "";
    setupEl.classList.add("loading");
    jokeCard.style.animation = "none";
    void jokeCard.offsetWidth;
    jokeCard.style.animation = null;

    try {
        // Real Joke API - no key needed
        let url = `https://v2.jokeapi.dev/joke/${currentCategory}?blacklistFlags=nsfw,racist,sexist&type=twopart`;
        
        let response = await fetch(url);
        let data = await response.json();

        if (data.error) throw new Error("API Error");

        // Restart animation
        jokeIcon.textContent = funnyIcons[Math.floor(Math.random() * funnyIcons.length)];

        setupEl.classList.remove("loading");
        setupEl.textContent = data.setup;
        punchlineEl.textContent = "";

        currentJoke = data.setup + " ... " + data.delivery;

        // Typewriter effect for punchline after 1 sec
        setTimeout(() => {
            typeWriter(data.delivery);
        }, 900);

    } catch (error) {
        // Fallback jokes if API fails (offline)
        let fallbackJokes = [
            { setup: "Why did the rich man bring a ladder to the bar?", delivery: "He heard the drinks were on the house!" },
            { setup: "Why do programmers prefer dark mode?", delivery: "Because light attracts bugs!" },
            { setup: "What is the most luxurious joke?", delivery: "This one, because you are reading it in gold!" }
        ];
        let j = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
        setupEl.classList.remove("loading");
        setupEl.textContent = j.setup;
        currentJoke = j.setup + " ... " + j.delivery;
        setTimeout(() => typeWriter(j.delivery), 900);
    }

    jokeBtn.disabled = false;
    jokeBtn.innerHTML = "<span>✨ Tell Me A Joke ✨</span>";
}

function typeWriter(text) {
    let i = 0;
    punchlineEl.textContent = "";
    let speed = 30;
    function type() {
        if (i < text.length) {
            punchlineEl.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function copyJoke() {
    if (!currentJoke) return alert("Get a joke first!");
    navigator.clipboard.writeText(currentJoke);
    alert("Joke copied to clipboard! Share the luxury laugh!");
}

function speakJoke() {
    if (!currentJoke) return alert("Get a joke first!");
    let speech = new SpeechSynthesisUtterance(currentJoke);
    speech.rate = 0.95;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

// Load first joke on start
getJoke();