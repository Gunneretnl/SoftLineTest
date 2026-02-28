document.addEventListener("DOMContentLoaded", () => {
    const abas = document.querySelectorAll(".aba");
    const conteudos = document.querySelectorAll(".conteudo-aba");

    function ativarAba(index) {
        abas.forEach((aba, i) => aba.classList.toggle("active", i === index));
        conteudos.forEach((conteudo, i) => conteudo.classList.toggle("ativo", i === index));
    }
    abas.forEach((aba, i) => aba.addEventListener("click", () => ativarAba(i)));

    const API_CLIENTES = "https://localhost:7272/api/clientes";
    const API_PRODUTOS = "https://localhost:7272/api/produtos";

    const formCliente = document.getElementById("formCliente");
    const cancelarCliente = document.getElementById("cancelarCliente");

    let editandoCliente = null;

    async function enviarCliente(cliente) {
        try {
            let res;
            if (editandoCliente !== null) {
                res = await fetch(`${API_CLIENTES}/${editandoCliente}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cliente)
                });
            } else {
                res = await fetch(API_CLIENTES, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cliente) 
                });
            }

            if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

            alert(editandoCliente ?
                `Cliente "${cliente.Nome}" atualizado com sucesso!` :
                `Cliente "${cliente.Nome}" cadastrado com sucesso!`
            );

            formCliente.reset();
            editandoCliente = null;

        } catch (err) {
            console.error("Erro ao enviar cliente:", err);
            alert("Ocorreu um erro ao cadastrar/atualizar o cliente.");
        }
    }

    formCliente.addEventListener("submit", (e) => {
        e.preventDefault();

        const cliente = {
            Nome: document.getElementById("clienteNome").value.trim(),
            Fantasia: document.getElementById("clienteFantasia").value.trim(),
            Documento: document.getElementById("cpf").value.trim(),
            Endereco: document.getElementById("clienteEndereco").value.trim()
        };

        enviarCliente(cliente);
    });

    cancelarCliente.addEventListener("click", () => formCliente.reset());

    const formProduto = document.getElementById("formProduto");
    const cancelarProduto = document.getElementById("cancelarProduto");

    let editandoProduto = null;

    async function enviarProduto(produto) {
        try {
            let res;
            if (editandoProduto !== null) {
                res = await fetch(`${API_PRODUTOS}/${editandoProduto}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(produto)
                });
            } else {
                res = await fetch(API_PRODUTOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(produto)
                });
            }

            if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
            alert(`Produto "${produto.Descricao}" cadastrado com sucesso!`);
            formProduto.reset();
            editandoProduto = null;
        } catch (err) {
            console.error("Erro ao enviar produto:", err);
            alert("Ocorreu um erro ao cadastrar o produto.");
        }
    }

    formProduto.addEventListener("submit", (e) => {
        e.preventDefault();
        const produto = {
            Descricao: document.getElementById("descricao").value.trim(),
            CodigoBarras: document.getElementById("codBarras").value.trim(),
            ValorVenda: parseFloat(document.getElementById("valor").value),
            PesoBruto: parseFloat(document.getElementById("pesoBruto").value),
            PesoLiquido: parseFloat(document.getElementById("pesoLiquido").value)
        };
        enviarProduto(produto);
    });

    cancelarProduto.addEventListener("click", () => formProduto.reset());
});