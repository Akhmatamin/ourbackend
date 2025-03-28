document.addEventListener("DOMContentLoaded", () => {
    const usernameEl = document.getElementById("username");
    const logoutBtn = document.getElementById("logout-btn");
  
    // Получаем имя пользователя с сервера
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => {
        usernameEl.textContent = data.username;
        logoutBtn.style.display = "inline-block"; // показать кнопку logout
      })
      .catch(() => {
        usernameEl.textContent = "Guest";
        logoutBtn.style.display = "none"; // скрыть logout
      });
  
    // Обработчик выхода
    logoutBtn.addEventListener("click", () => {
      fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
        .then(() => {
          usernameEl.textContent = "Guest";
          logoutBtn.style.display = "none";
          window.location.reload(); // обновить страницу после выхода
        })
        .catch(() => {
          alert("Ошибка при выходе");
        });
    });
  });
  