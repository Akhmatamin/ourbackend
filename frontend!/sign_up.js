document.getElementById('SignUpForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Предотвращаем стандартное отправление формы

  // Сбор данных из формы
  const form = new FormData(event.target);
  const data = {
      username: form.get('username'),
      password: form.get('password'),
      confirmPassword: form.get('confirm-password'),
  };

  // Проверка, что пароли совпадают
  if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
  }

  // Отправка данных на сервер
  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Обработка ответа от сервера
      if (response.ok) {
          alert(result.message); // Показываем сообщение от сервера
          console.log("Пытаюсь перенаправить...");
          window.location.href = "/frontend!/login.html"; // Перенаправление на страницу входа
      } else {
          alert(result.message); // Если произошла ошибка, выводим ее
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
  }
});
