
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

                <button type="button" class="botao-excluir voltar-topo">
                    Excluir animal
                </button>
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

    const imagem = ficha.querySelector(".foto-animal");

    imagem.onerror = function() {
        imagem.style.display = "none";
    };

    imagem.src = `http://127.0.0.1:5000/animais/${animal.id}/foto`;
    imagem.alt = `Foto de ${animal.nome ?? "animal"}`;

    const botaoExcluir = ficha.querySelector(".botao-excluir");

    botaoExcluir.addEventListener("click", function() {
        const confirmar = confirm(
            `Tem certeza que deseja excluir ${animal.nome}?`
        );

        if (confirmar) {
            excluirAnimal(animal.id);
        }
    });

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

    if (!formulario.reportValidity()) {
        return;
    }

    const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');

    const idadeDigitada = document.getElementById("idade").value.trim();

    if (idadeDigitada !== "" && !Number.isInteger(Number(idadeDigitada))) {
        alert("Digite uma idade numérica inteira!");
        return;
    }

    let endpoint = "http://127.0.0.1:5000/cadastrar";

    const dados = {
        nome: document.getElementById("nome-animal").value,
        especie: document.getElementById("especie").value,
        sexo: sexoSelecionado.value,
        idade: idadeDigitada === "" ? null : Number(idadeDigitada),
        caracteristicas: document.getElementById("caracteristicas").value,
        status: 1,
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

        // Depois de cadastrar o animal, envia a foto
        return cadastrarFoto(resultado.id)
            .then(() => {
                alert("Animal cadastrado com sucesso!");
                window.location.href = "../Animais/Ficha.html";
            })
            .catch(error => {
                console.log("Falha no envio da foto:", error);
                alert("Animal cadastrado, mas não foi possível salvar a foto.");
                window.location.href = "../Animais/Ficha.html";
            });
    })
    .catch(error => {
        console.log("Falha no cadastro:", error);
        alert("Não foi possível cadastrar o animal.");
    });
}



function cadastrarFoto(idAnimal) {
    const foto = document.getElementById("foto").files[0];

    // Se nenhuma foto foi selecionada, encerra normalmente
    if (!foto) {
        return Promise.resolve();
    }

    const dadosFoto = new FormData();
    dadosFoto.append("foto", foto);

    return fetch(`http://127.0.0.1:5000/animais/${idAnimal}/foto`, {
        method: "POST",
        body: dadosFoto
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar a foto");
        }

        return response.json();
    });
}


function excluirAnimal(idAnimal) {
    let endpoint = `http://127.0.0.1:5000/animais/${idAnimal}`;

    return fetch(endpoint, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao excluir animal");
        }

        return response.json();
    })
    .then(resultado => {
        console.log(resultado.mensagem);

        alert("Animal excluído com sucesso!");

        // Atualiza a lista após a exclusão
        carregarAnimais();
    })
    .catch(error => {
        console.log("Falha na exclusão:", error);

        alert("Não foi possível excluir o animal.");
    });
}


// Carrega os animais quando a página Ficha.html é aberta
document.addEventListener("DOMContentLoaded", carregarAnimais);
