// Document Variables
let mainTitle = document.getElementById("mainTitle");
let mainArea = document.getElementById("mainArea");
let selectionTag = document.getElementById("selectionTag");
let modeOneBtn = document.getElementById("modeOneBtn");
let modeCpuBtn = document.getElementById("modeCpuBtn");
let nextBtn = document.getElementById("nextBtn");

// JavaScript Global Variables
let matchEnd, playAgain, mode, rounds, roundNum, maxRounds, roundCount = 0; // Mode, Round, Bool
let choice, playerOneChoice, playerTwoChoice, cpuChoice, playerOneScore = 0, playerTwoScore = 0; // Game Play
// Round Btn Creation
let roundButtonsArr = [];
const roundLabelsArr = ["1 / 1", "3 / 5", "4 / 7"];
// Icon Btn Creation
let iconBtn, iconTag, iconButtonsArr = [], iconTagArr = [];
const iconClassArr = ["fa-hand-back-fist", "fa-hand", "fa-hand-scissors", "fa-hand-lizard", "fa-hand-spock"];

// Mode Selection
modeOneBtn.addEventListener('click', function () {
    ToggleModeBtn(modeOneBtn, modeCpuBtn);
});

modeCpuBtn.addEventListener('click', function () {
    ToggleModeBtn(modeCpuBtn, modeOneBtn);
});

function ToggleModeBtn(clickedBtn, unselectedBtn) {
    if (mode) {
        unselectedBtn.classList.add("bg-transparent", "whiteF");
        clickedBtn.classList.remove("bg-transparent", "whiteF");
        if (clickedBtn === modeOneBtn) {
            mode = "modeOne";
        } else {
            mode = "modeCpu";
        }
    } else {
        clickedBtn.classList.remove("bg-transparent", "whiteF");
        if (clickedBtn === modeOneBtn) {
            mode = "modeOne";
        } else {
            mode = "modeCpu";
        }
    }
}

// Round Selection
function CreateRoundBtn(text, value) {
    const roundDiv = document.createElement("div");
    roundDiv.setAttribute("class", "col-auto mb-2 mb-sm-0");

    const roundBtn = document.createElement("button");
    roundBtn.classList.add("btn", "btn-light", "bg-transparent", "whiteF", "px-4", "py-2");
    roundBtn.textContent = text;

    roundDiv.appendChild(roundBtn);
    mainArea.appendChild(roundDiv);
    roundButtonsArr.push(roundBtn);

    roundBtn.addEventListener('click', function () {
        if (rounds) {
            roundButtonsArr.forEach(btn => btn.classList.add("bg-transparent", "whiteF"));
            roundBtn.classList.remove("bg-transparent", "whiteF");
            rounds = value;
        } else {
            roundBtn.classList.remove("bg-transparent", "whiteF");
            rounds = value;
        }
        switch (rounds) {
            case 1:
                roundNum = 1;
                maxRounds = 1;
                break;
            case 2:
                roundNum = 3;
                maxRounds = 5;
                break;
            case 3:
                roundNum = 4;
                maxRounds = 7;
                break;
        }
    });
}

