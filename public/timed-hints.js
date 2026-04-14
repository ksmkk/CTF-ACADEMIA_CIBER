(function () {
  function scheduleHints(root) {
    const hints = Array.from((root || document).querySelectorAll('.hint-item[data-hint-delay]'));

    hints.forEach((hint) => {
      if (hint.dataset.hintScheduled === '1') return;
      hint.dataset.hintScheduled = '1';

      const delay = Number(hint.getAttribute('data-hint-delay') || 0);
      if (!Number.isFinite(delay) || delay < 0) return;

      hint.classList.add('hint-hidden');

      window.setTimeout(() => {
        hint.classList.remove('hint-hidden');
        hint.classList.add('hint-visible');
      }, delay);
    });
  }

  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('.hint-item[data-hint-delay]')) {
            scheduleHints(node.parentElement || document);
            return;
          }

          scheduleHints(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scheduleHints(document);
      setupObserver();
    });
  } else {
    scheduleHints(document);
    setupObserver();
  }
})();
