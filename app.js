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
  const profitAmount = calculator.querySelector('#profit-amount');
  const statusLabel = calculator.querySelector('#input-status');

  const formatMoney = (value) =>
    Number.isFinite(value) ? `$${value.toFixed(2)}` : '—';

  const parseValue = (input) => {
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : null;
  };

  const setValue = (input, value, { skipIfActive = false } = {}) => {
    if (!input) return;
    if (skipIfActive && document.activeElement === input) return;
    if (value === null || Number.isNaN(value)) {
      input.value = '';
      return;
    }
    input.value = value.toFixed(2);
  };

  const calculate = (trigger) => {
  const setValue = (input, value) => {
    if (value === null || Number.isNaN(value)) return;
    input.value = value.toFixed(2);
  };

  const calculate = () => {
    let cost = parseValue(costInput);
    let sale = parseValue(saleInput);
    let margin = parseValue(marginInput);
    let profitPct = parseValue(profitInput);
    let profit = null;
    let status = 'Enter any two fields to calculate the rest.';

    const knownCount = [cost, sale, margin, profitPct].filter((v) => v !== null).length;
    const marginValid = margin === null || margin < 100;

    if (knownCount >= 2 && marginValid) {
      if (cost !== null && sale !== null) {
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from cost + sale.';
      } else if (cost !== null && margin !== null) {
        sale = cost / (1 - margin / 100);
        profit = sale - cost;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from cost + margin%.';
      } else if (sale !== null && margin !== null) {
        cost = sale * (1 - margin / 100);
        profit = sale - cost;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from sale + margin%.';
      } else if (cost !== null && profitPct !== null) {
        sale = cost * (1 + profitPct / 100);
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        status = 'Calculated from cost + profit%.';
      } else if (sale !== null && profitPct !== null) {
        cost = sale / (1 + profitPct / 100);
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        status = 'Calculated from sale + profit%.';
      }
    }

    if (!marginValid) {
      status = 'Margin must be below 100% to compute.';
      sale = trigger === saleInput ? sale : null;
      cost = trigger === costInput ? cost : null;
      profit = null;
    }

    setValue(costInput, cost, { skipIfActive: trigger === costInput });
    setValue(saleInput, sale, { skipIfActive: trigger === saleInput });
    setValue(marginInput, margin, { skipIfActive: trigger === marginInput });
    setValue(profitInput, profitPct, { skipIfActive: trigger === profitInput });

    if (profitAmount) {
      profitAmount.textContent = formatMoney(profit);
    }

    if (statusLabel) {
      statusLabel.textContent = status;
    }
  };

  [costInput, saleInput, marginInput, profitInput].forEach((input) => {
    input?.addEventListener('input', () => calculate(input));
  });

  calculate();

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
