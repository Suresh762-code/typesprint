const durationButtons =
    document.querySelectorAll(
        "#durationButtons button"
    );

const modeButtons =
    document.querySelectorAll(
        "#modeButtons button"
    );

const startButton =
    document.getElementById(
        "startTest"
    );

const typingArea =
    document.getElementById(
        "typingArea"
    );

const resultsSection =
    document.getElementById(
        "results"
    );

const textDisplay =
    document.getElementById(
        "textDisplay"
    );

const typingInput =
    document.getElementById(
        "typingInput"
    );

const timerDisplay =
    document.getElementById(
        "timer"
    );

const liveWpm =
    document.getElementById(
        "liveWpm"
    );

const liveAccuracy =
    document.getElementById(
        "liveAccuracy"
    );

const restartButton =
    document.getElementById(
        "restartTest"
    );

const tryAgainButton =
    document.getElementById(
        "tryAgain"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


let selectedTime = 60;

let selectedMode =
    "normal";

let timeLeft = 60;

let timer = null;

let testStarted = false;

let targetText = "";

let startTime = null;


const texts = {

    normal: [
        `Typing is a valuable skill that improves with regular practice. Focus on accuracy first and gradually increase your speed as you become more comfortable with the keyboard.`,

        `Technology allows people to communicate, learn and work more efficiently. Improving your typing speed can help you complete everyday computer tasks with greater confidence.`,

        `Consistent practice is one of the best ways to become a faster typist. Keep your hands relaxed, use the correct fingers and try to maintain a steady rhythm while typing.`
    ],

    numbers: [
        `4582 7391 6024 8753 1946 3278 5410 9632 7185 2049 6357 8421`,

        `2026 4815 7302 5961 2487 9054 3618 7240 8536 1972 6408 3159`,

        `14 29 67 81 45 93 26 58 72 30 19 64 88 41 53 76 95 22`
    ],

    punctuation: [
        `Hello! How are you today? Let's practice: commas, periods, questions, and exclamation marks.`,

        `Typing accurately isn't difficult; however, punctuation requires attention. Ready? Let's begin!`,

        `Practice makes progress: use commas, periods, semicolons; quotation marks, apostrophes, and brackets.`
    ],

    programming: [
        `function calculateWPM(chars, minutes) { return Math.round((chars / 5) / minutes); }`,

        `const user = { name: "TypeSprint", active: true }; console.log(user.name);`,

        `for (let i = 0; i < 10; i++) { console.log("Typing practice " + i); }`
    ]

};


durationButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                durationButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                selectedTime =
                    Number(
                        button.dataset.time
                    );

            }
        );

    }
);


modeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                modeButtons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                selectedMode =
                    button.dataset.mode;

            }
        );

    }
);


function getRandomText() {

    const collection =
        texts[selectedMode];

    return collection[
        Math.floor(
            Math.random()
            *
            collection.length
        )
    ];

}


function startTest() {

    clearInterval(timer);

    timeLeft =
        selectedTime;

    timerDisplay.textContent =
        timeLeft;

    targetText =
        getRandomText();

    textDisplay.textContent =
        targetText;

    typingInput.value = "";

    liveWpm.textContent =
        "0";

    liveAccuracy.textContent =
        "100%";

    typingArea.classList.remove(
        "hidden"
    );

    resultsSection.classList.add(
        "hidden"
    );

    testStarted = false;

    startTime = null;

    typingInput.disabled =
        false;

    typingInput.focus();

    typingArea.scrollIntoView({
        behavior: "smooth"
    });

}


function beginTimer() {

    if (testStarted) {
        return;
    }

    testStarted = true;

    startTime =
        Date.now();

    timer =
        setInterval(
            () => {

                timeLeft--;

                timerDisplay.textContent =
                    timeLeft;

                updateStatistics();

                if (timeLeft <= 0) {
                    const result = {

    wpm: Math.max(wpm, 0),

    accuracy: Math.max(
        accuracy,
        0
    ),

    errors: errors,

    duration:
        selectedTime >= 60
            ? `${selectedTime / 60} Min`
            : `${selectedTime} Sec`,

    mode:
        selectedMode.charAt(0).toUpperCase()
        +
        selectedMode.slice(1),

    date:
        new Date().toLocaleString()

};


let history =
    JSON.parse(
        localStorage.getItem(
            "typesprintHistory"
        )
        ||
        "[]"
    );


history.unshift(result);


history =
    history.slice(0, 20);


localStorage.setItem(
    "typesprintHistory",
    JSON.stringify(history)
);

                    finishTest();

                }

            },
            1000
        );

}


