/* Gallery lightbox: keyboard navigation, deep links and shareable image URLs */
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('[data-gallery-image]'));
  const lightbox = document.getElementById('gallery-lightbox');
  if (!cards.length || !lightbox) return;

  const image = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');
  const copyButton = document.getElementById('lightbox-copy');
  const toast = document.getElementById('gallery-toast');
  let currentIndex = 0;
  let lastFocused = null;
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  function imageUrl(index) {
    const url = new URL(window.location.href);
    url.hash = cards[index].dataset.imageId;
    return url.href;
  }

  function render(index, updateHash = true) {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    image.src = card.dataset.full || card.querySelector('img').src;
    image.alt = card.dataset.caption || card.querySelector('img').alt || '';
    caption.textContent = card.dataset.caption || '';
    counter.textContent = `${currentIndex + 1} / ${cards.length}`;
    if (updateHash) history.replaceState(null, '', imageUrl(currentIndex));
  }

  function open(index, updateHash = true) {
    lastFocused = document.activeElement;
    render(index, updateHash);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    copyButton.focus();
  }

  function close(updateHash = true) {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    if (updateHash) history.replaceState(null, '', window.location.pathname + window.location.search);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  cards.forEach((card, index) => card.addEventListener('click', () => open(index)));
  document.querySelectorAll('[data-lightbox-close]').forEach(btn => btn.addEventListener('click', () => close()));
  document.getElementById('lightbox-prev').addEventListener('click', () => render(currentIndex - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => render(currentIndex + 1));

  copyButton.addEventListener('click', async () => {
    const shareUrl = imageUrl(currentIndex);
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Image link copied to clipboard');
    } catch (error) {
      const field = document.createElement('textarea');
      field.value = shareUrl;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      showToast(copied ? 'Image link copied to clipboard' : 'Copy failed — copy this URL from your address bar');
    }
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') render(currentIndex - 1);
    if (event.key === 'ArrowRight') render(currentIndex + 1);
  });

  function openFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const index = cards.findIndex(card => card.dataset.imageId === id);
    if (index >= 0) open(index, false);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
});
