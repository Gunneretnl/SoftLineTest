document.addEventListener("DOMContentLoaded", () => {
    const API_CLIENTES = "https://localhost:7272/api/clientes";
    const API_PRODUTOS = "https://localhost:7272/api/produtos";
    const API_VENDAS = "https://localhost:7272/api/vendas";

    const token = localStorage.getItem("token");

    const btnNovaVenda = document.getElementById("btnNovaVenda");
    const btnVerVendas = document.getElementById("btnVerVendas");
    const vendaModal = new bootstrap.Modal(document.getElementById("vendaModal"));
    const visualizarVendaModal = new bootstrap.Modal(document.getElementById("visualizarVendaModal"));

    const clienteInput = document.getElementById("clientePesquisa");
    const clienteResultados = document.getElementById("clienteResultados");
    const clienteHidden = document.getElementById("clienteVenda");

    const itensContainer = document.getElementById("itensVendaContainer");
    const btnAdicionarItem = document.getElementById("btnAdicionarItem");
    const formVenda = document.getElementById("formVenda");

    const tabelaVendasContainer = document.getElementById("vendasTableContainer");
    const tabelaVendasBody = document.querySelector("#tabelaVendas tbody");
    const pesquisaVendasInput = document.getElementById("pesquisaVendas");

    const tabelaItensVendaBody = document.querySelector("#tabelaItensVenda tbody");
    const visVendaCodigo = document.getElementById("visVendaCodigo");
    const visVendaCliente = document.getElementById("visVendaCliente");
    const visVendaTotal = document.getElementById("visVendaTotal");

    let clientes = [];
    let produtos = [];
    let clienteSelecionado = null;

    function formatarDataPtBr(iso) {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleString("pt-BR");
    }

    async function init() {
        if (!token) {
            alert("Usuário não autenticado. Faça login novamente.");
            window.location.href = "login.html";
            return;
        }

        await carregarClientes();
        await carregarProdutos();
        await carregarVendas();
    }

    async function carregarClientes() {
        const res = await fetch(API_CLIENTES, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        clientes = await res.json();
    }

    async function carregarProdutos() {
        const res = await fetch(API_PRODUTOS, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        produtos = await res.json();
    }

    btnVerVendas.addEventListener("click", async () => {
        tabelaVendasContainer.classList.toggle("d-none");
        if (!tabelaVendasContainer.classList.contains("d-none")) {
            await carregarVendas();
        }
    });

    clienteInput.addEventListener("input", () => {
        clienteSelecionado = null;
        clienteHidden.value = "";

        const termo = clienteInput.value.toLowerCase();
        clienteResultados.innerHTML = "";

        if (!termo) {
            clienteResultados.classList.add("d-none");
            return;
        }

        const filtrados = clientes.filter(c =>
            c.Nome.toLowerCase().includes(termo) ||
            (c.Documento && c.Documento.toLowerCase().includes(termo))
        );

        filtrados.forEach(c => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action";
            li.textContent = `${c.Nome} (${c.Documento || ""})`;

            li.addEventListener("click", () => {
                clienteInput.value = li.textContent;
                clienteHidden.value = c.Codigo;
                clienteSelecionado = c;
                clienteResultados.classList.add("d-none");
            });

            clienteResultados.appendChild(li);
        });

        clienteResultados.classList.toggle("d-none", filtrados.length === 0);
    });

    document.addEventListener("click", e => {
        if (!clienteInput.contains(e.target) && !clienteResultados.contains(e.target)) {
            clienteResultados.classList.add("d-none");
        }
    });

    btnNovaVenda.addEventListener("click", () => {
        itensContainer.innerHTML = "";
        clienteInput.value = "";
        clienteHidden.value = "";
        clienteSelecionado = null;
        vendaModal.show();
    });

    btnAdicionarItem.addEventListener("click", () => adicionarItem());

    function adicionarItem() {
        const row = document.createElement("div");
        row.className = "d-flex mb-2 gap-2 align-items-start position-relative";

        const produtoInput = document.createElement("input");
        produtoInput.type = "text";
        produtoInput.className = "form-control";
        produtoInput.placeholder = "Digite produto ou código de barras";

        const produtoList = document.createElement("ul");
        produtoList.className = "list-group position-absolute w-100 d-none";
        produtoList.style.top = "38px";
        produtoList.style.zIndex = "1000";

        const inputQtd = document.createElement("input");
        inputQtd.type = "number";
        inputQtd.className = "form-control";
        inputQtd.value = 1;
        inputQtd.min = 1;
        inputQtd.style.width = "80px";

        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.className = "btn btn-danger btn-sm";
        btnRemover.textContent = "X";
        btnRemover.onclick = () => row.remove();

        row.append(produtoInput, inputQtd, btnRemover, produtoList);
        itensContainer.appendChild(row);

        produtoInput.addEventListener("input", () => {
            const termo = produtoInput.value.toLowerCase();
            produtoList.innerHTML = "";

            if (!termo) {
                produtoList.classList.add("d-none");
                return;
            }

            const filtrados = produtos.filter(p =>
                p.Descricao.toLowerCase().includes(termo) ||
                (p.CodigoBarras && p.CodigoBarras.toLowerCase().includes(termo))
            );

            filtrados.forEach(p => {
                const li = document.createElement("li");
                li.className = "list-group-item list-group-item-action";
                li.textContent = `${p.Descricao} - R$ ${Number(p.ValorVenda).toFixed(2)}`;

                li.onclick = () => {
                    produtoInput.value = li.textContent;
                    produtoInput.dataset.codigo = p.Codigo;
                    produtoList.classList.add("d-none");
                };

                produtoList.appendChild(li);
            });

            produtoList.classList.toggle("d-none", filtrados.length === 0);
        });

        document.addEventListener("click", e => {
            if (!row.contains(e.target)) produtoList.classList.add("d-none");
        });
    }

    formVenda.addEventListener("submit", async e => {
        e.preventDefault();

        if (!clienteHidden.value) {
            alert("Selecione um cliente válido! (clique em um cliente da lista)");
            return;
        }

        const vendaData = {
            ClienteCodigo: parseInt(clienteHidden.value, 10),
            Itens: []
        };

        itensContainer.querySelectorAll("div").forEach(r => {
            const inputProduto = r.querySelector("input[type=text]");
            const inputQtd = r.querySelector("input[type=number]");
            const codigoProduto = parseInt(inputProduto.dataset.codigo, 10);

            if (!codigoProduto) return;

            vendaData.Itens.push({
                ProdutoCodigo: codigoProduto,
                Quantidade: parseInt(inputQtd.value, 10)
            });
        });

        if (vendaData.Itens.length === 0) {
            alert("Adicione pelo menos 1 item na venda.");
            return;
        }

        const res = await fetch(API_VENDAS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(vendaData)
        });

        if (!res.ok) {
            alert(await res.text());
            return;
        }

        vendaModal.hide();
        await carregarVendas();
    });

    async function carregarVendas() {
        const res = await fetch(API_VENDAS, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const vendas = await res.json();

        tabelaVendasBody.innerHTML = vendas.map(v => {
            const nomeCliente =
                v.ClienteNome ||
                (clientes.find(c => c.Codigo === v.ClienteCodigo)?.Nome) ||
                v.ClienteCodigo;

            const dataVenda = formatarDataPtBr(v.Data);
            const usuario = v.UsuarioNome || "";
            const total = Number(v.Total ?? 0).toFixed(2);

            return `
                <tr>
                    <td>${v.Codigo}</td>
                    <td>${nomeCliente}</td>
                    <td>${dataVenda}</td>
                    <td>${usuario}</td>
                    <td>R$ ${total}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="visualizarVenda(${v.Codigo})">Visualizar</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    pesquisaVendasInput.addEventListener("input", () => {
        const termo = pesquisaVendasInput.value.toLowerCase();
        tabelaVendasBody.querySelectorAll("tr").forEach(tr => {
            const codigo = tr.children[0].textContent.toLowerCase();
            const cliente = tr.children[1].textContent.toLowerCase();
            const data = tr.children[2].textContent.toLowerCase();
            const usuario = tr.children[3].textContent.toLowerCase();

            tr.style.display =
                codigo.includes(termo) ||
                    cliente.includes(termo) ||
                    data.includes(termo) ||
                    usuario.includes(termo)
                    ? ""
                    : "none";
        });
    });

    window.visualizarVenda = async function (codigo) {
        try {
            const res = await fetch(`${API_VENDAS}/${codigo}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(await res.text());

            const v = await res.json();

            visVendaCodigo.textContent = v.Codigo;
            visVendaCliente.textContent = v.ClienteNome || v.ClienteCodigo;
            visVendaTotal.textContent = Number(v.Total ?? 0).toFixed(2);

            tabelaItensVendaBody.innerHTML = (v.Itens || []).map(i => `
                <tr>
                    <td>${i.ProdutoDescricao || i.ProdutoCodigo}</td>
                    <td>${i.Quantidade}</td>
                    <td>R$ ${Number(i.ValorUnitario ?? 0).toFixed(2)}</td>
                    <td>R$ ${Number(i.Subtotal ?? 0).toFixed(2)}</td>
                </tr>
            `).join("");

            visualizarVendaModal.show();
        } catch (err) {
            console.error("Erro ao visualizar venda:", err);
            alert("Erro ao visualizar venda:\n" + err.message);
        }
    };

    init();
});