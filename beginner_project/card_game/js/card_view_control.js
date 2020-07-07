class CardViewControl {
    constructor() {
        this._DOMString = {
            teamType: '#teams',
            newButton: '.new-btn',

        };

        this._cardNumber = 16;

    }

    init() {
        console.log('init set up....');
    }

    get newButtonElement() {
        return document.querySelector(this._DOMString.newButton);
    }
}




class EventHandler {

    constructor(viewControl) {
        this._viewControl = viewControl;
    }

    clickOnNewGame() {
        this._viewControl.newButtonElement.addEventListener('click', () => {
            this._viewControl.init();
        })
    }
}

let viewControler = new CardViewControl();
let eventHandler = new EventHandler(viewControler);

eventHandler.clickOnNewGame();


