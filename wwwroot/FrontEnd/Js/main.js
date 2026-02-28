document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const erroEl = document.getElementById("erro");
    const loader = document.getElementById("loader");

    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    usuarioInput.classList.remove("is-invalid");
    senhaInput.classList.remove("is-invalid");
    erroEl.textContent = "";

    if (!usuario || !senha) {
        if (!usuario) usuarioInput.classList.add("is-invalid");
        if (!senha) senhaInput.classList.add("is-invalid");
        erroEl.textContent = "Preencha todos os campos";
        return;
    }

    loader.classList.remove("d-none");

    try {
        const data = await fakeLoginAPI(usuario, senha);

        if (data.sucesso) {
            window.location.href = "menu.html";
        } else {
            erroEl.textContent = data.mensagem;
            usuarioInput.classList.add("is-invalid");
            senhaInput.classList.add("is-invalid");
        }

    } catch {
        erroEl.textContent = "Erro de conexão, tente novamente.";
    } finally {
        loader.classList.add("d-none");
    }
});

function fakeLoginAPI(usuario, senha) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (usuario === "admin" && senha === "1234") {
                resolve({ sucesso: true });
            } else {
                resolve({ sucesso: false, mensagem: "Usuário ou senha inválidos!" });
            }
        }, 1000);
    });
}