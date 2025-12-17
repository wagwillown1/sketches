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

  const parseValue = (input) => {
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

  calculators.forEach((calculator) => {
    const costInput = calculator.querySelector('[data-field="cost"]');
    const saleInput = calculator.querySelector('[data-field="sale"]');
    const marginInput = calculator.querySelector('[data-field="margin"]');
    const profitInput = calculator.querySelector('[data-field="profit"]');
    const profitAmount = calculator.querySelector('[data-output="profit-amount"]');
    const statusLabel = calculator.querySelector('[data-output="input-status"]');
    const resetButton = calculator.querySelector('[data-action="reset-calculator"]');

    const defaultStatus = statusLabel?.textContent?.trim() ||
      'Enter any two fields to calculate the rest.';

    const calculate = (trigger) => {
      let cost = parseValue(costInput);
      let sale = parseValue(saleInput);
      let margin = parseValue(marginInput);
      let profitPct = parseValue(profitInput);
      let profit = null;
      let status = defaultStatus;
      let computed = false;

      const marginValid = margin === null || margin <= 100;

      const computeFromCostAndSale = () => {
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from cost + sale.';
        computed = true;
      };

      const computeFromCostAndMargin = () => {
        sale = cost / (1 - margin / 100);
        profit = sale - cost;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from cost + margin%.';
        computed = true;
      };

      const computeFromSaleAndMargin = () => {
        cost = sale * (1 - margin / 100);
        profit = sale - cost;
        profitPct = cost !== 0 ? (profit / cost) * 100 : null;
        status = 'Calculated from sale + margin%.';
        computed = true;
      };

      const computeFromCostAndProfitPct = () => {
        sale = cost * (1 + profitPct / 100);
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        status = 'Calculated from cost + profit%.';
        computed = true;
      };

      const computeFromSaleAndProfitPct = () => {
        cost = sale / (1 + profitPct / 100);
        profit = sale - cost;
        margin = sale !== 0 ? (profit / sale) * 100 : null;
        status = 'Calculated from sale + profit%.';
        computed = true;
      };

      if (marginValid) {
        if (!computed && trigger === marginInput && margin !== null) {
          if (cost !== null) {
            computeFromCostAndMargin();
          } else if (sale !== null) {
            computeFromSaleAndMargin();
          }
        }

        if (!computed && trigger === profitInput && profitPct !== null) {
          if (cost !== null) {
            computeFromCostAndProfitPct();
          } else if (sale !== null) {
            computeFromSaleAndProfitPct();
          }
        }

        if (!computed && trigger === costInput && cost !== null) {
          if (sale !== null) {
            computeFromCostAndSale();
          } else if (margin !== null) {
            computeFromCostAndMargin();
          } else if (profitPct !== null) {
            computeFromCostAndProfitPct();
          }
        }

        if (!computed && trigger === saleInput && sale !== null) {
          if (cost !== null) {
            computeFromCostAndSale();
          } else if (margin !== null) {
            computeFromSaleAndMargin();
          } else if (profitPct !== null) {
            computeFromSaleAndProfitPct();
          }
        }

        if (!computed && cost !== null && sale !== null) {
          computeFromCostAndSale();
        } else if (!computed && cost !== null && margin !== null) {
          computeFromCostAndMargin();
        } else if (!computed && sale !== null && margin !== null) {
          computeFromSaleAndMargin();
        } else if (!computed && cost !== null && profitPct !== null) {
          computeFromCostAndProfitPct();
        } else if (!computed && sale !== null && profitPct !== null) {
          computeFromSaleAndProfitPct();
        }
      }

      if (!marginValid) {
        status = 'Margin must be at or below 100% to compute.';
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
      ['input', 'keyup'].forEach((eventName) => {
        input?.addEventListener(eventName, () => calculate(input));
      });
    });

    resetButton?.addEventListener('click', () => {
      [costInput, saleInput, marginInput, profitInput].forEach((input) => {
        if (input) input.value = '';
      });
      calculate();
      costInput?.focus();
    });

    calculate();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIdeaInteractions();
  initMarginCalculator();
});
