const form = document.getElementById('form-cadastro');
const tabelaImc = document.getElementById('tabela-imc').getElementsByTagName('tbody')[0];

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
        
        const btnExcluir = botaos.querySelector('.excluir');
        btnExcluir.addEventListener('click', () => {
            newRow.remove();
        });

        const btnAumentarPeso = botaos.querySelector('.aumentar-peso');
        btnAumentarPeso.addEventListener('click', () => {
            console.log("clicou no aumentar");
            peso += 0.5;
            pesoCell.textContent = peso.toFixed(2);
            atualizarIMC();
        });

        const btnDiminuirPeso = botaos.querySelector('.diminuir-peso');
        btnDiminuirPeso.addEventListener('click', () => {
            console.log("clicou no diminuir");
            if (peso > 0.5) {
                peso -= 0.5;
                pesoCell.textContent = peso.toFixed(2);
                atualizarIMC();
            } else {
                alert("Não é possivel deixar o peso negativo!");
            }
        });

        function atualizarIMC() {
            const novoIMC = (peso / (altura * altura)).toFixed(2);
            imcCell.textContent = novoIMC;
            statusCell.textContent = statusIMC(novoIMC);
        }

        form.reset();
    }
});

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
    }else{
        alert("Não há pessoas para remover!")
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
    }else{
        alert("Não há pessoas para remover!")
    }
}