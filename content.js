// content.js  – walks every “next »” page, scrapes all shelves
(async () => {
    const slug    = s => s.trim().toLowerCase().replace(/\s+/g, "-");
    const BUILTIN = new Set(["to-read", "read", "currently-reading"]);
    const books   = {};                 // id ➜ book
  
    const visited = new Set();
  
    /* ---------------- recursive scraper ---------------- */
    async function scrape(url, isFirstPage = false) {
      if (visited.has(url)) return;
      visited.add(url);
  
      const doc = isFirstPage
        ? document                                          // we’re already on it
        : new DOMParser().parseFromString(
            await (await fetch(url)).text(), "text/html");
  
      for (const tr of doc.querySelectorAll("tr[id^='review_']")) {
        const id = tr.id.replace("review_", "");
  
        // ⬇ all shelves live inside <a class="shelfLink"> inside the Shelves column
        const shelves = [...tr.querySelectorAll("td.field.shelves a.shelfLink")]
                          .map(a => slug(a.textContent));
  
        if (!shelves.length) continue;     // unlikely, but guard anyway
  
        const exclusive = shelves.find(s => BUILTIN.has(s)) || shelves[0];
        const tags      = shelves.filter(s => s !== exclusive);
        const img = tr.querySelector("td.field.cover img, img.bookCover");
        const cover = img
          ? img.dataset.original
            || img.dataset.lazySrc
            || img.getAttribute("data-src")
            || img.src
          : "";
        
        

        books[id] = {
          id,
          avg   : parseFloat(
                      tr.querySelector("td.field.avg_rating, td.field.avg_rating span")?.textContent
                      ?.replace(/[^\d.]+/g,"")      // keep “4.27” – drop other chars
                    ) || null,
          title : tr.querySelector(".title a") ?.textContent.trim() ?? "",
          author: tr.querySelector(".author a")?.textContent.trim() ?? "",
          shelf : exclusive,
          tags,
          cover,
          url   : tr.querySelector(".title a")?.href
        };
      }
  
      /* write what we have so far — search tab will redraw */
      await chrome.storage.local.set({ gr_books: Object.values(books) });
      
      /* -------- find “next »” link and recurse -------- */
      const next = doc.querySelector("a.next_page:not(.disabled)");
      if (next) await scrape(next.href);
    }
  
    /* kick off with the page you’re on */
    await scrape(location.href, true);
  
    /* store everything at once */
    await chrome.storage.local.set({ gr_books: Object.values(books) });
  })();
  