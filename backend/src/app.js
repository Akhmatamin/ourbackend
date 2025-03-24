const pool = require("./database");

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Текущее время в БД:", res.rows[0].now);
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
})();
