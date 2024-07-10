const textMain = document.querySelector('.textarea-main');
const textAuxiliary = document.querySelector('.textarea-auxiliary');
const copyButton = document.querySelector('.copy-button');
const awaitingInputImage = document.querySelector('.awaiting-input');
const instructions = document.querySelector('.textarea-additional');

textMain.addEventListener('input', handleTextInput);
window.addEventListener('resize', handleWindowResize);

function handleTextInput(event) {
    const text = textMain.value.trim();

    if (text === '') {
        resetTextAuxiliary();
        toggleElements(false);
    } else {
        toggleElements(true);
    }

    if (window.innerWidth <= 1024) {
        awaitingInputImage.style.display = 'none';
    }
}

function handleWindowResize() {
    checkWindowSize();
}

function checkWindowSize() {
    const isMobileOrTablet = window.innerWidth <= 1024;
    if (textMain.value.trim() === '' && textAuxiliary.value.trim() === '') {
        awaitingInputImage.style.display = isMobileOrTablet ? 'none' : 'block';
    }
}

function encryptionbutton() {
    const encryptedText = encrypt(textMain.value);
    textAuxiliary.value = encryptedText;
    processTextAuxiliary(encryptedText);

    textMain.value = '';
}

function decryptbutton() {
    const decryptedText = decrypt(textMain.value);
    textAuxiliary.value = decryptedText;
    processTextAuxiliary(decryptedText);

    textMain.value = '';
}

async function copybutton() {
    try {
        await navigator.clipboard.writeText(textAuxiliary.value);
        showNotification('Success', 'Texto copiado com sucesso');
    } catch (err) {
        console.error('Erro ao copiar o texto: ', err);
        showNotification('error', 'Houve um erro ao tentar copiar o texto.');
    }
}

function encrypt(string) {
    const cipher = [["e", "enter"], ["i", "imes"], ["a", "ai"], ["o", "ober"], ["u", "ufat"]];
    return transformText(string, cipher);
}

function decrypt(string) {
    const cipher = [["e", "enter"], ["i", "imes"], ["a", "ai"], ["o", "ober"], ["u", "ufat"]];
    return transformText(string, cipher, true);
}

function transformText(string, cipher, reverse = false) {
    string = string.toLowerCase();

    for (let [key, value] of cipher) {
        if (reverse) [key, value] = [value, key];
        string = string.replaceAll(key, value);
    }

    return string;
}

function resetTextAuxiliary() {
    textAuxiliary.value = ''; 
    copyButton.style.display = 'none'; 
    awaitingInputImage.style.display = 'block'; 
    instructions.style.display = 'block'; 
}

function toggleElements(show) {
    copyButton.style.display = show ? 'block' : 'none';
}

function processTextAuxiliary(text) {
    if (text.trim() === "") {
        resetTextAuxiliary();
    } else {
        awaitingInputImage.style.display = 'none';
        instructions.style.display = 'none';
        autoExpandTextarea(textAuxiliary);
        toggleElements(true);
    }
}

function showNotification(icon, text) {
    Swal.fire({
        icon: icon,
        text: text,
        showConfirmButton: false,
        timer: 1500
    });
}

function autoExpandTextarea(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

textMain.addEventListener('input', function(event) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const key = event.data ? event.data.toLowerCase() : '';

    if (event.data && event.data.toUpperCase() === event.data) {
        this.value = this.value.substring(0, start - 1) + key + this.value.substring(end);
        this.setSelectionRange(start, start); 
    }

    const withoutAccents = this.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (this.value !== withoutAccents) {
        this.value = withoutAccents;
        this.setSelectionRange(start - 1, start - 1);
    }
});