// Pobieranie danych z pliku JSON
let characters = [];


const characterGallery = document.getElementById("gallery");
const filter           = document.querySelector(".filter-select");
const searchInput      = document.querySelector(".search-input");


function renderGallery(list) {
  characterGallery.innerHTML = "";
  list.forEach((char, idx) => {
    const li = document.createElement("li");
    li.className = "character-card";
    li.id = char.element;
    li.classList.add(`element-${char.element}`);

    const link = document.createElement("a");
    link.href  = char.link;

    const img = document.createElement("img");
    img.src       = char.image;
    img.alt       = char.name;
    img.className = "character-image";

    const nameDiv      = document.createElement("div");
    nameDiv.className  = "character-name";
    nameDiv.textContent = char.name;

    img.addEventListener('load', () => {
      extractThemeColor(img, ({ r, g, b, css }) => {
        li.style.setProperty('--theme-color', css);
        li.style.setProperty('--theme-color-rgb', `${r},${g},${b}`);
      });
    });

    link.append(img, nameDiv);
    li.append(link);
    characterGallery.append(li);

    setTimeout(() => li.classList.add("show"), idx * 150);
  });
}

// Sorting by name
const sorted = [...characters].sort((a,b) => a.name.localeCompare(b.name));
renderGallery(sorted);


filter.addEventListener("change", () => {
  const value    = filter.value;
  const allCards = [...characterGallery.querySelectorAll("li")];

 
  allCards.forEach(li => {
    li.classList.remove("show");
    li.classList.add("hidden");
  });

//showing by element
  const toShow = value === "all"
    ? allCards
    : allCards.filter(li => li.id === value);

  // falowe pokazanie
  toShow.forEach((li, idx) => {
    setTimeout(() => {
      li.classList.remove("hidden");
      li.classList.add("show");
    }, idx * 150);
  });
});

 //Searching characters
function fullFilter() {
  const term  = searchInput.value.trim().toLowerCase();
  const value = filter.value;
  const all   = [...characterGallery.querySelectorAll('li')];

  
  all.forEach(li => {
    li.classList.remove('show');
    li.classList.add('hidden');
  });

 
  let toShow = all.filter(li =>
    li.querySelector('.character-name')
      .textContent
      .toLowerCase()
      .includes(term)
  );

  
  if (value !== 'all') {
    toShow = toShow.filter(li => li.id === value);
  }

  
  toShow.forEach((li, idx) => {
    li.style.setProperty('--delay', `${idx * 30}ms`);
  });

  
  requestAnimationFrame(() => {
    toShow.forEach(li => {
      li.classList.remove('hidden');
      li.classList.add('show');
    });
  });

 
  const msg = characterGallery.querySelector('.NoSearchingResult');
  if (!toShow.length) {
    if (!msg) {
      const p = document.createElement('p');
      p.className   = 'NoSearchingResult';
      p.textContent = 'Brak wyników';
      characterGallery.append(p);
    }
  } else if (msg) {
    msg.remove();
  }
}


// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedFilter = debounce(fullFilter, 200);
searchInput.addEventListener("input", debouncedFilter);

      //hamburger
    const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.menu-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        function toggleMenu() {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.toggle('active');
                overlay.classList.toggle('active');
            }
        }

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });


        
const scrollBtn = document.querySelector('.scroll-to-top');

// showing when reach 300px
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollBtn.classList.add('show');
  } else {
    scrollBtn.classList.remove('show');
  }
});

// smooth
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

  // adiing elemental color
function extractThemeColor(imgEl, callback) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

 
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(imgEl, 0, 0, 1, 1);

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  callback({ r, g, b, css: `rgb(${r},${g},${b})` });
}
const debounced = debounce(fullFilter, 200);
searchInput.addEventListener('input', debounced);

filter.addEventListener('change', fullFilter);

// characters data
fetch('/js/galeriaJS/galleryCharacters.json')
  .then(res => res.json())
  .then(data => {
    characters = data.characters;
    // sorted
    const sorted = [...characters].sort((a, b) => a.name.localeCompare(b.name));
    renderGallery(sorted);
  })
  .catch(err => console.error('Błąd wczytywania postaci:', err));






