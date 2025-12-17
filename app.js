function initIdeaInteractions() {
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
  const calculators = document.querySelectorAll('.margin-calculator');
  if (!calculators.length) return;

  const formatMoney = (value) => (Number.isFinite(value) ? `$${value.toFixed(2)}` : '—');

  const toNumber = (input) => {
    if (!input) return null;
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : null;
  };

  const setValue = (input, value, { skipIfActive = false } = {}) => {
    if (!input) return;
    if (skipIfActive && document.activeElement === input) return;
    if (!Number.isFinite(value)) {
      input.value = '';
      return;
    }
    input.value = value.toFixed(2);
  };

  const computeValues = ({ cost, sale, margin, profitPct }, defaultStatus) => {
    let profit = null;
    let status = defaultStatus;

    const marginInvalid = margin !== null && margin > 100;
    const knownCount = [cost, sale, margin, profitPct].filter((value) => value !== null).length;

    if (!marginInvalid && knownCount >= 2) {
      if (cost !== null && sale !== null) {
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from cost + sale.';
      } else if (cost !== null && margin !== null) {
        const divisor = 1 - margin / 100;
        if (divisor > 0) {
          sale = cost / divisor;
          profit = sale - cost;
          profitPct = cost !== 0 ? (profit / cost) * 100 : null;
          status = 'Calculated from cost + margin%.';
        } else {
          status = 'Add a sale price or use a margin below 100% when only cost is provided.';
        }
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

    if (marginInvalid) {
      status = 'Margin must be at or below 100% to compute.';
      profit = null;
    }

    const finiteOrNull = (value) => (Number.isFinite(value) ? value : null);

    return {
      cost: finiteOrNull(cost),
      sale: finiteOrNull(sale),
      margin: finiteOrNull(margin),
      profitPct: finiteOrNull(profitPct),
      profit: finiteOrNull(profit),
      status,
    };
  };

  calculators.forEach((calculator) => {
    const costInput = calculator.querySelector('[data-field="cost"]');
    const saleInput = calculator.querySelector('[data-field="sale"]');
    const marginInput = calculator.querySelector('[data-field="margin"]');
    const profitInput = calculator.querySelector('[data-field="profit"]');
    const profitAmount = calculator.querySelector('[data-output="profit-amount"]');
    const statusLabel = calculator.querySelector('[data-output="input-status"]');

    const defaultStatus = statusLabel?.textContent?.trim() ||
      'Enter any two fields to calculate the rest.';

    const update = (trigger) => {
      const result = computeValues({
        cost: toNumber(costInput),
        sale: toNumber(saleInput),
        margin: toNumber(marginInput),
        profitPct: toNumber(profitInput),
      }, defaultStatus);

      setValue(costInput, result.cost, { skipIfActive: trigger === costInput });
      setValue(saleInput, result.sale, { skipIfActive: trigger === saleInput });
      setValue(marginInput, result.margin, { skipIfActive: trigger === marginInput });
      setValue(profitInput, result.profitPct, { skipIfActive: trigger === profitInput });

      if (profitAmount) {
        profitAmount.textContent = formatMoney(result.profit);
      }

      if (statusLabel) {
        statusLabel.textContent = result.status;
      }
    };

    [costInput, saleInput, marginInput, profitInput].forEach((input) => {
      input?.addEventListener('input', () => update(input));
    });

    update();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIdeaInteractions();
  initMarginCalculator();
});
