class Card {
    constructor(cardIndex, matchIndex) {
        this._cardIndex = cardIndex;
        this._matchIndex = matchIndex;
        this._isFlipUp = false;
        this._isMatch = false;
        this._isVisit = false;
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

    set isVisited(isVisit) {
        this._isVisit = isVisit;
    }
    get isVisited() {
        return this._isVisit;
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
        this._pairNum = 0;
        this._score = 0;
        this._count = 0;

        for (let pair = 0; pair < this._pairCards; ++pair) {
            let newCardIndex = pair * 2;
            let matchIndex = newCardIndex + 1;
            let newCard = new Card(newCardIndex, matchIndex);
            let matchCard = new Card(matchIndex, newCardIndex);

            this._arrCards.push(newCard);
            this._arrCards.push(matchCard);
        }
    }

    get NumberOfPairs() {
        return this._pairNum;
    }

    get failMatchIndexes() {
        return this._failMatchIndexes;
    }

    get gameScore() {
        return this._score;
    }

    get flipCount() {
        return this._count;
    }

    get isGameFinish() {
        return this._pairNum === this._pairCards;
    }

    chooseCard(index) {
        let cardChosen = this._arrCards[index];
        this._failMatchIndexes = [];

        if (!cardChosen.isFlipUp && !this._previousChoose) {

            cardChosen.isFlipUp = true;
            this._previousChoose = cardChosen;

            console.log(`[First Choose] choose card ${cardChosen.index}`);
        }

        else if (!cardChosen.isFlipUp && this._previousChoose) {
            cardChosen.isFlipUp = true;

            if (cardChosen.isMatchWith(this._previousChoose)) {
                cardChosen.isMatch = this._previousChoose.isMatch = true;
                this._pairNum += 1;
                this._score += 3;
                console.log(`[Final Choose] card ${cardChosen.index} match with card ${this._previousChoose.index}`);
            }
            else {
                cardChosen.isFlipUp = this._previousChoose.isFlipUp = false;
                this._failMatchIndexes = [cardChosen.index, this._previousChoose.index];

                if (cardChosen.isVisited || this._previousChoose.isVisited) {
                    this._score -= 1;
                    this._score = Math.max(this._score, 0);
                }

                console.log(`[Final Choose] card ${cardChosen.index} fail to match with card ${this._previousChoose.index}`);
            }
            cardChosen.isVisited = this._previousChoose.isVisited = true;
            this._previousChoose = null;
        }

        else {
            console.log(`[None] Card ${cardChosen.index} is Flip Up`);
            return false;
        }

        this._count += 1;
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
            scoreBoard: '.score-board',
            banner: '.bg-img',


            pairNumber: '#pair-number',
            scoreNumber: '#score-number',
            countNumber: '#count-number',

            finish: '.finish',

            getPureClassName: strClass => strClass.substring(1),
        };

        this._imageSet = {
            'spur': {
                'banner': 'spur-banner',
                'card-set': [
                    'spur-kawhi',
                    'spur-tony',
                    'spur-tim',
                    'spur-manu',
                    'spur-danny',
                    'spur-paty',
                    'spur-bowen',
                    'spur-robinson',
                ],
            },

            'laker': {
                'banner': 'laker-banner',
                'card-set': [
                    'laker-kobe',
                    'laker-lebron',
                    'laker-kcp',
                    'laker-kuzma',
                    'laker-ad',
                    'laker-dwight',
                    'laker-caruso',
                    'laker-rondo',
                ],
            },

            'warriors': {
                'banner': 'warriors-banner',
                'card-set': [
                    'warriors-curry',
                    'warriors-klay',
                    'warriors-durant',
                    'warriors-green',
                    'warriors-looney',
                    'warriors-bogut',
                    'warriors-shawn',
                    'warriors-igu',
                ],
            },

            'celtics': {
                'banner': 'celtics-banner',
                'card-set': [
                    'celtics-hayward',
                    'celtics-smart',
                    'celtics-thomas',
                    'celtics-brown',
                    'celtics-tatum',
                    'celtics-pierce',
                    'celtics-garnett',
                    'celtics-ray',
                ],
            },
        };

        this._cardNumber = 16;
        this._pairNums = this._cardNumber / 2;
    }

    init() {
        this.teamType = document.querySelector(this._DOMString.teamType).value;
        this.updateBanner();
        this.clearCardGrid();
        this.createCardGrid();
        this.updateScores(0, 0, 0);
        this.updateFinish(false);
    }

    clearCardGrid() {
        this._gridCards = [];
        let gameBoardElement = document.querySelector(this._DOMString.gameBoard);
        gameBoardElement.querySelectorAll('*').forEach(node => node.remove());
    }

