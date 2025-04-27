const $ = sel => document.querySelector(sel);
const shelfInput = $("#shelf");
const tagsInput  = $("#tags");
const list       = $("#results");
const refreshBtn = $("#refresh");

(async function init() {
  await loadAndRender();
  shelfInput.oninput = tagsInput.oninput = loadAndRender;
  refreshBtn.onclick = () => {
    chrome.storage.local.clear(loadAndRender);
  };
  chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.gr_books) {
        loadAndRender();          // now you see the full set automatically
      }
    });
})();


async function loadAndRender() {
  const { gr_books: books=[] } = await chrome.storage.local.get("gr_books");
  if (!books.length) {
    list.innerHTML = "<p>Open your Goodreads “My Books” page first.</p>";
    return;
  }


  const slug = s => s.trim().toLowerCase().replace(/\s+/g,'-');
  const shelf = slug(shelfInput.value);
  const tags  = tagsInput.value.split(',').map(slug).filter(Boolean);
  
  


  const shown = books.filter(b =>
      (!shelf || b.shelf === shelf) &&
      tags.every(t => b.tags.includes(t))
  );

  list.innerHTML = shown.map(b=>`
    <a class="card" href="${b.url}" target="_blank">
      <img src="${b.cover}" alt="">
      <div class="meta"><strong>${b.title}</strong><br><em>${b.author}</em></div>
    </a>`).join("")
    || "<p>No matches. Check your spelling.</p>";
}

