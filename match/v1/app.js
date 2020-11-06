
const cardFaces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const gameContainer = document.querySelector(".game-container");
const root = document.documentElement;

class Card {
  constructor(faceId, cardId){
    this.cardId = cardId;
    this.faceId = faceId;
    this.cardEl;
    this.flipped = false;
    this.beenSeen = false;
    this.selected = false;
    this.matched = false;
  } 

flip() {
  this.flipped = !this.flipped;
  this.beenSeen = true;
  this.cardEl.firstElementChild.classList.toggle("revealed");
}
}

// Game constructor
class Game {
  constructor(cardsNum, cols, noMatchViewTime = 2) {
    this.cardsNum = cardsNum;
    this.noMatchViewTime = noMatchViewTime;
    this.startTime;
    this.endTime;
    this.duration;
    this.penalties = 0;
    this.flips = 0;

    this.firstCard;
    this.secondCard;
    
    // Select and shuffle cards
    this.dealtCardsArr = this.cardDealer(cardsNum);

    // "Deal" cards to UI & set grid column number
    this.buildUI(this.dealtCardsArr, cols);

    // Create card objects for gameplay
    this.cards = this.makeCardObjects(this.dealtCardsArr);
    this.setCardElSelectors();

    // Start game
    this.startGame();
  };

  
  cardDealer(cardsNum) {
    const cardFacesNeeded = cardsNum / 2;
    const facesPool = cardFaces;
    
    // Make array of faces to be used
    let arr = [];
    for (let i = 0; i < cardFacesNeeded; i++) {
      let randomIndex = Math.floor(Math.random() * facesPool.length);
      let faceId = facesPool[randomIndex];
      arr.push(faceId);
      facesPool.splice(randomIndex, 1);
    };
    
    // Duplicate array to create pairs
    arr = arr.concat(arr);
    
    // Shuffle array
    let arrShuffled = []
    for (let i = 0; i < cardsNum; i++) {
      let randomIndex = Math.floor(Math.random() * arr.length);
      let faceId = arr[randomIndex];
      arrShuffled.push(faceId);
      arr.splice(randomIndex, 1);
      
    };
    
    
    return arrShuffled;
  };
  
  makeCardObjects(dealtCardsArr) {
    let cardObjArr = [];
    dealtCardsArr.forEach((faceId, cardId) => {
      cardObjArr.push(new Card(faceId, cardId));
    });
    return cardObjArr;
  };
  
  buildUI(dealtCardsArr, cols) {
    root.style.setProperty("--game-columns", `${cols}`);

    let html = ``;
    dealtCardsArr.forEach((faceId, cardId) => {
      html = html.concat(`
      <div id="${cardId}" class="card">
      <div class="card-inner">
      <div class="card-face card-back">
      <img src="./card-back.png" />
      </div>
      <div class="card-face card-front">
      <img src="./pics/${faceId}.png" />
      </div>
      </div>
      </div>
      `);
      gameContainer.innerHTML = html;
    });
  };

  setCardElSelectors() {
    this.cards.forEach(card => {
      card.cardEl = document.getElementById(card.cardId.toString());
    })
  }
  
  startGame() {
    const click = gameContainer.addEventListener("click", (e) => {
      if (!(e.target === gameContainer)) {
        game.setStartTime();
        game.cardClick(e);
      }
    });
  };

  setStartTime() {
    if (this.startTime == null) {
      this.startTime = new Date(Date.now());
    }
  }

  cardClick(e) {
    let card = this.cards[e.target.parentElement.parentElement.parentElement.id];
    if (!card.flipped) {
      this.selectCard(card)
    }
  }

  selectCard(card) {
    card.flip();
    this.flips += 1;
    if (this.firstCard != null) {
      this.secondCard = card;
      card.selected = true;
      this.checkForMatch();

    } else {
      this.firstCard = card;
      card.selected = true;

    };
  }

  checkForMatch() {
    let id1 = this.firstCard.faceId;
    let id2 = this.secondCard.faceId;
    if (id1 != id2) {
      if (this.firstCard.beenSeen || this.secondCard.beenSeen) {
        this.penalties += 1;
      }
      setTimeout(() => {
        game.clearSelected();
      }, 800);
    } else {
      this.firstCard.matched = true;
      this.secondCard.matched = true;
      this.deselectCards();
      this.checkIfFinished();
    }
  }

  clearSelected() {
    let first = this.firstCard;
    let second = this.secondCard;
    first.flip();
    second.flip();
    this.firstCard.selected = false;
    this.secondCard.selected = false;
    this.firstCard = null; 
    this.secnodCard = null;
  }

  deselectCards() {
    this.firstCard.selected = false;
    this.secondCard.selected = false;
    this.firstCard = null;
    this.secondCard = null;
  }

  checkIfFinished() {
    let cards = this.cards;
    let allMatch = true;
    cards.forEach((card) => {
      if (!card.matched) {

        allMatch = false;
      }
    })
    if (allMatch == true) {
      this.endTime = new Date(Date.now());
      this.duration = (this.endTime - this.startTime)/1000;
      console.log('finished: ', this.duration, 's');
      console.log('penalties: ', this.penalties);
      console.log('flips: ', this.flips);
    }
  }

};

const game = new Game(12,3);
