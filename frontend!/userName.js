async function fetchUserData() {
    try {
        const response = await fetch("http://localhost:5000/api/auth/status", {
            method: "GET",
            credentials: "include", // Чтобы куки передавались
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Ошибка при получении данных");
        }

        const user = await response.json();
        document.getElementById("username").textContent = user.username; // Меняем имя
        document.getElementById("logout-btn").style.display = "inline-block"; // Показываем кнопку выхода
    } catch (error) {
        console.error("Ошибка:", error.message);
    }
}

// Вызываем при загрузке страницы
fetchUserData();

// Логаут
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        location.reload(); // Перезагружаем страницу после выхода
    } catch (error) {
        console.error("Ошибка при выходе:", error.message);
    }
});
