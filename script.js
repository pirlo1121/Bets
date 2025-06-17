const form = document.getElementById('bet-form');
const betList = document.getElementById('bet-list');

let bets = JSON.parse(localStorage.getItem('bets')) || [];

function saveBets() {
    localStorage.setItem('bets', JSON.stringify(bets));
}

function calculateGain(bet) {
    return bet.result === 'ganada' ? (bet.amount * bet.odds) - bet.amount : 0;
}

function renderBets(filtered = null) {
    const data = filtered || bets;
    betList.innerHTML = '';

    data.forEach((bet, index) => {
        const li = document.createElement('li');
        const gain = calculateGain(bet);

        li.innerHTML = `
      <div>
        <strong>${bet.sport} | Cuota: ${bet.odds} | Apuesta: $${bet.amount} |
        <span class="${bet.result}">${bet.result}</span> |
        Ganancia: $${gain.toFixed(2)}
      </div>
      <div>
        ${bet.result === 'pendiente' ? `
          <button onclick="updateResult(${index}, 'ganada')">✅ </button>
          <button onclick="updateResult(${index}, 'perdida')">❌ </button>
        ` : ''}
        <button onclick="deleteBet(${index})">🗑️ </button>
      </div>
    `;

        betList.appendChild(li);
    });

    updateSummary();

}

function updateSummary() {
    const totalGanado = bets
        .filter(b => b.result === 'ganada')
        .reduce((sum, b) => sum + calculateGain(b), 0);

    const totalPerdido = bets
        .filter(b => b.result === 'perdida')
        .reduce((sum, b) => sum + b.amount, 0);

    const total = totalGanado - totalPerdido;

    document.getElementById('total-ganado').textContent = `$${totalGanado.toFixed(2)}`;
    document.getElementById('total-perdido').textContent = `$${totalPerdido.toFixed(2)}`;
    document.getElementById('total-neto').textContent = `${total >= 0 ? '+' : '-'}$${Math.abs(total).toFixed(2)}`;
}


function deleteBet(index) {
    bets.splice(index, 1);
    saveBets();
    renderBets();
}

function updateResult(index, newResult) {
    bets[index].result = newResult;
    saveBets();
    renderBets();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const sport = document.getElementById('sport').value;
    const odds = parseFloat(document.getElementById('odds').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const bet = document.getElementById('bet').value;


    bets.push({ sport, bet, odds, amount, result: 'pendiente' });
    saveBets();
    renderBets();
    form.reset();
});

function deleteAllBets() {
    localStorage.removeItem('bets');
    bets = [];
    renderBets();
}


function showTopSport() {
    const map = {};

    bets.forEach(b => {
        if (b.result === 'ganada') {
            map[b.sport] = (map[b.sport] || 0) + calculateGain(b);
        }
    });

    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    alert(top ? `🏆 Deporte más rentable: ${top[0]} ($${top[1].toFixed(2)})` : 'Sin ganancias aún');
}

renderBets();