function updateStatistics() {

    const typed =
        typingInput.value;

    if (!typed.length) {

        liveWpm.textContent =
            "0";

        liveAccuracy.textContent =
            "100%";

        return;

    }


    let correct = 0;

    for (
        let i = 0;
        i < typed.length;
        i++
    ) {

        if (
            typed[i]
            ===
            targetText[i]
        ) {

            correct++;

        }

    }


    const elapsedMinutes =
        Math.max(
            (
                Date.now()
                -
                startTime
            )
            /
            60000,
            0.01
        );


    const words =
        correct
        /
        5;


    const wpm =
        Math.round(
            words
            /
            elapsedMinutes
        );


    const accuracy =
        Math.round(
            (
                correct
                /
                typed.length
            )
            *
            100
        );


    liveWpm.textContent =
        Math.max(
            0,
            wpm
        );


    liveAccuracy.textContent =
        `${Math.max(
            0,
            accuracy
        )}%`;

}


typingInput.addEventListener(
    "input",
    () => {

        beginTimer();

        updateStatistics();


        if (
            typingInput.value.length
            >=
            targetText.length
        ) {

            finishTest();

        }

    }
);


function finishTest() {

    clearInterval(timer);

    typingInput.disabled =
        true;


    const typed =
        typingInput.value;


    let correct = 0;


    for (
        let i = 0;
        i < typed.length;
        i++
    ) {

        if (
            typed[i]
            ===
            targetText[i]
        ) {

            correct++;

        }

    }


    const errors =
        Math.max(
            typed.length
            -
            correct,
            0
        );


    const secondsUsed =
        Math.max(
            selectedTime
            -
            timeLeft,
            1
        );


    const minutesUsed =
        secondsUsed
        /
        60;


    const wpm =
        Math.round(
            (
                correct
                /
                5
            )
            /
            minutesUsed
        );


    const accuracy =
        typed.length
        ?
        Math.round(
            (
                correct
                /
                typed.length
            )
            *
            100
        )
        :
        0;


    document.getElementById(
        "resultWpm"
    ).textContent =
        Math.max(
            wpm,
            0
        );


    document.getElementById(
        "resultAccuracy"
    ).textContent =
        `${Math.max(
            accuracy,
            0
        )}%`;


    document.getElementById(
        "resultErrors"
    ).textContent =
        errors;


    let best =
        Number(
            localStorage.getItem(
                "typesprintBest"
            )
            ||
            0
        );


    if (wpm > best) {

        best = wpm;

        localStorage.setItem(
            "typesprintBest",
            best
        );

    }


    document.getElementById(
        "personalBest"
    ).textContent =
        best;


    resultsSection.classList.remove(
        "hidden"
    );


    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

}


startButton.addEventListener(
    "click",
    startTest
);


restartButton.addEventListener(
    "click",
    startTest
);


tryAgainButton.addEventListener(
    "click",
    startTest
);


document
    .querySelectorAll(
        ".quick-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    selectedTime =
                        Number(
                            card.dataset.time
                        );

                    durationButtons.forEach(
                        button => {

                            button.classList.toggle(
                                "active",
                                Number(
                                    button.dataset.time
                                )
                                ===
                                selectedTime
                            );

                        }
                    );

                    startTest();

                }
            );

        }
    );


document
    .getElementById(
        "dailyChallenge"
    )
    .addEventListener(
        "click",
        () => {

            selectedTime =
                60;

            selectedMode =
                "normal";

            startTest();

        }
    );


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        const dark =
            document.body.classList.contains(
                "dark"
            );

        themeToggle.textContent =
            dark
            ?
            "☀️"
            :
            "🌙";

        localStorage.setItem(
            "typesprintTheme",
            dark
            ?
            "dark"
            :
            "light"
        );

    }
);


if (
    localStorage.getItem(
        "typesprintTheme"
    )
    ===
    "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent =
        "☀️";

}