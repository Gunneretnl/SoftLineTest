document.addEventListener("DOMContentLoaded", () => {
    const usuarioStr = localStorage.getItem("usuarioLogado");
    const token = localStorage.getItem("token");

    if (!usuarioStr || !token) {
        window.location.href = "login.html";
        return;
    }

    let usuario = null;
    try {
        usuario = JSON.parse(usuarioStr);
    } catch {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }

    const nomeEl = document.getElementById("usuarioNome");
    const perfilEl = document.getElementById("usuarioPerfil");
    const logoutBtn = document.getElementById("btnLogout");

    const nome = usuario.nome || usuario.Nome || "";
    const perfil = usuario.perfil || usuario.Perfil || "";

    if (nomeEl) nomeEl.textContent = nome;
    if (perfilEl) perfilEl.textContent = perfil ? `(${perfil})` : "";

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });
    }
});