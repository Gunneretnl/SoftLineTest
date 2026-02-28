document.addEventListener("DOMContentLoaded", () => {
    const tabelaBody = document.querySelector("#tabelaProdutos tbody");
    const inputPesquisa = document.getElementById("pesquisa");
    const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
    const API_URL = "https://localhost:7272/api/produtos";

    const produtoModal = new bootstrap.Modal(document.getElementById("produtoModal"));
    const visualizarProdutoModal = new bootstrap.Modal(document.getElementById("visualizarProdutoModal"));

    const campoDescricao = document.getElementById("descricao");
    const campoCodigoBarras = document.getElementById("codBarras");
    const campoValor = document.getElementById("valor");
    const campoPesoBruto = document.getElementById("pesoBruto");
    const campoPesoLiquido = document.getElementById("pesoLiquido");
    const formProduto = document.getElementById("formProduto");

    let editandoCodigo = null;

    function renderTabela(produtos) {
        tabelaBody.innerHTML = "";

        produtos.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.Codigo}</td>
                <td>${p.Descricao}</td>
                <td>${p.CodigoBarras || ""}</td>
                <td>R$ ${(p.ValorVenda || 0).toFixed(2)}</td>
                <td>${(p.PesoBruto || 0).toFixed(3)}</td>
                <td>${(p.PesoLiquido || 0).toFixed(3)}</td>
                <td></td>
            `;

            const tdAcoes = tr.querySelector("td:last-child");

            const btnVisualizar = document.createElement("button");
            btnVisualizar.className = "btn btn-sm btn-info me-1";
            btnVisualizar.textContent = "Visualizar";
            btnVisualizar.addEventListener("click", () => visualizarProduto(p.Codigo));

            const btnEditar = document.createElement("button");
            btnEditar.className = "btn btn-sm btn-warning me-1";
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => editarProduto(p.Codigo));

            const btnDeletar = document.createElement("button");
            btnDeletar.className = "btn btn-sm btn-danger";
            btnDeletar.textContent = "Deletar";
            btnDeletar.addEventListener("click", () => deletarProduto(p.Codigo));

            tdAcoes.append(btnVisualizar, btnEditar, btnDeletar);
            tabelaBody.appendChild(tr);
        });
    }

    async function fetchProdutos() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Erro ao buscar produtos");
            const produtos = await res.json();
            renderTabela(produtos);
        } catch (err) {
            console.error(err);
            tabelaBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Erro ao carregar produtos</td></tr>`;
        }
    }

    async function visualizarProduto(codigo) {
        try {
            const res = await fetch(`${API_URL}/${codigo}`);
            if (!res.ok) throw new Error("Erro ao buscar produto");
            const p = await res.json();

            document.getElementById("visCodigo").textContent = p.Codigo;
            document.getElementById("visDescricao").textContent = p.Descricao;
            document.getElementById("visCodigoBarras").textContent = p.CodigoBarras || "";
            document.getElementById("visValorVenda").textContent = p.ValorVenda.toFixed(2);
            document.getElementById("visPesoBruto").textContent = p.PesoBruto.toFixed(3);
            document.getElementById("visPesoLiquido").textContent = p.PesoLiquido.toFixed(3);

            visualizarProdutoModal.show();
        } catch (err) {
            console.error(err);
            alert("Erro ao visualizar produto.");
        }
    }

    async function editarProduto(codigo) {
        try {
            const res = await fetch(`${API_URL}/${codigo}`);
            if (!res.ok) throw new Error("Erro ao buscar produto");
            const p = await res.json();

            campoDescricao.value = p.Descricao;
            campoCodigoBarras.value = p.CodigoBarras || "";
            campoValor.value = p.ValorVenda;
            campoPesoBruto.value = p.PesoBruto;
            campoPesoLiquido.value = p.PesoLiquido;

            editandoCodigo = codigo;
            produtoModal.show();
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar produto para edição.");
        }
    }

    async function deletarProduto(codigo) {
        if (!confirm("Deseja realmente deletar este produto?")) return;
        try {
            const res = await fetch(`${API_URL}/${codigo}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao deletar produto");
            fetchProdutos();
        } catch (err) {
            console.error(err);
            alert("Erro ao deletar produto.");
        }
    }

    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.toLowerCase();
        tabelaBody.querySelectorAll("tr").forEach(tr => {
            tr.style.display = tr.textContent.toLowerCase().includes(termo) ? "" : "none";
        });
    });

    btnAdicionarProduto.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });

    formProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (editandoCodigo === null) return;

        const produtoData = {
            Descricao: campoDescricao.value,
            CodigoBarras: campoCodigoBarras.value,
            ValorVenda: parseFloat(campoValor.value),
            PesoBruto: parseFloat(campoPesoBruto.value),
            PesoLiquido: parseFloat(campoPesoLiquido.value)
        };

        try {
            const res = await fetch(`${API_URL}/${editandoCodigo}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produtoData)
            });
            if (!res.ok) throw new Error("Erro ao atualizar produto");

            produtoModal.hide();
            fetchProdutos();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });

    fetchProdutos();

    window.visualizarProduto = visualizarProduto;
    window.editarProduto = editarProduto;
    window.deletarProduto = deletarProduto;
});