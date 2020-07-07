class Card {
    constructor(cardIndex, matchIndex) {
        this._cardIndex = cardIndex;
        this._matchIndex = matchIndex;
    }

    get index() {
        return this._cardIndex;
    }

    isCardMatchWith(card) {
        return card.index === this._matchIndex;
    }
}

let CardGame = (function(numberCards){
    this._numberCards = numberCard;

    this.init = function() {
        let cardArray = [];
        let setUsedNumber = new Set();
        
        for (cardIndex = 0; cardIndex < this._numberCards; ++cardIndex) {
            
            let randIdx = Math.floor(Math.random() * this._numberCards);
            if (randIdx)
            
            setUsedNumber.add()
            
            let newCard = newCard(cardIndex, );
            cardArray.push(newCard);
        }
    }
})();


