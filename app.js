function initIdeaInteractions() {
document.addEventListener('DOMContentLoaded', () => {
  const ideaGrid = document.querySelector('.idea-grid');
  if (!ideaGrid) return;

  const searchInput = document.getElementById('idea-search');
  const cards = Array.from(ideaGrid.querySelectorAll('.idea-card'));

  const filterCards = (query) => {
    const normalized = query.trim().toLowerCase();
    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(normalized) ? '' : 'none';
    });
  };

  searchInput?.addEventListener('input', (event) => {
    filterCards(event.target.value);
  });

  cards.forEach((card) => {
    const title = card.querySelector('.idea-title');
    title?.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });
}

function initMarginCalculator() {
  const calculator = document.querySelector('.margin-calculator');
  if (!calculator) return;

  const costInput = calculator.querySelector('#cost-price');
  const saleInput = calculator.querySelector('#sale-price');
  const marginInput = calculator.querySelector('#margin-percent');
  const profitInput = calculator.querySelector('#profit-percent');

  const parseValue = (input) => {
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : null;
  };

  const setValue = (input, value) => {
    if (value === null || Number.isNaN(value)) return;
    input.value = value.toFixed(2);
  };

  const calculate = () => {
    let cost = parseValue(costInput);
    let sale = parseValue(saleInput);
    let margin = parseValue(marginInput);
    let profitPct = parseValue(profitInput);

    const hasCost = cost !== null;
    const hasSale = sale !== null;
    const hasMargin = margin !== null;
    const hasProfitPct = profitPct !== null;

    if (!hasCost && hasSale && hasMargin && margin < 100) {
      cost = sale * (1 - margin / 100);
    }

    if (!hasSale && hasCost && hasMargin && margin < 100) {
      sale = cost / (1 - margin / 100);
    }

    if (!hasSale && hasCost && hasProfitPct) {
      sale = cost * (1 + profitPct / 100);
    }

    if (!hasCost && hasSale && hasProfitPct) {
      cost = sale / (1 + profitPct / 100);
    }

    if (cost !== null && sale !== null) {
      const profit = sale - cost;
      margin = sale !== 0 ? (profit / sale) * 100 : null;
      profitPct = cost !== 0 ? (profit / cost) * 100 : null;
    }

    setValue(costInput, cost);
    setValue(saleInput, sale);
    setValue(marginInput, margin);
    setValue(profitInput, profitPct);
  };

  [costInput, saleInput, marginInput, profitInput].forEach((input) => {
    input.addEventListener('input', calculate);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIdeaInteractions();
  initMarginCalculator();
});
