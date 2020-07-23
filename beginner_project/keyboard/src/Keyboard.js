const state = {
    keyBoardView: null,
};

const elementStrings = {
    keyBoardMain: 'keyboard',
    keyLine: 'keyboard__keys',
    wideKey: 'keyboard__key--wide',
    extraWideKey: 'keyboard__key--extra-wide',
    darkKey: 'keyboard__key--dark',
};

const specialKey = {
    'backspace': [elementStrings.wideKey],
    'keyboard_capslock': [elementStrings.wideKey],
    'check_circle': [elementStrings.darkKey, elementStrings.darkKey],
    'space_bar': [elementStrings.extraWideKey],
    'keyboard_return': [elementStrings.wideKey],
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
    button.setAttribute('class', 'keyboard__key');
    // button.textContent = key;

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
    specialKey[key].forEach(classElement=>{
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

const controlKeyBoard = () => {
    console.log(`control Keyboard`);

    createEmptyKeyBoard();
    renderKeys();
};

window.onload = controlKeyBoard;


