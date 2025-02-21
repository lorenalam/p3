
/*PUBLICIDAD DE COSMETICA*/
document.addEventListener("DOMContentLoaded", () => {
    fetch("https://dummyjson.com/products/category/beauty")
        .then(response => response.json())
        .then(data => {
            const productosBelleza = data.products;

            // Obtener el último producto mostrado desde localStorage
            const ultimoProductoId = localStorage.getItem("ultimoProductoBelleza");

            let productoAleatorio;

            // Filtrar para evitar repetir el último producto
            const productosDisponibles = productosBelleza.filter(p => p.id !== parseInt(ultimoProductoId));

            if (productosDisponibles.length > 0) {
                // Elegir un producto aleatorio dentro de los disponibles
                productoAleatorio = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
            } else {
                // Si solo queda un producto (o se repiten), tomamos cualquiera sin filtrar
                productoAleatorio = productosBelleza[Math.floor(Math.random() * productosBelleza.length)];
            }

            // Mostrar el producto en el contenedor de publicidad
            const contenedorPublicidad = document.getElementById("publicidad");
            contenedorPublicidad.innerHTML = `
                <h3>Publicidad - Belleza</h3>
                <p><strong>${productoAleatorio.title}</strong></p>
                <img src="${productoAleatorio.thumbnail}" alt="${productoAleatorio.title}">
                <p>Precio: $${productoAleatorio.price}</p>
                <a href="${productoAleatorio.url}" target="_blank">Ver más</a>
            `;

            // Guardar el ID del producto mostrado en localStorage
            localStorage.setItem("ultimoProductoBelleza", productoAleatorio.id);
        })
        .catch(error => console.error("Error al obtener los productos de belleza:", error));
});


const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const entryResult = document.getElementById('entry-result');

searchButton.addEventListener('click', function() {
  const query = searchInput.value.trim();

  if (query) {
    fetchWikipediaEntry(query);
  }
});


/*ENTRADA DE WIKIPEDIA*/
async function fetchWikipediaEntry(query) {
  // Paso 1: Obtener el identificador de la página de Wikipedia
  const wikipediaUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&titles=${query}&prop=pageprops&utf8=1`;

  try {
    const response = await fetch(wikipediaUrl);
    const data = await response.json();
    const pages = data.query.pages;

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];
    const title = page.title;
    
    // Paso 2: Obtener información de Wikidata
    const wikidataUrl = `https://www.wikidata.org/w/api.php?origin=*&action=wbgetentities&sites=enwiki&titles=${title}&props=labels|descriptions|claims&languages=en&format=json`;

    const wikidataResponse = await fetch(wikidataUrl);
    const wikidata = await wikidataResponse.json();
    
    const entity = wikidata.entities[Object.keys(wikidata.entities)[0]];
    const description = entity.descriptions.en ? entity.descriptions.en.value : "Descripción no disponible.";
    const label = entity.labels.en ? entity.labels.en.value : title; // Usar título si no hay etiqueta.
    
    displayEntry(title, description);
  } catch (error) {
    console.error('Error fetching data:', error);
    entryResult.innerHTML = "No se pudo obtener la entrada.";
  }
}

function displayEntry(title, description) {
  entryResult.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;
}

