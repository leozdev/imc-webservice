const form = document.getElementById('form-cadastro');
const tabelaImc = document.getElementById('tabela-imc').getElementsByTagName('tbody')[0];

// Função para carregar pessoas do webservice
async function carregarPessoas() {
    try {
        const response = await fetch('https://ifsp.ddns.net/webservices/imc/pessoa');
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const pessoas = await response.json();
        tabelaImc.innerHTML = ""; //Limpa a tabela
        preencherTabela(pessoas);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Função para preencher a tabela com os dados recebidos
function preencherTabela(pessoas) {
    pessoas.forEach(pessoa => {
        const newRow = tabelaImc.insertRow();

        const nomeCell = newRow.insertCell();
        nomeCell.textContent = pessoa.nome; 

        const alturaCell = newRow.insertCell();
        alturaCell.textContent = pessoa.altura;

        const pesoCell = newRow.insertCell();
        pesoCell.textContent = pessoa.peso;

        const imc = (pesoCell.textContent / (alturaCell.textContent * alturaCell.textContent)).toFixed(2);
        const imcCell = newRow.insertCell();
        imcCell.textContent = imc;

        const status = statusIMC(imc);
        const statusCell = newRow.insertCell();
        statusCell.textContent = status;

        const botaos = newRow.insertCell();
        botaos.innerHTML = '<div class="button-container"><button class="aumentar-peso">+ Peso</button> <button class="diminuir-peso">- Peso</button> <button class="excluir">Excluir</button></div>';

        // Adicionar eventos para os botões
        adicionarEventosBotoes(botaos,pessoa);
    });
}

async function procurarPessoa(idPessoa) {
    try {
        const url = `https://ifsp.ddns.net/webservices/imc/pessoa/${idPessoa}`;
        const response = await fetch(url);
        if (!response.ok) {
            return null; 
        }
        const pessoa = await response.json();
        return pessoa;
    } catch (error) {
        console.log("Erro:", error.message);
        return null; 
    }
}

//DELETE
async function deletarPessoa(idPessoa) {
    try {
        const pessoaExiste= await procurarPessoa(idPessoa);

        if(pessoaExiste==null){
            alert("Pessoa não encontrada!");
            await carregarPessoas();
            return;
        }
   
        const url = `https://ifsp.ddns.net/webservices/imc/pessoa/${idPessoa}`;
        const config = {
            method: "DELETE"
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        await carregarPessoas(); 

    } catch (error) {
        console.log("Erro:", error.message);
    }
}

//PUT
async function atualizarPeso(pessoa) {

    const pessoaExiste = await procurarPessoa(pessoa.id);

    if (pessoaExiste==null) {
        alert("Pessoa não encontrada!");
        await carregarPessoas(); 
        return; 
    }
    const url = `https://ifsp.ddns.net/webservices/imc/pessoa/${pessoa.id}`;
    const config = {
        method: "PUT",
        body: JSON.stringify(pessoa)
    };
    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        tabelaImc.innerText = "";
        await carregarPessoas();
    } catch (error) {
        console.log("Erro:", error.message);
    }
}


// Função para adicionar eventos aos botões de aumentar, diminuir peso e excluir
function adicionarEventosBotoes(botaos,pessoa) {
    const btnExcluir = botaos.querySelector('.excluir');
    btnExcluir.addEventListener("click",() => deletarPessoa(pessoa.id));

    const btnAumentarPeso = botaos.querySelector('.aumentar-peso');
    btnAumentarPeso.addEventListener('click', () => {
        pessoa.peso += 0.5;
        atualizarPeso(pessoa)

    });


    const btnDiminuirPeso = botaos.querySelector('.diminuir-peso');
    btnDiminuirPeso.addEventListener('click', () => {
        if (pessoa.peso > 0.5) {
            pessoa.peso -= 0.5;
            atualizarPeso(pessoa);
        } else {
            alert("Não é possível deixar o peso negativo!");
        }
    });
}

// Função para atualizar o IMC
function atualizarIMC(peso, alturaCell, imcCell, statusCell) {
    const altura = parseFloat(alturaCell.textContent);
    const novoIMC = (peso / (altura * altura)).toFixed(2);
    imcCell.textContent = novoIMC;
    statusCell.textContent = statusIMC(novoIMC);
}

// Evento de submissão do formulário
form.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Cadastro realizado com sucesso!');

    const nome = document.getElementById('nome').value;
    let peso = parseFloat(document.getElementById('peso').value);
    let altura = parseFloat(document.getElementById('altura').value);

    if (peso > 0 && altura > 0) {
        const imc = (peso / (altura * altura)).toFixed(2);
        let status = statusIMC(imc);

        const newRow = tabelaImc.insertRow();

        const nomeCell = newRow.insertCell();
        nomeCell.textContent = nome; 

        const pesoCell = newRow.insertCell();
        pesoCell.textContent = peso;

        const alturaCell = newRow.insertCell();
        alturaCell.textContent = altura;

        const imcCell = newRow.insertCell();
        imcCell.textContent = imc;

        const statusCell = newRow.insertCell();
        statusCell.textContent = status;

        const botaos = newRow.insertCell();
        botaos.innerHTML = '<div class="button-container"><button class="aumentar-peso">+ Peso</button> <button class="diminuir-peso">- Peso</button> <button class="excluir">Excluir</button></div>';

        // Adicionar eventos para os botões
        adicionarEventosBotoes(botaos, pesoCell, alturaCell, imcCell, statusCell);

        form.reset();
    }
});

