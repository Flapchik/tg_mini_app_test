const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const initData = tg.initData;
const API_URL = 'https://ai-sous-chef.ru/app/api/v1/recognize';

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'screen-input') {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }
}

tg.BackButton.onClick(() => showScreen('screen-input'));

async function sendToServer() {
    const code = document.getElementById('userProducts').value;
    if (!code) {
        tg.showAlert('Введите список продуктов!');
        return;
    }

    showScreen('screen-loading');

    try {
        const response = await fetch('https://ai-sous-chef.ru/app/api/v2/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                     'x_api_key': initData},
            body: JSON.stringify({
                products: code.split(',').map(p => p.trim())
            })
        });

        const data = await response.json();

        document.getElementById('resultText').textContent = JSON.stringify(data, null, 2);
        showScreen('screen-result');
        
        if (data.success) {
            tg.HapticFeedback.notificationOccurred('success');
        } else {
            tg.HapticFeedback.notificationOccurred('error');
        }

    } catch (error) {
        tg.showAlert('Ошибка соединения с сервером');
        showScreen('screen-input');
    }
}