// Next Button
nextBtn.addEventListener('click', function () {
    if (playAgain) {
        mainTitle.innerHTML = "";
        mainArea.innerHTML = "Loading...";
        selectionTag.textContent = "";
        location.reload(); //restart web page
    } 
    
    else if (matchEnd) {
        let winner;
        if (playerOneScore > playerTwoScore) {
            winner = "Player 1";
        } else if (playerOneScore < playerTwoScore) {
            if(mode === "modeOne"){
                winner = "Player 2";
            } else if(mode === "modeCpu"){
                winner = "CPU";
            }
            
        } else {
            winner = "Both"
        }
        mainTitle.innerHTML = `Final Results: ${winner} wins!`;
        mainArea.innerHTML = `Scoreboard:&nbsp ${playerOneScore} &nbsp|&nbsp ${playerTwoScore}`;
        mainArea.classList.add("font-choice", "sixCaps", "scoreboard");
        selectionTag.textContent = "Play Again? Click the next arrow.";
        selectionTag.classList.add("font-choice");
        playAgain = true;
    } 
    
    else if (mode && roundNum && playerOneChoice && playerTwoChoice) {
        let result = DetermineWinner();
        mainTitle.innerHTML = `Player 1, you ${result} this round!`;
        mainArea.innerHTML = `Round ${roundCount + 1} Recap: ${IconSwitch(playerOneChoice)} vs. ${IconSwitch(playerTwoChoice)}`;
        mainArea.classList.add("font-choice", "sixCaps");
        selectionTag.textContent = "";

        roundCount++;

        playerOneChoice = "";
        playerTwoChoice = "";

        if(playerOneScore === roundNum || playerTwoScore === roundNum){
            matchEnd = true;
            console.log("1st evaluates true");
        }

        if (roundCount === maxRounds) {
            matchEnd = true;
            console.log("2nd evaluates true");
        }
    } 
    
    else if (mode && roundNum && playerOneChoice) {
        if (mode === "modeOne") {
            mainTitle.innerHTML = "Player 2: Make your Move";
            mainArea.innerHTML = "";
            selectionTag.textContent = "";

            iconClassArr.forEach((type) => CreateGameArea(type));
            iconButtonsArr.forEach(iconBtn => {
                iconBtn.addEventListener('click', function () {
                    let index = iconButtonsArr.indexOf(iconBtn);
                    UpdateChoice(index);

                    playerTwoChoice = choice;

                    ToggleIconBtn(index);
                });
            });
        } else if (mode === "modeCpu") {
            mainTitle.innerHTML = "CPU: Make your Move";
            mainArea.innerHTML = "CPU has selected...";
            mainArea.classList.add("font-choice");
            selectionTag.textContent = "";
            callApi();
        }
    } 
    
    else if (mode && rounds) {
        matchEnd = false;
        mainTitle.innerHTML = "Player 1: Make your Move";
        mainArea.innerHTML = "";
        iconClassArr.forEach((type) => CreateGameArea(type));

        iconButtonsArr.forEach(iconBtn => {
            iconBtn.addEventListener('click', function () {
                let index = iconButtonsArr.indexOf(iconBtn);
                UpdateChoice(index);

                playerOneChoice = choice;

                ToggleIconBtn(index);
            });
        });
    } 
    
    else if (mode) {
        mainTitle.innerHTML = "Choose Rounds";
        mainArea.innerHTML = "";
        roundLabelsArr.forEach((label, index) => CreateRoundBtn(label, index + 1));
    }
});

function UpdateChoice(index) { 
    choice = index + 1;
    if (choice > 5) { // Handle other cases, if needed
        choice = ((choice - 1) % 5) + 1;
    }
}

function CreateGameArea(type) {
    const playDiv = document.createElement("div");
    playDiv.setAttribute("class", "col-auto");

    iconBtn = document.createElement("button");
    iconBtn.classList.add("btn");

    iconTag = document.createElement("i");
    iconTag.classList.add("fa-regular", type, "font-60");

    iconBtn.appendChild(iconTag);
    playDiv.appendChild(iconBtn);
    mainArea.appendChild(playDiv);

    iconTagArr.push(iconTag);
    iconButtonsArr.push(iconBtn);
}

function ToggleIconBtn(index) {
    iconTagArr.forEach(tag => {
        tag.classList.remove("fa-solid");
        tag.classList.add("fa-regular");
    });

    iconTagArr[index].classList.remove("fa-regular");
    iconTagArr[index].classList.add("fa-solid");

    selectionTag.textContent = "";
    selectionTag.textContent = IconSwitch(choice);
}

function IconSwitch(choice) {
    switch (choice) {
        case 1:
            return "Rock";
        case 2:
            return "Paper";
        case 3:
            return "Scissors";
        case 4:
            return "Lizard";
        case 5:
            return "Spock";
    }
}

function DetermineWinner() {
    const possibleOutcomes = [
        ["TIE", "LOSE", "WIN", "WIN", "LOSE"],
        ["WIN", "TIE", "LOSE", "LOSE", "WIN"],
        ["LOSE", "WIN", "TIE", "WIN", "LOSE"],
        ["LOSE", "WIN", "LOSE", "TIE", "WIN"],
        ["WIN", "LOSE", "WIN", "LOSE", "TIE"]
    ];

    const outcome = possibleOutcomes[playerOneChoice - 1][playerTwoChoice - 1];

    if (outcome === "WIN") {
        playerOneScore++;
    } else if (outcome === "LOSE") {
        playerTwoScore++;
    }

    return outcome;
}

async function callApi() {
    const promise = await fetch("https://rpslsapi.azurewebsites.net/RPSLS");
    const data = await promise.text();

    switch (data) {
        case "Rock":
            cpuChoice = 1;
            break;
        case "Paper":
            cpuChoice = 2;
            break;
        case "Scissors":
            cpuChoice = 3;
            break;
        case "Lizard":
            cpuChoice = 4;
            break;
        case "Spock":
            cpuChoice = 5;
            break;
    }

    selectionTag.textContent = data;
    playerTwoChoice = cpuChoice;
}

