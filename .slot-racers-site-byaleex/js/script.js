/**
 * Interatividades e Lógica Gamificada do Site Slot Racers
 * - Destacar teclas pressionadas em tempo real nos cards de controles
 * - Rolagem suave e desbloqueio de troféus ao explorar o site
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DETECTOR DE TECLAS EM TEMPO REAL NOS CARDS DE CONTROLE
  // Dá um efeito super interativo: quando o jogador aperta W, A, S, D ou Setas no teclado,
  // a caixinha correspondente no site acende e brilha!
  const mapaTeclas = {
    'KeyW': 'W',
    'KeyS': 'S',
    'KeyA': 'A',
    'KeyD': 'D',
    'Space': 'ESPAÇO',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'Enter': 'ENTER'
  };

  const caixasTeclas = document.querySelectorAll('.tecla-box');

  window.addEventListener('keydown', (e) => {
    const textoTecla = mapaTeclas[e.code];
    if (textoTecla) {
      caixasTeclas.forEach(caixa => {
        if (caixa.textContent.trim() === textoTecla) {
          caixa.style.transform = 'translateY(4px)';
          caixa.style.boxShadow = '0 0 10px #00f0ff';
          caixa.style.borderColor = '#00f0ff';
        }
      });
    }
  });

  window.addEventListener('keyup', (e) => {
    const textoTecla = mapaTeclas[e.code];
    if (textoTecla) {
      caixasTeclas.forEach(caixa => {
        if (caixa.textContent.trim() === textoTecla) {
          caixa.style.transform = 'translateY(0)';
          caixa.style.boxShadow = '0 4px 0 #120e23';
          caixa.style.borderColor = '#3f3170';
        }
      });
    }
  });

  // 2. DESBLOQUEAR TROFÉU "TIRO COM EFEITO" AO ROLAR ATÉ O FINAL DO MANUAL
  const trofeu3 = document.getElementById('ach-3');
  window.addEventListener('scroll', () => {
    const secaoControles = document.getElementById('controles');
    if (secaoControles && trofeu3) {
      const rect = secaoControles.getBoundingClientRect();
      if (rect.top < window.innerHeight / 2) {
        trofeu3.classList.add('desbloqueado');
      }
    }
  });
});