// Função para determinar o status do IMC
function statusIMC(imc) {
    if (imc < 18.5) {
        return 'Magreza';
    } else if (imc < 25) {
        return 'Saudável';
    } else if (imc < 30) {
        return 'Sobrepeso';
    } else if (imc < 35) {
        return 'Obesidade I';
    } else if (imc < 40) {
        return 'Obesidade II';
    } else {
        return 'Obesidade III';
    }
}

// Eventos para remover maior e menor IMC
const btnRemoverMaiorIMC = document.querySelector("#remover-maior-imc");
btnRemoverMaiorIMC.addEventListener("click", removerMaiorIMC);

const btnRemoverMenorIMC = document.querySelector("#remover-menor-imc");
btnRemoverMenorIMC.addEventListener("click", removerMenorIMC);

//Remover pessoa com o maior IMC
async function removerMaiorIMC() {
    const url = 'https://ifsp.ddns.net/webservices/imc/pessoa';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const pessoas = await response.json();
        if (pessoas.length !== 0) {
            let maiorIMC = pessoas[0].imc;
            let idPessoa = pessoas[0].id;

            pessoas.forEach(pessoa => {
                if (pessoa.imc > maiorIMC) {
                    maiorIMC = pessoa.imc;
                    idPessoa = pessoa.id;
                }
            });
            deletarPessoa(idPessoa);
        }else{
            alert("Não há pessoas para remover");
        }
    } catch (error) {
        console.log("Erro:", error.message);
    }
}

// Remover pessoa com o menor IMC
async function removerMenorIMC() {
    const url = 'https://ifsp.ddns.net/webservices/imc/pessoa';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        const pessoas = await response.json();
        if (pessoas.length !== 0) {
            let menorIMC = pessoas[0].imc;
            let idPessoa = pessoas[0].ID;

            pessoas.forEach(pessoa => {
                if (pessoa.imc < menorIMC) {
                    menorIMC = pessoa.imc;
                    idPessoa = pessoa.id;
                }
            });
            deletarPessoa(idPessoa);
        }else{
            alert("Não há pessoas para remover");
        }
    } catch (error) {
        console.log("Erro:", error.message);
    }
}
// Carregar as pessoas ao iniciar a página
carregarPessoas();
