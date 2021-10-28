"use strict";

// Ordering, shuffling, and valuating the cards
let cardDeck;
let shuffled;
const suits = ["H", "D", "S", "C"];

function orderCards() {
  cardDeck = [];

  for (let i = 0; i < suits.length; i++) {
    let currentSuit = suits[i];
    cardDeck.push(
      `A${currentSuit}`,
      `2${currentSuit}`,
      `3${currentSuit}`,
      `4${currentSuit}`,
      `5${currentSuit}`,
      `6${currentSuit}`,
      `7${currentSuit}`,
      `8${currentSuit}`,
      `9${currentSuit}`,
      `10${currentSuit}`,
      `J${currentSuit}`,
      `K${currentSuit}`,
      `Q${currentSuit}`
    );
  }
  shuffled = false;
}

function shuffleCards() {
  for (let i = cardDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
  }
  shuffled = true;
}

function convertCard(card) {
  let num = card[0];

  if (num === "A") {
    return [1, 11];
  } else if (num === "J" || num === "K" || num === "Q" || num === "1") {
    return [10, 10];
  } else {
    let x = Number(num);
    return [x, x];
  }
}

// Initilizing the game
let playerOne;
let dealer;
let currentCard = 0;
let activePlayer;
let onDeck;

const init = function () {
  playerOne = {
    name: "Player One",
    sum: [0, 0],
    activeSum: 0,
    roundsWon: 0,
    chips: 50,
    bet: 0,
    inHand: [],
    choice: "",
    inGame: true,
  };

  dealer = {
    name: "Jarvis",
    sum: [0, 0],
    activeSum: 0,
    roundsWon: 0,
    inHand: [],
    inGame: true,
  };

  activePlayer = playerOne;
  orderCards();
  shuffleCards();
  round();
};

function changePlayers() {
  if (activePlayer === playerOne) {
    activePlayer = dealer;
    onDeck = playerOne;
  } else if (activePlayer === dealer) {
    activePlayer = playerOne;
    onDeck = dealer;
  }
}

function activeSum() {
  if (activePlayer.sum[0] === activePlayer.sum[1]) {
    activePlayer.activeSum = activePlayer.sum[0];
  } else if (
    activePlayer.sum[0] > activePlayer.sum[1] &&
    activePlayer.sum[0] < 22
  ) {
    activePlayer.activeSum = activePlayer.sum[0];
  } else if (
    activePlayer.sum[1] > activePlayer.sum[0] &&
    activePlayer.sum[1] < 22
  ) {
    activePlayer.activeSum = activePlayer.sum[1];
  } else {
    activePlayer.activeSum = `n/a`;
  }
}

// Players place bets

function placeBets() {
  playerOne.bet = Number(
    prompt(
      `${playerOne.name}, you have ${playerOne.chips} chips. Place your bet.`
    )
  );
  if (isNaN(playerOne.bet)) {
    alert("Please type an actual number.");
    playerOne.bet = 0;
    placeBets();
  } else if (playerOne.bet > playerOne.chips) {
    alert(
      `You wish you could place that bet. Try something under ${playerOne.chips}`
    );
    playerOne.bet = 0;
    placeBets();
  } else if (playerOne.bet === 0) {
    alert(`Does that mean you pass? C'mon man, place a real bet.`);
    placeBets();
  } else if (playerOne.bet < 0) {
    alert(`Does that mean I give you chips? C'mon man, place a real bet.`);
    playerOne.bet = 0;
    placeBets();
  } else if (playerOne.bet % 1 !== 0) {
    alert(`Cut my chips, I cut you. Place a real bet.`);
    playerOne.bet = 0;
    placeBets();
  } else {
    changePlayers();
  }
}

// Dealer deals cards to each player

function dealCards() {
  let currentValue = convertCard(cardDeck[currentCard]);
  activePlayer.inHand.push(cardDeck[currentCard]);
  activePlayer.sum = [
    activePlayer.sum[0] + currentValue[0],
    activePlayer.sum[1] + currentValue[1],
  ];
  console.log(cardDeck[currentCard]);
  console.log(`${activePlayer.name}: ${activePlayer.inHand}`);

  currentCard++;
}

function isBusted() {
  if (activePlayer.sum[0] < 22 || activePlayer.sum[1] < 22) {
    return false;
  } else {
    return true;
  }
}

function isNatural() {
  if (activePlayer.sum[0] === 21 || activePlayer.sum[1] === 21) {
    return true;
  } else {
    return false;
  }
}

function notAce() {
  if (activePlayer.sum[0] === activePlayer.sum[1]) {
    return true;
  } else {
    return false;
  }
}

