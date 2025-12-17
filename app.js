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
});
