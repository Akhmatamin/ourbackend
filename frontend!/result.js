function sendResults(score) {
    const data = {
        score: score,
    };

    // Отправка данных на сервер
    fetch('http://localhost:3000/results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Результаты успешно отправлены:', data);
    })
    .catch(error => {
        console.error('Ошибка при отправке результатов:', error);
    });
}
