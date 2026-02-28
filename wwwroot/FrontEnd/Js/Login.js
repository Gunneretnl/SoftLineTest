document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario")?.value.trim();
        const senha = document.getElementById("senha")?.value.trim();

        if (!usuario || !senha) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            const res = await fetch("https://localhost:7272/api/Usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Login: usuario, Senha: senha })
            });

            if (!res.ok) {
                alert("Usuário ou senha inválidos");
                return;
            }

            const data = await res.json();
            console.log("RESPOSTA LOGIN:", data);

            if (!data.token) {
                alert("Login feito, mas o token não foi retornado pela API.");
                console.log("Token ausente. Resposta:", data);
                return;
            }

            localStorage.setItem("token", data.token);

            localStorage.setItem("usuarioLogado", JSON.stringify({
                nome: data.nome || "",
                perfil: data.perfil || ""
            }));

            console.log("TOKEN SALVO AGORA:", localStorage.getItem("token"));

            window.location.href = "menu.html";

        } catch (err) {
            console.error(err);
            alert("Erro de conexão, tente novamente.");
        }
    });
});