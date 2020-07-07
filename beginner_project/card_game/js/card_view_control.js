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

        for (let idx = 0; idx < this._cardNumber; ++idx){
            let cardElement = this.createCard();
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

    constructor(viewControl) {
        this._viewControl = viewControl;
    }

    setUpCardEvents() {
        this._viewControl.cardElements.forEach((cardElement, idx)=>{ 
            cardElement.addEventListener('click', ()=>{
                //TODO flip card event
                console.log(`Card No.${idx} is clicked`);
            });
        });
    }

    setUpNewGameListener() {
        this._viewControl.newButtonElement.addEventListener('click', () => {
            this._viewControl.init();
            this.setUpCardEvents();
        })
    }

    
}

let viewControler = new CardViewControl();
let eventHandler = new EventHandler(viewControler);

eventHandler.setUpNewGameListener();


