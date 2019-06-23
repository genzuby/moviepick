class SearchList extends MovieList {
  makeResultList(data, genres) {
    const html = data.map(datum => {
      let imgPath = "";
      if (datum.poster_path === null) imgPath = checkImg("Poster");
      else imgPath = TMDB_IMG_URL_SML + datum.poster_path;

      const inHTML = `<li onclick="getMoreInfo(${
        datum.id
      });"><img src=${imgPath} />
         <h5>${datum.original_title}</h5>
         <div><p>${datum.vote_average}</p><div>${getStarRating(
        datum.vote_average
      )}</div></div>
         <p>${this.getGenreNames(genres, datum.genre_ids)} | ${
        datum.release_date
      }</p></li>`;

      return inHTML;
    });

    let htmlResult = html.join(" ");
    return htmlResult;
  }
}

const searchInput = document.querySelector("#search-movie");
const matchedList = document.querySelector("#matched-list");
let pagenum = 1;

function clearList() {
  matchedList.innerHTML = "";
  pagenum = 1;
}

async function getMovieList(searchText, paging) {
  if (searchText.length === 0) {
    clearList();
    matchedList.style.display = "none";
  } else {
    const SEARCH_URL = `${TMDB_URL}/search/movie?api_key=${TMDB_AUTO_KEY}&query=${searchText}&page=${pagenum}&include_adult=false`;
    const searchList = new SearchList(SEARCH_URL);
    const searchResponse = await searchList.getMovieList();
    const genreRes = await searchList.getGenreArray();

    let resultHTML = "";

    console.log(searchResponse);
    if (searchResponse.results.length > 0)
      resultHTML = await searchList.makeResultList(
        searchResponse.results,
        genreRes
      );

    if (paging && pagenum <= searchResponse.total_pages) {
      matchedList.innerHTML += resultHTML;
    } else if (!paging) {
      clearList();
      matchedList.innerHTML = resultHTML;
    }

    matchedList.style.display = "block";
  }
}
searchInput.addEventListener("input", () => {
  pagenum = 1;
  getMovieList(searchInput.value);
});

searchInput.addEventListener("keydown", e => {
  var key = e.which || e.keyCode;
  if (key === 13) {
    // enter key
    pagenum = 1;
    getMovieList(searchInput.value);
  } else if (key === 27) {
    //ESC key
    matchedList.style.display = "none";
  }
});

document.addEventListener(
  "click",
  e => {
    if (e.target.id !== "search-movie" || e.target.id !== "matched-list")
      matchedList.style.display = "none";
  },
  true
);

matchedList.addEventListener("scroll", () => lastCheck());

function lastCheck() {
  const clientHeight = matchedList.clientHeight,
    scrollHeight = matchedList.scrollHeight,
    scrollTop = matchedList.scrollTop;

  if (scrollHeight - scrollTop - 10 <= clientHeight) {
    ++pagenum;
    getMovieList(searchInput.value, true);
  }
}
