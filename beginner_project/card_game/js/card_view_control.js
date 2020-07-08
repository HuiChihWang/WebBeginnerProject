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
    }

    init() {
        this._previousChoose = null;
        this._arrCards = [];

        this._pairCards = numberCards / 2;

        for (let pair = 0; pair < this._pairCards; ++pair) {
            let newCardIndex = pair * 2;
            let matchIndex = newCardIndex + 1;
            let newCard = new Card(newCardIndex, matchIndex);
            let matchCard = new Card(matchIndex, newCardIndex);
            
            this._arrCards.push(newCard);
            this._arrCards.push(matchCard);
        } 
    }


    chooseCard(index) {
        let cardChosen = this._arrCards[index];

        //card is first chose
        if (!cardChosen.isFlipUp && !this._previousChoose) {

            cardChosen.isFlipUp = true;
            this._previousChoose = cardChosen;

            console.log(`[First Choose] choose card ${cardChosen.index}`);

        }

        // card is second chose
        else if (!cardChosen.isFlipUp && this._previousChoose) {

            cardChosen.isFlipUp = true;

            if (cardChosen.isMatchWith(this._previousChoose)) {
                cardChosen.isMatch = this._previousChoose.isMatch = true;
                console.log(`[Final Choose] card ${cardChosen.index} match with card ${this._previousChoose.index}`);
            }
            else {
                cardChosen.isFlipUp = this._previousChoose.isFlipUp = false;
                console.log(`[Final Choose] card ${cardChosen.index} fail to match with card ${this._previousChoose.index}`);
            }
            this._previousChoose = null;
        }

        else {
            console.log(`[None] Card ${cardChosen.index} is Flip Up`);
        }
    }
}

class CardViewControl {
    constructor() {
        this._DOMString = {
            teamType: 'teams',
            newButton: '.new-btn',
            card: '.card',
            cardBackground: '.flip-down',
            gameBoard: '.game-board',
        };

        

        this._imageSet = {
            'spur': [
                'spur-kawhi',
                'spur-tony',
                'spur-tim',
                'sput-manu',
                'spur-danny',
                'spur-paty',
                'spur-bowen',
                'spur-robinson'
            ],

            'laker': [],

            'warriors': [],

            'celtics': [],

        };

        this._cardNumber = 16;
        this._gridCards = [];

    }

    



    init() {
        let selectValue = document.getElementById(this._DOMString.teamType).value;
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

    flipCard(cardElement) {
        let carElementClass = cardElement.classList;
        let card
        if (carElementClass.includes(this._DOMString.cardBackground)){
            carElementClass.remove(this._DOMString.cardBackground);
            cardElementClass.add();
        }
        else {

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

    getCardIndexFromElement(cardElement) {
        let strCardIndex = cardElement.id.split('-')[1];
        return Number(strCardIndex);
    }
    setUpCardEvents() {
        this._viewController.cardElements.forEach((cardElement, idx) => {
            cardElement.addEventListener('click', () => {
                //TODO click card event
                console.log(`element with id ${cardElement.id} is clicked.`);

                // choose card in game control
                let cardIndex = this.getCardIndexFromElement(cardElement);
                console.log(cardIndex);
                gameController.chooseCard(cardIndex);

                //update view
                cardElement.classList
            });
        });
    }

    setUpNewGameListener() {
        this._viewController.newButtonElement.addEventListener('click', () => {

            //init controller 
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


