const $ = sel => document.querySelector(sel);
const shelfInput = $("#shelf");
const tagsInput  = $("#tags");
const refreshBtn = $("#refresh");
const tableBody  = $("#results tbody");
const banner     = $("#loading");

const slug = s => s.trim().toLowerCase().replace(/\s+/g,"-");

/* ---------- main entry ---------- */
(async function init(){
  await loadAndRender();

  shelfInput.oninput = tagsInput.oninput = loadAndRender;
  refreshBtn.onclick = () => chrome.storage.local.clear(loadAndRender);

  /* live-reload when scraper writes new data */
  chrome.storage.onChanged.addListener((chg,area)=>{
    if(area==="local" && chg.gr_books){ loadAndRender(); }
  });
})();

/* ---------- core ---------- */
async function loadAndRender(){
  const { gr_books: books=[] } = await chrome.storage.local.get("gr_books");

  // show/hide banner
  banner.hidden = !books.length;
  if(!books.length){
    banner.textContent = "Open a Goodreads “My Books” page…";
    tableBody.innerHTML = "";
    return;
  }

  banner.textContent = `Loaded ${books.length} book${books.length>1?"s":""}…`;

  /* filters */
  const wantedShelf = slug(shelfInput.value);
  const wantedTags  = tagsInput.value.split(",").map(slug).filter(Boolean);

  const shown = books.filter(b=>(
       (!wantedShelf || b.shelf===wantedShelf) &&
       wantedTags.every(t=>b.tags.includes(t))
  ));

  /* render rows */
  tableBody.innerHTML = shown.map(b=>`
    <tr>
      <td class="cover">
        <a href="${b.url}" target="_blank" rel="noopener">
          <img src="${b.cover}" alt="">
        </a>
      </td>
      <td class="title">
        <a href="${b.url}" target="_blank" rel="noopener">${escapeHTML(b.title)}</a>
      </td>
      <td>${escapeHTML(b.author)}</td>
      <td class="rating">${b.avg != null ? b.avg.toFixed(2) : "—"}</td>
      <td class="shelves">${[b.shelf, ...b.tags].join(", ")}</td>
    </tr>
  `).join("");

  if(!shown.length){
    tableBody.innerHTML = `<tr><td colspan="5">No matches.</td></tr>`;
  }
}

/* ---------- util ---------- */
function escapeHTML(str){
  return str.replace(/[&<>"']/g,c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
