class MovieMain extends Movie {
  displayHeader = (data, titleDesign) => {
    const h1Title = document.querySelector(".today-pick > h1");
    h1Title.style.fontFamily = titleDesign.fontfam;
    h1Title.style.textTransform =
      titleDesign.uppercase === "Y" ? "uppercase" : "none";
    h1Title.innerHTML = data.original_title;

    let lang_list = "",
      genres_list = "";

    lang_list = getLangList(data.spoken_languages);
    genres_list = getGenreList(data.genres);

    document.querySelector(".detail-info").innerHTML =
      data.runtime + "Min | " + lang_list + genres_list;

    document.querySelector(".release-date").innerHTML =
      "Release Date : " + data.release_date;

    let votepoint = [data.vote_average * 10];
    ratingChart(votepoint, ".pick-rating", "HEADER");

    document.querySelector(".today-pick > p").innerHTML = data.overview;

    const moreInfoBnt = document.createElement("button");
    moreInfoBnt.innerHTML = "MORE INFO";
    moreInfoBnt.onclick = () => {
      getMoreInfo(data.id);
    };

    document.querySelector(".today-pick").appendChild(moreInfoBnt);

    document.querySelector(
      ".main-hero"
    ).style.backgroundImage = `url("${TMDB_IMG_URL}${data.backdrop_path}")`;
  };
}

class MovieMainList extends MovieList {
  getList(data, id, genreList) {
    this.createList(data, document.querySelector(`#${id}-list`), genreList);
  }

  createList(data, parentName, genreList) {
    data.results.forEach(result => {
      const divListItem = document.createElement("div");
      divListItem.className = "list-item";

      const genreText = this.getGenreNames(genreList, result.genre_ids);

      const capObj = document.createElement("figcaption");
      capObj.innerHTML = `<h4>${result.title}</h4><p class="sml-text-p">${
        result.release_date
      }</p><p class="sml-text-p">${genreText}</p>`;

      const moreInfoBtn = document.createElement("button");
      moreInfoBtn.className = "list-more-info";
      moreInfoBtn.innerHTML = "More Info";
      moreInfoBtn.onclick = () => {
        getMoreInfo(result.id);
      };

      capObj.appendChild(moreInfoBtn);
      divListItem.appendChild(capObj);

      const objImg = document.createElement("img");
      result.poster_path === null
        ? (objImg.src = checkImg("Poster"))
        : (objImg.src = TMDB_IMG_URL_SML + result.poster_path);

      const objListBottom = document.createElement("div");
      objListBottom.className = "list-bottom";

      const objH3 = document.createElement("h3");
      objH3.innerHTML = result.title;

      const objRating = document.createElement("div");
      objRating.className = "list-rating";
      objRating.id = `${parentName.id}_${result.id}`;

      divListItem.appendChild(objImg);
      objListBottom.appendChild(objRating);
      objListBottom.appendChild(objH3);
      divListItem.appendChild(objListBottom);
      parentName.appendChild(divListItem);

      let votepoint = [result.vote_average * 10];
      ratingChart(votepoint, "#" + objRating.id, "LIST");
    });
  }
}

getInitMainMovie();

async function getInitMainMovie() {
  const response = await getConnect.get("../json/recom.json");

  const randomVal = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  const pickMovie = await response.data.filter(datum => datum.id === randomVal);

  const objPick = pickMovie[0];
  let val = objPick.tmdbid;
  let fontfam = objPick.fontfamily;
  let uppercase = objPick.uppercase;

  const mainMovieInfo = new MovieMain(val);
  const mainNowPlayingList = new MovieMainList(NOW_PLAYING);
  const topRatingList = new MovieMainList(TOP_RATING);
  const popMovieList = new MovieMainList(MOVIE_POPULAR);

  // Get detail Information of picked Movie
  const movieDetail = await mainMovieInfo.getMovieInfo();
  await mainMovieInfo.displayHeader(movieDetail, { fontfam, uppercase });
  const key = await mainMovieInfo.getVideoApi();
  await mainMovieInfo.addVideo(key);

  // Get Movie List for each items
  const nowListResponse = await mainNowPlayingList.getMovieList();
  const topListResponse = await topRatingList.getMovieList();
  const popListResponse = await popMovieList.getMovieList();
  const genreRes = await mainNowPlayingList.getGenreArray();

  await mainNowPlayingList.getList(nowListResponse, "now-playing", genreRes);
  await listDisplay(document.querySelector("#now-playing"));
  await displayTab("now-playing-list");
  await topRatingList.getList(topListResponse, "top-rating", genreRes);
  await popMovieList.getList(popListResponse, "movie-popular", genreRes);
}

document.addEventListener("click", function(e) {
  if (e.target.id === "now-playing") {
    rmClass();
    listDisplay(document.querySelector("#now-playing"));
    displayTab("now-playing-list");
    window.scrollTo(0, document.querySelector(".navi-list-group").offsetTop);
  } else if (e.target.id === "top-rating") {
    rmClass();
    listDisplay(document.querySelector("#top-rating"));
    displayTab("top-rating-list");
    window.scrollTo(0, document.querySelector(".navi-list-group").offsetTop);
  } else if (e.target.id === "movie-popular") {
    rmClass();
    listDisplay(document.querySelector("#movie-popular"));
    displayTab("movie-popular-list");
    window.scrollTo(0, document.querySelector(".navi-list-group").offsetTop);
  }
});

function rmClass() {
  const tabClass = document.querySelectorAll(".navi-list-group > li");
  tabClass.forEach(tab => tab.classList.remove("selected-list-group"));
}

function listDisplay(objName) {
  objName.classList.add("selected-list-group");
}

function displayTab(selectedObj) {
  const tabClass = document.querySelectorAll(".movie-list > .list-group");
  tabClass.forEach(tab =>
    tab.id === selectedObj
      ? (document.querySelector(`#${tab.id}`).style.visibility = "visible")
      : (document.querySelector(`#${tab.id}`).style.visibility = "hidden")
  );
}