    createCard() {
        let cardElement = document.createElement('div');
        cardElement.classList.add(this._DOMString.getPureClassName(this._DOMString.card));
        cardElement.classList.add(this._DOMString.getPureClassName(this._DOMString.cardBackground));
        return cardElement;
    }

    createCardGrid() {
        let gameBoardElement = document.querySelector(this._DOMString.gameBoard);
        let cardSet = this._imageSet[this.teamType]['card-set'];

        for (let idx = 0; idx < this._cardNumber; ++idx) {
            let cardElement = this.createCard();
            this._gridCards.push(cardElement);
        }

        let setUsedNumber = new Set(Array.from({ length: this._cardNumber }, (_, idx) => idx));
        this._gridCards.forEach((cardElement) => {
            let chooseIdxArray = Array.from(setUsedNumber);
            let randIdx = Math.floor(Math.random() * chooseIdxArray.length);
            let randCardIdx = chooseIdxArray[randIdx];
            setUsedNumber.delete(randCardIdx);

            cardElement.id = 'card-' + randCardIdx;
            cardElement.classList.add(cardSet[Math.floor(randCardIdx / 2)]);
            gameBoardElement.appendChild(cardElement);
        });

        console.log(gameBoardElement);
    }

    updateCardGrid(arrUpdateCardIndex) {
        arrUpdateCardIndex.forEach((cardIndex) => {
            let cardElement = document.getElementById('card-' + cardIndex);
            this.flipCard(cardElement);
        });
    }

    updateBanner() {
        let bannerElement = document.querySelector(this._DOMString.banner);
        bannerElement.className = "";
        bannerElement.classList.add(this._DOMString.getPureClassName(this._DOMString.banner));
        bannerElement.classList.add(this._imageSet[this.teamType]['banner']);
    }

    updateScores(score, pair, count) {
        let countElement = document.querySelector(this._DOMString.countNumber);
        let scoreElement = document.querySelector(this._DOMString.scoreNumber);
        let pairElement = document.querySelector(this._DOMString.pairNumber);

        countElement.textContent = count;
        scoreElement.textContent = score;
        pairElement.textContent = pair + ' / ' + this._pairNums;

    }

    updateFinish(isFinish) {

        let finishElement = document.querySelector(this._DOMString.finish);
        let scoreBoardElement = document.querySelector(this._DOMString.scoreBoard);

        if (!isFinish) {
            if (finishElement != null){
                finishElement.remove();
            }
        }
        else {
            finishElement = document.createElement('div');
            finishElement.classList.add(this._DOMString.getPureClassName(this._DOMString.finish));
            finishElement.textContent = 'Finish';
            scoreBoardElement.appendChild(finishElement);
        }
    }

    flipCard(cardElement) {
        let cardElementClass = cardElement.classList;
        let backgroundClass = this._DOMString.getPureClassName(this._DOMString.cardBackground);

        if (cardElementClass.contains(backgroundClass)) {
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

    init() {
        this._viewController.init();
        this._gameController.init();
        this.setUpCardEvents();
    }

    getCardIndexFromElement(cardElement) {
        let strCardIndex = cardElement.id.split('-')[1];
        return Number(strCardIndex);
    }
    setUpCardEvents() {
        this._viewController.cardElements.forEach((cardElement) => {
            cardElement.addEventListener('click', () => {
                console.log(`element with id ${cardElement.id} is clicked.`);

                let cardIndex = this.getCardIndexFromElement(cardElement);
                let isChooseSucess = gameController.chooseCard(cardIndex);

                if (isChooseSucess) {
                    console.log('Choose Sucess');
                    this._viewController.updateCardGrid([cardIndex]);

                    if (this._gameController.failMatchIndexes.length > 0) {

                        (function (viewControl, gameConntrol) {
                            setTimeout(function () {
                                console.log('match Faill.')
                                viewControl.updateCardGrid(gameConntrol.failMatchIndexes);
                            }, 500);
                        })(this._viewController, this._gameController);
                    }

                    this._viewController.updateScores(this._gameController.gameScore,
                        this._gameController.NumberOfPairs,
                        this._gameController.flipCount);

                        if (this._gameController.isGameFinish) {
                            this._viewController.updateFinish(true);
                        }


                }

            });
        });
    }

    setUpNewGameListener() {
        this._viewController.newButtonElement.addEventListener('click', () => {
            this.init();
        })
    }
}

let numberCards = 16;
let viewController = new CardViewControl();
let gameController = new CardGame(numberCards);
let eventHandler = new EventHandler(viewController, gameController);

eventHandler.init();
eventHandler.setUpNewGameListener();


