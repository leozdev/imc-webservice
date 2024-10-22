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
        adicionarEventosBotoes(botaos, pesoCell, alturaCell, imcCell, statusCell);
    });
}

// Função para adicionar eventos aos botões de aumentar, diminuir peso e excluir
function adicionarEventosBotoes(botaos, pesoCell, alturaCell, imcCell, statusCell) {
    const btnExcluir = botaos.querySelector('.excluir');
    btnExcluir.addEventListener('click', () => {
        const row = botaos.closest('tr');
        row.remove();
    });

    const btnAumentarPeso = botaos.querySelector('.aumentar-peso');
    btnAumentarPeso.addEventListener('click', () => {
        let peso = parseFloat(pesoCell.textContent);
        peso += 0.5;
        pesoCell.textContent = peso.toFixed(2);
        atualizarIMC(peso, alturaCell, imcCell, statusCell);
    });

    const btnDiminuirPeso = botaos.querySelector('.diminuir-peso');
    btnDiminuirPeso.addEventListener('click', () => {
        let peso = parseFloat(pesoCell.textContent);
        if (peso > 0.5) {
            peso -= 0.5;
            pesoCell.textContent = peso.toFixed(2);
            atualizarIMC(peso, alturaCell, imcCell, statusCell);
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

function removerMaiorIMC() {
    let trs = document.querySelectorAll("tr");
    if (trs.length > 1) {
        let maior = trs[1]; 
        let maiorIMC = parseFloat(maior.querySelectorAll("td")[3].innerText);
        for (let i = 1; i < trs.length; i++) { 
            let tds = trs[i].querySelectorAll("td");
            let IMC = parseFloat(tds[3].innerText);
            if (IMC > maiorIMC) {
                maior = trs[i];
                maiorIMC = IMC;
            }
        }
        maior.remove(); 
    } else {
        alert("Não há pessoas para remover!");
    }
}

function removerMenorIMC() {
    let trs = document.querySelectorAll("tr");
    if (trs.length > 1) {
        let menor = trs[1]; 
        let menorIMC = parseFloat(menor.querySelectorAll("td")[3].innerText);
        for (let i = 1; i < trs.length; i++) { 
            let tds = trs[i].querySelectorAll("td");
            let IMC = parseFloat(tds[3].innerText);
            if (IMC < menorIMC) {
                menor = trs[i];
                menorIMC = IMC;
            }
        }
        menor.remove(); 
    } else {
        alert("Não há pessoas para remover!");
    }
}

// Carregar as pessoas ao iniciar a página
carregarPessoas();
