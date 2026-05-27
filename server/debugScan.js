(async () => {
  const SERVER = "http://localhost:5000";
  try {
    const login = await fetch(`${SERVER}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "aarav.sharma@test.com", password: "Aarav@123" }),
    });
    const loginData = await login.json();
    console.log("login", login.status, loginData);
    if (!loginData.token) {
      console.error("No auth token returned");
      process.exit(1);
    }
    const token = loginData.token;
    const res = await fetch(`${SERVER}/api/ai/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Black_labrador_retriever_portrait.jpg/320px-Black_labrador_retriever_portrait.jpg",
      }),
    });
    const text = await res.text();
    console.log("scan", res.status, text);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
