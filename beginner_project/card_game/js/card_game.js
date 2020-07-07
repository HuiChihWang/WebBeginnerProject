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

let numberCards = 16;
let cardGame = (function(numberCards){
    let _numberCards = numberCards;
    let _previousChose = null;
    let _arrCards = [];

    let selectRandMatchIdx = function(cardIndex, setUsedNumber) {
        let randMatchIdx;

        do {
            randMatchIdx = Math.floor(Math.random() * _numberCards);
        } while(setUsedNumber.has(randMatchIdx) || randMatchIdx === cardIndex)

        setUsedNumber.add(randMatchIdx);
        return randMatchIdx;
    }

    return {
        init: function() {
            let setUsedNumber = new Set();
            
            for (cardIndex = 0; cardIndex < _numberCards; ++cardIndex) {
                let newCard = new Card(cardIndex, selectRandMatchIdx(cardIndex, setUsedNumber));
                _arrCards.push(newCard);
                console.log(`${newCard.index} with match index ${newCard.matchIndex}`);
            }
        },

        chooseCard: function(index) {
            let cardChosen = _arrCards[index];

            //card is first chose
            if (!cardChosen.isFlipUp && !_previousChose) {
                cardChosen.isFlipUp = true;
                _previousChose = cardChosen;
            }

            // card is second chose
            else if(!cardChosen.isFlipUp && _previousChose) {
                cardChosen.isFlipUp = true;

                if (cardChosen.isMatchWith(_previousChose)) {
                    cardChosen.isMatch  = _previousChose.isMatch = true;
                }
                else {
                    cardChosen.isFlipUp = _previousChose.isFlipUp = false;
                }
                _previousChose = null;
            }

        },

    };
})(numberCards);


cardGame.init();


