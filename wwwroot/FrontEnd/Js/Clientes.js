document.addEventListener("DOMContentLoaded", () => {
    const tabelaBody = document.querySelector("#tabelaClientes tbody");
    const inputPesquisa = document.getElementById("pesquisa");
    const btnAdicionarCliente = document.getElementById("btnAdicionarCliente");
    const formCliente = document.getElementById("formCliente");

    const API_URL = "https://localhost:7272/api/clientes";

    const clienteModal = new bootstrap.Modal(document.getElementById("clienteModal"));
    const visualizarClienteModal = new bootstrap.Modal(document.getElementById("visualizarClienteModal"));

    const campoNome = document.getElementById("clienteNome");
    const campoFantasia = document.getElementById("clienteFantasia");
    const campoDocumento = document.getElementById("cpf");
    const campoEndereco = document.getElementById("clienteEndereco");

    let editandoCodigo = null;

    function renderTabela(clientes) {
        tabelaBody.innerHTML = "";
        clientes.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.Codigo}</td>
                <td>${c.Nome}</td>
                <td>${c.Fantasia || ""}</td>
                <td>${c.Documento || ""}</td>
                <td>${c.Endereco || ""}</td>
                <td></td>
            `;
            const tdAcoes = tr.querySelector("td:last-child");

            const btnVisualizar = document.createElement("button");
            btnVisualizar.className = "btn btn-sm btn-info me-1";
            btnVisualizar.textContent = "Visualizar";
            btnVisualizar.addEventListener("click", () => visualizarCliente(c.Codigo));

            const btnEditar = document.createElement("button");
            btnEditar.className = "btn btn-sm btn-warning me-1";
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => editarCliente(c.Codigo));

            const btnDeletar = document.createElement("button");
            btnDeletar.className = "btn btn-sm btn-danger";
            btnDeletar.textContent = "Deletar";
            btnDeletar.addEventListener("click", () => deletarCliente(c.Codigo));

            tdAcoes.append(btnVisualizar, btnEditar, btnDeletar);
            tabelaBody.appendChild(tr);
        });
    }

    async function fetchClientes() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao buscar clientes");
            const clientes = await res.json();
            renderTabela(clientes);
        } catch (err) {
            console.error(err);
            tabelaBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar clientes</td></tr>`;
        }
    }

    async function visualizarCliente(codigo) {
        try {
            const res = await fetch(`${API_URL}/${codigo}`);
            if (!res.ok) throw new Error("Erro ao buscar cliente");
            const c = await res.json();

            document.getElementById("visCodigo").textContent = c.Codigo;
            document.getElementById("visNome").textContent = c.Nome || "";
            document.getElementById("visFantasia").textContent = c.Fantasia || "";
            document.getElementById("visDocumento").textContent = c.Documento || "";
            document.getElementById("visEndereco").textContent = c.Endereco || "";

            visualizarClienteModal.show();
        } catch (err) {
            console.error(err);
            alert("Erro ao buscar cliente.");
        }
    }

    async function editarCliente(codigo) {
        try {
            const res = await fetch(`${API_URL}/${codigo}`);
            if (!res.ok) throw new Error("Erro ao buscar cliente");
            const c = await res.json();

            campoNome.value = c.Nome || "";
            campoFantasia.value = c.Fantasia || "";
            campoDocumento.value = c.Documento || "";
            campoEndereco.value = c.Endereco || "";

            editandoCodigo = codigo;
            clienteModal.show();
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar cliente para edição.");
        }
    }

    async function deletarCliente(codigo) {
        if (!confirm("Deseja realmente deletar este cliente?")) return;
        try {
            const res = await fetch(`${API_URL}/${codigo}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao deletar cliente");
            fetchClientes();
        } catch (err) {
            console.error(err);
            alert("Erro ao deletar cliente.");
        }
    }

    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.toLowerCase();
        tabelaBody.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
    });

    btnAdicionarCliente.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });

    formCliente.addEventListener("submit", async e => {
        e.preventDefault();

        const clienteData = {
            Nome: campoNome.value.trim(),
            Fantasia: campoFantasia.value.trim(),
            Documento: campoDocumento.value.replace(/\D/g, ""), 
            Endereco: campoEndereco.value.trim()
        };

        try {
            let res;
            if (editandoCodigo !== null) {
                clienteData.Codigo = editandoCodigo;
                res = await fetch(`${API_URL}/${editandoCodigo}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clienteData)
                });
            } else {
                res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clienteData)
                });
            }

            if (!res.ok) {
                const erro = await res.text();
                throw new Error(erro);
            }

            clienteModal.hide();
            formCliente.reset();
            editandoCodigo = null;
            fetchClientes();

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar cliente:\n" + err.message);
        }
    });

    fetchClientes();

    window.visualizarCliente = visualizarCliente;
    window.editarCliente = editarCliente;
    window.deletarCliente = deletarCliente;
});