function playerBust() {
  let busted;

  if (activePlayer.sum[0] === activePlayer.sum[1]) {
    busted = activePlayer.sum[0];
  } else if (activePlayer.sum[0] > activePlayer.sum[1]) {
    busted = activePlayer.sum[1];
  } else {
    busted = activePlayer.sum[0];
  }

  alert(`That brings your total to ${busted}. That's a bust.`);
  activePlayer.inGame = false;
}

// Game Play

function round() {
  placeBets();
  activePlayer = playerOne;

  while (dealer.inHand.length < 2) {
    dealCards();
    changePlayers();
  }

  activePlayer = playerOne;

  if (isNatural()) {
    alert(`Look at you! It's a natural blackjack.`);
    playerOne.chips = trunc(1.5 * playerOne.bet);
    playerOne.roundsWon++;
    nextRound();
  } else {
    console.log(`No player naturals.`);
  }

  activePlayer = dealer;

  if (isNatural()) {
    aler(`That's a natural blackjack for the house. Pay up, buttercup.`);
    playerOne.chips -= playerOne.bet;
    playerOne.roundsWon--;
  }

  activePlayer = playerOne;

  while (activePlayer !== dealer) {
    while (activePlayer.choice !== "stand" && activePlayer.choice !== "Stand") {
      if (activePlayer.choice === "hit" || activePlayer.choice == "Hit") {
        dealCards();

        if (isBusted()) {
          playerBust();
        }
      }

      if (activePlayer.inGame) {
        if (notAce()) {
          activePlayer.choice = prompt(
            `${activePlayer.name}, you're up. You currently have a ${activePlayer.sum[0]}. Hit or stand?`
          );
        } else if (activePlayer.sum[0] < 22 && activePlayer.sum[1] < 22) {
          activePlayer.choice = prompt(
            `${activePlayer.name}, you're up. You currently have either ${activePlayer.sum[0]} or ${activePlayer.sum[1]}. Hit or stand?`
          );
        } else if (activePlayer.sum[0] < 22) {
          activePlayer.choice = prompt(
            `${activePlayer.name}, you're up. You currently have a ${activePlayer.sum[0]}. Hit or stand?`
          );
        } else if (activePlayer.sum[1] < 22) {
          activePlayer.choice = prompt(
            `${activePlayer.name}, you're up. You currently have a ${activePlayer.sum[1]}. Hit or stand?`
          );
        }
      } else {
        break;
      }
    }
    activePlayer.choice = "";
    changePlayers();
  }

  // Round is over. Dealer's turn.

  activePlayer = dealer;

  activeSum();

  while (dealer.activeSum < 17) {
    console.log(`Dealer's active sum is ${dealer.activeSum}`);

    if (notAce()) {
      alert(`I've got a ${dealer.sum[0]}, so I'll hit.`);
    } else {
      alert(
        `I've got either a ${dealer.sum[0]} or a ${dealer.sum[1]}, so I'll hit.`
      );
    }
    dealCards();
    activeSum();
  }

  if (isBusted()) {
    dealer.inGame = false;
    alert(`And that's a bust for me. The winner this round is...`);
    roundWinner();
  } else if (dealer.sum[0] === 21 || dealer.sum[1] === 21) {
    alert(
      `And that's a Blackjack for the house. Let's tally the score. The winner is...`
    );
    roundWinner();
  } else if (dealer.sum[0] >= 17 && dealer.sum[0] < 21) {
    alert(`I stand with a ${dealer.sum[0]}. And the winner is...`);
    roundWinner();
  } else if (dealer.sum[1] >= 17 && dealer.sum[1] < 21) {
    alert(`I stand with a ${dealer.sum[0]}. And the winner is...`);
    roundWinner();
  } else {
    alert(`Something went terribly wrong...`);
  }

  function roundWinner() {
    activePlayer = playerOne;
    for (let i = 0; i < 2; i++) {
      if (activePlayer.inGame) {
        activeSum();
        changePlayers();
      } else {
        activePlayer.activeSum = 0;
        changePlayers();
      }
    }

    if (playerOne.activeSum > dealer.activeSum) {
      alert(`${playerOne.name}!!!`);
      playerOne.chips += playerOne.bet;
      playerOne.roundsWon++;
    } else if (dealer.activeSum > playerOne.activeSum) {
      alert(`Me you losers!!!`);
      playerOne.chips -= playerOne.bet;
      dealer.roundsWon++;
    } else if (playerOne.activeSum === dealer.activeSum) {
      alert(`It's a tie between ${playerOne.name} and the house!`);
    }
  }

  nextRound();
}

function nextRound() {
  playerOne.bet = 0;
  playerOne.inGame = true;
  dealer.inGame = true;
  playerOne.inHand = [];
  dealer.inHand = [];
  playerOne.activeScore = 0;
  dealer.activeScore = 0;
  playerOne.sum = [0, 0];
  dealer.sum = [0.0];
  round();
}

init();
