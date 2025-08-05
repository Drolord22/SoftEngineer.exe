let books = [];
const booksPerPage = 8;
let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

fetch('books.json')
  .then(res => res.json())
  .then(data => {
    books = data;
    books.sort((a, b) => new Date(b["publish date"]) - new Date(a["publish date"]));
    displayBooks(books, currentPage);
    setupPagination(books);
  });

function displayBooks(bookList, page) {
  const container = document.getElementById('book-container');
  document.querySelector('.book-grid')?.remove();

  const start = (page - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = bookList.slice(start, end);

  const bookGrid = document.createElement('div');
  bookGrid.classList.add('book-grid');

  paginatedBooks.forEach(book => {
    const card = document.createElement('div');
    card.classList.add('book');

    card.innerHTML = `
      <h2>${book.title}</h2>
      <img src="src/frontpages/${book.frontpage}" alt="${book.title} style" class="book-image">
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Release Date:</strong> ${new Date(book["release date"]).toLocaleDateString()}</p>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Category:</strong> ${book.category}</p>
      <p><strong>Pages:</strong> ${book["pages number"]}</p>
      <p class="DescriptionJustified">${book.description}</p>
      <a href="${book["download link"] !== "PENDING" ? book["download link"] : "#"}" target="_blank">
        ${book["download link"] !== "PENDING" ? "Download PDF" : "Coming Soon"}
      </a>
      <p class="PubDateBy"><span><strong>Publish Date:</strong> ${new Date(book["publish date"]).toLocaleDateString()}</span>
      <span><strong>Shared by: </strong>${book["shared by"]}</span>
    `;

    bookGrid.appendChild(card);
  });

  container.appendChild(bookGrid);
}

function setupPagination(bookList) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  const totalPages = Math.ceil(bookList.length / booksPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('page-btn');
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentPage = i;
      displayBooks(bookList, currentPage);
      setupPagination(bookList);
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Actualiza la URL con ?page=n sin recargar
      const url = new URL(window.location);
      url.searchParams.set('page', currentPage);
      window.history.pushState({}, '', url);

      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    pagination.appendChild(btn);
  }
}

/*Función de la barra de busqueda*/
function search(event) {
  event.preventDefault(); /*Línea de código encargada de realizar la busqueda con ENTER*/
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(input) ||
    book.author.toLowerCase().includes(input) ||
    book.category.toLowerCase().includes(input)
  );
  currentPage = 1;
  displayBooks(filtered, currentPage);
  setupPagination(filtered);
}