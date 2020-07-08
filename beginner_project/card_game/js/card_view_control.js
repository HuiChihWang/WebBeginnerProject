class Card {
    constructor(cardIndex, matchIndex) {
        this._cardIndex = cardIndex;
        this._matchIndex = matchIndex;
        this._isFlipUp = false;
        this._isMatch = false;
    }

    get index() {
        return this._cardIndex;
    }
    get matchIndex() {
        return this._matchIndex;
    }

    set isFlipUp(isFlipUp) {
        this._isFlipUp = isFlipUp;
    }

    get isFlipUp() {
        return this._isFlipUp;
    }

    set isMatched(isMatch) {
        this._isMatch = isMatch;
    }

    get isMatched() {
        return this._isMatch;
    }

    isMatchWith(card) {
        return card.index === this._matchIndex;
    }
}

class CardGame {
    constructor(numberCards) {
        this._numberCards = numberCards;
        this._previousChoose = null;
        this._arrCards = [];
    }



    init() {
        let indexSet = new Set(Array.from({ length: this._numberCards }, (_, idx) => idx));
        this._arrCards = Array.from({ length: this._numberCards }, (_, index) => {

            let indexArr = Array.from(indexSet);
            let matchIndex = 0;

            do {
                let randIndex = Math.floor(Math.random() * indexArr.length);
                matchIndex = indexArr[randIndex];
            } while (matchIndex === index)

            let newCard = new Card(index, matchIndex);
            indexSet.delete(matchIndex);

            console.log(`${newCard.index} match with ${newCard.matchIndex}`);
            return newCard;
        });
    }


    chooseCard(index) {
        let cardChosen = _arrCards[index];

        //card is first chose
        if (!cardChosen.isFlipUp && !_previousChose) {
            cardChosen.isFlipUp = true;
            _previousChose = cardChosen;
        }

        // card is second chose
        else if (!cardChosen.isFlipUp && _previousChose) {
            cardChosen.isFlipUp = true;

            if (cardChosen.isMatchWith(_previousChose)) {
                cardChosen.isMatch = _previousChose.isMatch = true;
            }
            else {
                cardChosen.isFlipUp = _previousChose.isFlipUp = false;
            }
            _previousChose = null;
        }
    }
}

class CardViewControl {
    constructor() {
        this._DOMString = {
            teamType: '#teams',
            newButton: '.new-btn',
            card: '.card',
            cardBackground: '.flip-down',
            gameBoard: '.game-board',
        };

        this._cardNumber = 16;
        this._gridCards = [];

    }

    init() {
        this.createCardGrid();
    }

    createCard() {
        let cardElement = document.createElement('div');
        cardElement.classList.add(this._DOMString.card.substring(1));
        cardElement.classList.add(this._DOMString.cardBackground.substring(1));
        return cardElement;
    }

    createCardGrid() {
        let gameBoardElement = document.querySelector(this._DOMString.gameBoard);
        gameBoardElement.innerHTML = '';

        for (let idx = 0; idx < this._cardNumber; ++idx) {
            let cardElement = this.createCard();
            cardElement.id = 'card-' + idx
            gameBoardElement.appendChild(cardElement);
            this._gridCards.push(cardElement);
        }

    }


    get newButtonElement() {
        return document.querySelector(this._DOMString.newButton);
    }

    get cardElements() {
        return this._gridCards;
    }
}




class EventHandler {

    constructor(viewController, gameController) {
        this._viewController = viewController;
        this._gameController = gameController;
    }

    setUpCardEvents() {
        this._viewController.cardElements.forEach((cardElement, idx) => {
            cardElement.addEventListener('click', () => {
                //TODO flip card event

            });
        });
    }

    setUpNewGameListener() {
        this._viewController.newButtonElement.addEventListener('click', () => {
            this._viewController.init();
            this._gameController.init();
            this.setUpCardEvents();
        })
    }


}

let numberCards = 16;
let viewController = new CardViewControl();
let gameController = new CardGame(numberCards);
let eventHandler = new EventHandler(viewController, gameController);

eventHandler.setUpNewGameListener();


