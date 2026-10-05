// ================= GERENCIADOR DE ABAS =================
document.addEventListener('DOMContentLoaded', () => {
  const botoesAba = document.querySelectorAll('.tab-btn');
  const conteudosAba = document.querySelectorAll('.tab-conteudo');

  botoesAba.forEach(botao => {
    botao.addEventListener('click', () => {
      const targetId = botao.getAttribute('data-tab');

      // Atualiza botões
      botoesAba.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');

      // Atualiza painéis
      conteudosAba.forEach(secao => {
        if (secao.id === targetId) {
          secao.classList.add('active');
        } else {
          secao.classList.remove('active');
        }
      });
    });
  });

  // Habilitar clique nas alternativas para teste direto
  configurarCliqueAlternativas();
});

// ================= TESTE DE ALTERNATIVAS =================
function configurarCliqueAlternativas() {
  const blocos = document.querySelectorAll('.alternativas-lista');

  blocos.forEach(lista => {
    const correta = lista.getAttribute('data-correta');
    const itens = lista.querySelectorAll('.alt-item');

    itens.forEach(item => {
      item.addEventListener('click', () => {
        const letra = item.getAttribute('data-alt');

        // Limpa estados prévios nessa lista
        itens.forEach(i => {
          i.classList.remove('selecionada-correta', 'selecionada-errada');
        });

        if (letra === correta) {
          item.classList.add('selecionada-correta');
        } else {
          item.classList.add('selecionada-errada');
          // Marca também a certa para facilitar o aprendizado
          const itemCerto = lista.querySelector(`[data-alt="${correta}"]`);
          if (itemCerto) itemCerto.classList.add('selecionada-correta');
        }
      });
    });
  });
}

// ================= CONTROLE DE FASES DE RESOLUÇÃO =================
const estadoFases = {};

function obterEstado(questaoId) {
  if (!estadoFases[questaoId]) {
    estadoFases[questaoId] = 0; // 0: nenhuma fase aberta
  }
  return estadoFases[questaoId];
}

function avancarFase(questaoId) {
  const card = document.getElementById(questaoId);
  if (!card) return;

  const fases = card.querySelectorAll('.fase-item');
  let atual = obterEstado(questaoId);

  if (atual < fases.length) {
    fases[atual].classList.add('ativa');
    estadoFases[questaoId] = atual + 1;
  }

  verificarConclusao(card, questaoId, fases.length);
}

function resolverTudo(questaoId) {
  const card = document.getElementById(questaoId);
  if (!card) return;

  const fases = card.querySelectorAll('.fase-item');
  fases.forEach(f => f.classList.add('ativa'));
  estadoFases[questaoId] = fases.length;

  // Realça automaticamente a alternativa correta
  const lista = card.querySelector('.alternativas-lista');
  if (lista) {
    const correta = lista.getAttribute('data-correta');
    const itemCerto = lista.querySelector(`[data-alt="${correta}"]`);
    if (itemCerto) itemCerto.classList.add('selecionada-correta');
  }

  verificarConclusao(card, questaoId, fases.length);
}

function reiniciarFase(questaoId) {
  const card = document.getElementById(questaoId);
  if (!card) return;

  const fases = card.querySelectorAll('.fase-item');
  fases.forEach(f => f.classList.remove('ativa'));
  estadoFases[questaoId] = 0;

  // Limpa carimbo
  const carimbo = card.querySelector('.carimbo-ok');
  if (carimbo) carimbo.remove();

  // Limpa alternativas
  const itens = card.querySelectorAll('.alt-item');
  itens.forEach(i => i.classList.remove('selecionada-correta', 'selecionada-errada'));
}

function verificarConclusao(card, questaoId, totalFases) {
  if (estadoFases[questaoId] === totalFases && !card.querySelector('.carimbo-ok')) {
    const acoes = card.querySelector('.acoes-fases');
    const carimbo = document.createElement('div');
    carimbo.className = 'carimbo-ok';
    carimbo.textContent = '✓ Revisado & Compreendido!';
    acoes.insertAdjacentElement('afterend', carimbo);
  }
}

function renderizarKaTeX() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ],
      throwOnError: false
    });
  }
}