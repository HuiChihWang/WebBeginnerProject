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
        this._failMatchIndexes = [];
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

    get failMatchIndexes() {
        return this._failMatchIndexes;
    }

    chooseCard(index) {
        let cardChosen = this._arrCards[index];
        this._failMatchIndexes = [];

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
                this._failMatchIndexes = [cardChosen.index, this._previousChoose.index];
                console.log(`[Final Choose] card ${cardChosen.index} fail to match with card ${this._previousChoose.index}`);
            }
            this._previousChoose = null;
        }

        else {
            console.log(`[None] Card ${cardChosen.index} is Flip Up`);
            return false;
        }

        return true;
    }
}

class CardViewControl {
    constructor() {
        this._DOMString = {
            teamType: '.team-select',
            newButton: '.new-btn',
            card: '.card',
            cardBackground: '.flip-down',
            gameBoard: '.game-board',

            getPureClassName: strClass => strClass.substring(1),
        };

        this._imageSet = {
            'spur': [
                'spur-kawhi',
                'spur-tony',
                'spur-tim',
                'spur-manu',
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
        let selectValue = document.querySelector(this._DOMString.teamType).value;
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
        let teamType = document.querySelector(this._DOMString.teamType).value;
        let cardSet = this._imageSet[teamType]; 

 
        
        for (let idx = 0; idx < this._cardNumber; ++idx) {
            let cardElement = this.createCard();
            this._gridCards.push(cardElement);
        }

        let setUsedNumber = new Set(Array.from({length: this._cardNumber}, (_, idx)=>idx));
        this._gridCards.forEach((cardElement)=>{
            let chooseIdxArray = Array.from(setUsedNumber);
            let randIdx = Math.floor(Math.random() * chooseIdxArray.length);
            let randCardIdx = chooseIdxArray[randIdx];
            setUsedNumber.delete(randCardIdx);

            cardElement.id = 'card-' + randCardIdx;
            cardElement.classList.add(cardSet[Math.floor(randCardIdx/2)]);
            gameBoardElement.appendChild(cardElement);
        });
    }

    updateView(arrUpdateCardIndex) {
        arrUpdateCardIndex.forEach((cardIndex)=>{
            let cardElement = document.getElementById('card-' + cardIndex);
            this.flipCard(cardElement);
        });
    }

    flipCard(cardElement) {
        let cardElementClass = cardElement.classList;
        let backgroundClass = this._DOMString.getPureClassName(this._DOMString.cardBackground);

        if (cardElementClass.contains(backgroundClass)){
            cardElementClass.remove(backgroundClass);
        }
        else {
            cardElementClass.add(backgroundClass);
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
        console.log(this._viewController.cardElements);
        this._viewController.cardElements.forEach((cardElement) => {
            cardElement.addEventListener('click', () => {
                //TODO click card event
                console.log(`element with id ${cardElement.id} is clicked.`);

                // choose card in game control
                let cardIndex = this.getCardIndexFromElement(cardElement);
                let isChooseSucess = gameController.chooseCard(cardIndex);
                //update view

                if (isChooseSucess){
                    console.log('Choose Sucess');
                    this._viewController.updateView([cardIndex]);

                    if (this._gameController.failMatchIndexes.length > 0){
                        console.log('match Fail');

                        (function(viewControl, gameConntrol) {
                            setTimeout(function(){
                                viewControl.updateView(gameConntrol.failMatchIndexes);
                            }, 800);
                        })(this._viewController, this._gameController);
                    }
                }
                
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


