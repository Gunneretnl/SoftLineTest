document.addEventListener("DOMContentLoaded", () => {
    const API_USUARIOS = "https://localhost:7272/api/Usuarios";

    const btnNovoUsuario = document.getElementById("btnNovoUsuario");
    const usuarioModal = new bootstrap.Modal(document.getElementById("usuarioModal"));
    const formUsuario = document.getElementById("formUsuario");

    const tabelaUsuariosBody = document.querySelector("#tabelaUsuarios tbody");
    const pesquisaUsuariosInput = document.getElementById("pesquisaUsuarios");

    const nomeInput = document.getElementById("nomeUsuario");
    const loginInput = document.getElementById("loginUsuario");
    const senhaInput = document.getElementById("senhaUsuario");
    const perfilSelect = document.getElementById("perfilUsuario");

    let usuarios = [];
    let usuarioEditando = null;

    async function init() {
        await carregarUsuarios();
    }

    async function carregarUsuarios() {
        try {
            const res = await fetch(API_USUARIOS);
            usuarios = await res.json();

            tabelaUsuariosBody.innerHTML = usuarios.map(u => `
                <tr>
                    <td>${u.Id}</td>
                    <td>${u.Nome}</td>
                    <td>${u.Login}</td>
                    <td>${u.Perfil || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editarUsuario(${u.Id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarUsuario(${u.Id})">Deletar</button>
                    </td>
                </tr>
            `).join("");
        } catch (err) {
            console.error("Erro ao carregar usuários", err);
        }
    }


    btnNovoUsuario.addEventListener("click", () => {
        usuarioEditando = null;
        formUsuario.reset();
        usuarioModal.show();
    });

    formUsuario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            Nome: nomeInput.value,
            Login: loginInput.value,
            Senha: senhaInput.value,
            Perfil: perfilSelect.value
        };

        try {
            if (usuarioEditando) {
                await fetch(`${API_USUARIOS}/${usuarioEditando.Id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            } else {
                await fetch(API_USUARIOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
            }

            usuarioModal.hide();
            await carregarUsuarios();
        } catch (err) {
            alert("Erro ao salvar usuário");
            console.error(err);
        }
    });

    window.editarUsuario = (id) => {
        const u = usuarios.find(x => x.Id === id);
        if (!u) return;

        usuarioEditando = u;
        nomeInput.value = u.Nome;
        loginInput.value = u.Login;
        senhaInput.value = u.Senha;
        perfilSelect.value = u.Perfil || "";

        usuarioModal.show();
    };


    window.deletarUsuario = async (id) => {
        if (!confirm("Deseja realmente deletar este usuário?")) return;

        try {
            await fetch(`${API_USUARIOS}/${id}`, { method: "DELETE" });
            await carregarUsuarios();
        } catch (err) {
            alert("Erro ao deletar usuário");
            console.error(err);
        }
    };


    pesquisaUsuariosInput.addEventListener("input", () => {
        const termo = pesquisaUsuariosInput.value.toLowerCase();
        tabelaUsuariosBody.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
    });

    init();
});