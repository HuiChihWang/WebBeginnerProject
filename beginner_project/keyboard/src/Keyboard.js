const state = {
    keyBoardView: null,
    textArea: document.getElementsByTagName('textarea')[0],
};

const elementStrings = {
    keyBoardMain: 'keyboard',
    keyButton: 'keyboard__key',
    keyLine: 'keyboard__keys',
    wideKey: 'keyboard__key--wide',
    extraWideKey: 'keyboard__key--extra-wide',
    darkKey: 'keyboard__key--dark',
    activatableKey: 'keyboard__key--activatable',
};

const specialKey = {
    'backspace': {
        class: [elementStrings.wideKey],
        content: '',
        action: () => {
            state.textArea.value = state.textArea.value.slice(0, -1);
        }
    }
    ,
    'keyboard_capslock': {
        class: [elementStrings.wideKey, elementStrings.activatableKey],
        content: '',
        action: () => { },
    },
    'check_circle': {
        class: [elementStrings.darkKey, elementStrings.extraWideKey],
        content: '',
    },
    'space_bar': {
        class: [elementStrings.extraWideKey],
        content: ' ',
        action: () => { },
    },
    'keyboard_return': {
        class: [elementStrings.wideKey],
        content: '\n',
        action: ()=>{},
    }
}

const keyBoardPattern = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['keyboard_capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'keyboard_return'],
    ['check_circle', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'],
    ['space_bar'],
]

const createButton = key => {
    const button = document.createElement('button');
    button.setAttribute('class', elementStrings.keyButton);

    if (key in specialKey) {
        processSpecialButton(button, key);
        button.innerHTML = createIconHTML(key);
    }
    else {
        button.innerHTML = key;
    }

    return button;
};

const processSpecialButton = (button, key) => {
    specialKey[key].class.forEach(classElement => {
        button.classList.add(classElement);
    });
};

const createIconHTML = key => {
    return `<i class="material-icons">${key}</i>`;
}
const createEmptyKeyBoard = () => {
    const keyBoardView = document.createElement('div');
    keyBoardView.setAttribute('class', elementStrings.keyBoardMain);
    document.body.appendChild(keyBoardView);
    state.keyBoardView = keyBoardView;
};

const renderKeys = () => {
    keyBoardPattern.forEach(keyBoardLine => {
        const keyLine = document.createElement('div');
        keyLine.setAttribute('class', elementStrings.keyLine);

        keyBoardLine.forEach(key => {
            const button = createButton(key);
            keyLine.appendChild(button);
        });

        state.keyBoardView.appendChild(keyLine);
    });
};

const initKeyboard = () => {
    console.log(`init Keyboard`);

    createEmptyKeyBoard();
    renderKeys();

    state.keyBoardView.addEventListener('click', keyController);
};

window.onload = initKeyboard;

const keyController = event => {
    const button = event.target.closest(`.${elementStrings.keyButton}`);
    if (button) {
        inputButton(button);
    }
}

const inputButton = keyButton => {
    const key = keyButton.textContent;

    if (key in specialKey) {
        state.textArea.value += specialKey[key].content;
        specialKey[key].action();
    }
    else {
        state.textArea.value += key;
    }
}


