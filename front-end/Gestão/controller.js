
function criarFicha(animal) {
    const lista = document.getElementById("lista-animais");

    const ficha = document.createElement("article");

    ficha.className = "ficha-animal";
    ficha.id = `animal-${animal.id}`;

    ficha.innerHTML = `
        <div class="ficha-imagem-container">
            <img class="foto-animal" alt="">
            <span class="situacao disponivel">Disponível para adoção</span>
        </div>

        <div class="informacoes">
            <h2 class="nome-animal"></h2>

            <div class="ficha-grid">
                <div class="ficha-bloco">
                    <h3>Informações Básicas</h3>

                    <p><strong>Espécie:</strong> <span class="especie"></span></p>
                    <p><strong>Sexo:</strong> <span class="sexo"></span></p>
                    <p><strong>Idade aproximada:</strong> <span class="idade"></span></p>
                    <p><strong>Porte:</strong> <span class="porte"></span></p>
                    <p><strong>Características físicas:</strong> <span class="caracteristicas"></span></p>
                    <p><strong>Comportamento:</strong> Não informado.</p>
                </div>

                <div class="ficha-bloco">
                    <h3>Protetor Responsável</h3>

                    <p><strong>Nome:</strong> <span class="protetor"></span></p>
                    <p><strong>Contato:</strong> <span class="contato"></span></p>

                    <h3>Histórico do Resgate</h3>

                    <p><strong>Data:</strong> <span class="data"></span></p>
                    <p><strong>Local:</strong> <span class="local"></span></p>
                </div>
            </div>

            <div class="ficha-bloco largo">
                <h3>Saúde e Cuidados</h3>

                <ul class="lista-saude">
                    <li>Informações de saúde não cadastradas.</li>
                </ul>
            </div>

            <div class="ficha-rodape-links">
                <a class="link-texto" href="#como-adotar">
                    Conheça o processo de adoção →
                </a>

                <a class="link-texto voltar-topo" href="#indice-animais">
                    ↑ Voltar à lista
                </a>
            </div>
        </div>
    `;

    // Preenchimento dos dados
    ficha.querySelector(".nome-animal").textContent = animal.nome ?? "Não informado";
    ficha.querySelector(".especie").textContent = animal.especie ?? "Não informado";
    ficha.querySelector(".sexo").textContent = animal.sexo ?? "Não informado";
    ficha.querySelector(".idade").textContent = animal.idade ?? "Não informado";
    ficha.querySelector(".porte").textContent = animal.porte ?? "Não informado";
    ficha.querySelector(".caracteristicas").textContent = animal.caracteristicas ?? "Não informado";

    ficha.querySelector(".protetor").textContent = animal.protetor ?? "Não informado";
    ficha.querySelector(".contato").textContent = animal.contato ?? "Não informado";

    ficha.querySelector(".data").textContent = animal.data ?? "Não informado";
    ficha.querySelector(".local").textContent = animal.local ?? "Não informado";

    // Imagem temporária até implementarmos o envio de fotos
    const imagem = ficha.querySelector(".foto-animal");
    imagem.src = "../FotosAnimais/sem-foto.png";
    imagem.alt = `Foto de ${animal.nome ?? "animal"}`;

    // Adiciona a ficha à página
    lista.appendChild(ficha);
}


function carregarAnimais() {
    const lista = document.getElementById("lista-animais");

    // A função só executa na página Ficha.html
    if (!lista) {
        return;
    }

    let endpoint = "http://127.0.0.1:5000/animais";

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao consultar os animais");
            }

            return response.json();
        })
        .then(animais => {
            lista.innerHTML = "";

            animais.forEach(function(animal) {
                criarFicha(animal);
            });
        })
        .catch(error => {
            console.log("Falha ao carregar os animais:", error);
            lista.textContent = "Falha ao carregar os animais.";
        });
}


function cadastrarAnimal() {
    const formulario = document.querySelector("form");

    // Verifica os campos obrigatórios
    if (!formulario.reportValidity()) {
        return;
    }

    const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');

    const idadeDigitada = document.getElementById("idade").value.trim();

    // A idade deve ser numérica, pois no SQLite é INTEGER
    if (idadeDigitada !== "" && !Number.isInteger(Number(idadeDigitada))) {
        alert("Digite apenas um número inteiro no campo idade!");
        return;
    }

    let endpoint = "http://127.0.0.1:5000/cadastrar";

    const dados = {
        nome: document.getElementById("nome-animal").value,
        especie: document.getElementById("especie").value,
        sexo: sexoSelecionado.value,
        idade: idadeDigitada === "" ? null : Number(idadeDigitada),
        caracteristicas: document.getElementById("caracteristicas").value,
        porte: document.getElementById("porte").value,
        protetor: document.getElementById("protetor").value,
        contato: document.getElementById("contato").value,
        data: document.getElementById("data").value,
        local: document.getElementById("local").value
    };

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar animal");
        }

        return response.json();
    })
    .then(resultado => {
        console.log(resultado.mensagem);
        console.log("ID cadastrado:", resultado.id);

        alert("Animal cadastrado com sucesso!");

        window.location.href = "../Animais/Ficha.html";
    })
    .catch(error => {
        console.log("Falha no cadastro:", error);
        alert("Não foi possível cadastrar o animal.");
    });
}


// Carrega os animais quando a página Ficha.html é aberta
document.addEventListener("DOMContentLoaded", carregarAnimais);
