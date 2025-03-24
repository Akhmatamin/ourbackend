document.getElementById("LoginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

   
    const username = document.getElementById("login-name").value;
    const password = document.getElementById("login-password").value;

    const loginData = { username, password };

    try {
        
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify(loginData),
        });

        
        if (!response.ok) {
            const text = await response.text(); 
            try {
                const errorData = JSON.parse(text); 
                alert(errorData.error || "Login failed");
            } catch {
                alert(`Ошибка ${response.status}: ${text}`); // Если JSON невалиден, показываем текст
            }
            return;
        }

        // Проверяем, содержит ли ответ JSON
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Пытаюсь перенаправить...");
            window.location.href = "/frontend!/index.html"; 
        } else {
            console.error("Unexpected response format:", await response.text());
            alert("Unexpected response format from server.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
});
