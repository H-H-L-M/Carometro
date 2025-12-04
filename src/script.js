var contadorAlunosSalvos = 0;

function adicionarAluno() {
    const alunoInput = document.getElementById("alunoInput");
    const fotoInput = document.getElementById("fotoInput");
    const anoSelect = document.getElementById("anoSelect");
    const turmaSelect = document.getElementById("turmaSelect");
    const { value: alunoNome } = alunoInput;
    const { files: [foto] } = fotoInput;
    const nomeVazio = alunoNome === "";
    const fotoNaoSelecionada = !foto;
    const alertaNomeVazio = "Por favor, digite o nome do aluno.";
    const alertaFotoNaoSelecionada = "Por favor, selecione uma imagem para o aluno.";

    if (nomeVazio || fotoNaoSelecionada) {
        if (nomeVazio) alert(alertaNomeVazio);
        if (fotoNaoSelecionada) alert(alertaFotoNaoSelecionada);
        return;
    }
    if (alunoNome !== "" && foto) {
        const idUnico = gerarIDUnico();
        
        const novoAluno = document.createElement("div");
        novoAluno.className = "aluno";
    
        const idAluno = document.createElement("span");
        idAluno.textContent = idUnico;
        idAluno.classList.add("id-aluno");
    
        const nomeAluno = document.createElement("span");
        nomeAluno.textContent = alunoNome;
    
        const imagemAluno = document.createElement("img");
        imagemAluno.src = URL.createObjectURL(foto);
        imagemAluno.alt = "Foto do aluno";
    
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", () => {
            novoAluno.remove();
            if (contadorAlunosSalvos > 0) {
                contadorAlunosSalvos--;
                atualizarContadorAlunosSalvos();
            }
        });
    
        novoAluno.appendChild(idAluno);
        novoAluno.appendChild(imagemAluno);
        novoAluno.appendChild(nomeAluno);
        novoAluno.appendChild(botaoExcluir);
    
        const listaAlunos = document.getElementById("listaAlunos");
        listaAlunos.appendChild(novoAluno);
    
        contadorAlunosSalvos++;
        atualizarContadorAlunosSalvos();
    
        alunoInput.value = "";
        fotoInput.value = "";
    }


    document.getElementById('imagePreview').src ="src/img/avatar.jpg";
}

function gerarIDUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function atualizarContadorAlunosSalvos() {
    var contador = document.getElementById("contadorAlunosSalvos");
    contador.textContent = formatarContador(contadorAlunosSalvos);
}

function formatarContador(valor) {
    return valor < 10 ? "0" + valor : valor;
}

document.getElementById('fotoInput').addEventListener('change', function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var imgElement = document.getElementById('imagePreview');
        imgElement.src = reader.result;
    }
    reader.readAsDataURL(input.files[0]);
});

function salvarPDF() {
    var doc = new jsPDF();

    var listaAlunos = document.querySelectorAll('.aluno');

    var imageWidth = 100 * 40 / 80;
    var imageHeight = 130 * 40 / 80;

    var alunosPorPagina = 9;

    var x = 10;
    var y = 40;

    doc.setFontSize(20);
    doc.text('Carômetro', doc.internal.pageSize.getWidth() - 141, 20, { align: 'center' });

    var selectedYear = document.querySelector('select').value + 'º';
    doc.setFontSize(20);
    doc.text(selectedYear, doc.internal.pageSize.getWidth() - 118, 20, { align: 'center' });

    doc.setFontSize(20);
    var selectedPeriodo = document.getElementById("periodoSelect").value;
    doc.text(selectedPeriodo, doc.internal.pageSize.getWidth() - 101, 20, { align: 'center' });

    var selectedTurma = 'turma '+document.getElementById('turmaSelect').value;
    doc.setFontSize(20);
    doc.text(selectedTurma, doc.internal.pageSize.getWidth() - 74, 20, { align: 'center' });
    

    listaAlunos.forEach(function(aluno, index) {
        var nomeAluno = aluno.querySelector('span:nth-of-type(2)').textContent; // Obtém o nome do aluno
        var imgAluno = aluno.querySelector('img');

        doc.addImage(imgAluno, 'JPEG', x, y, imageWidth, imageHeight);
        doc.setFontSize(14);
        doc.text(nomeAluno, x + (imageWidth / 2), y + imageHeight + 10, { align: 'center' });

        x += imageWidth + 15;

        if ((index + 1) % 3 === 0) {
            x = 10;
            y += imageHeight + 25;
        }

        if ((index + 1) % alunosPorPagina === 0 && index + 1 !== listaAlunos.length) {
            doc.addPage();
            doc.setFontSize(10);
            doc.text('Escola classe 17 de Ceilândia', doc.internal.pageSize.getWidth() - 180, 10, { align: 'center' });
            doc.setFontSize(20);
            doc.text('Carômetro', doc.internal.pageSize.getWidth() - 141, 20, { align: 'center' });
            doc.setFontSize(20);
            doc.setFontSize(20);
            doc.text(selectedTurma, doc.internal.pageSize.getWidth() - 74, 20, { align: 'center' });
            doc.text(selectedYear, doc.internal.pageSize.getWidth() - 118, 20, { align: 'center' });
            doc.setFontSize(20);
            doc.text(selectedPeriodo, doc.internal.pageSize.getWidth() - 101, 20, { align: 'center' });
            x = 10;
            y = 40;
        }
    
    }
    );
    doc.save('Alunos.pdf');
}

const criarOpcoesAno = () => {
    const anoSelect = document.getElementById("anoSelect");

    for (let i = 1; i <= 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i}º`;
        anoSelect.appendChild(option);
    }
};

const criarOpcoesTurma = () => {
    const turmaSelect = document.getElementById("turmaSelect");
    const turmas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    turmas.forEach(turma => {
        const option = document.createElement("option");
        option.value = turma;
        option.textContent = `Turma ${turma}`;
        turmaSelect.appendChild(option);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    criarOpcoesAno();
    criarOpcoesTurma();
});