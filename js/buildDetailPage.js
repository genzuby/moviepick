const movieId = getParameterByName("id");

class MovieDetail extends Movie {
  getVideoApiforClipList() {
    const videoKeys = getConnect
      .get(`${TMDB_URL}/movie/${this.movieid}/videos?api_key=${TMDB_AUTO_KEY}`)
      .then(response => {
        return response.data.results;
      });

    return videoKeys;
  }

  getMainInfo(data) {
    document.querySelector(".detail-main > h2").innerHTML = data.tagline;

    const releaseYear = ` (${data.release_date.substr(0, 4)})`;
    document.querySelector(".detail-main > h1").innerHTML =
      data.original_title + releaseYear;

    let lang_list = "",
      genres_list = "";

    lang_list = getLangList(data.spoken_languages);
    genres_list = getGenreList(data.genres);

    document.querySelector(".detail-main > h3").innerHTML =
      data.runtime +
      "Min | " +
      lang_list +
      genres_list +
      " | " +
      data.release_date;

    if (data.homepage) {
      document.querySelector(".detail-main > .official-link").href =
        data.homepage;
    } else {
      document.querySelector(".detail-main > .official-link").style.visibility =
        "hidden";
    }

    const ratingStar = getStarRating(data.vote_average);
    document.querySelector(
      ".rating-info"
    ).innerHTML = ` <h3 class="pop-rating">${
      data.vote_average
    }</h3>${ratingStar}`;

    const imgObj = document.createElement("img");
    data.poster_path === null
      ? (imgObj.src = checkImg("Poster"))
      : (imgObj.src = TMDB_IMG_URL_SML + data.poster_path);

    document.querySelector(".detail-main").appendChild(imgObj);

    document.querySelector(".detail-main > p").innerHTML = data.overview;

    document.querySelector(
      ".detail-main"
    ).style.backgroundImage = `url("${TMDB_IMG_URL}${data.backdrop_path}")`;
  }
}

class MovieDetailList extends MovieList {
  makeMovieCard(dataset, genres) {
    const html = dataset.map(data => {
      let imgPath = "";
      if (data.poster_path === null) imgPath = checkImg("Poster");
      else imgPath = TMDB_IMG_URL_SML + data.poster_path;
      const inHTML = `<div class="like-this-item">
          <div class="movie-card item-front">
          <img src=${imgPath} />
          </div>
          <div class="movie-card item-back">
            <p>${this.getGenreNames(genres, data.genre_ids)}</p>
            <p>${data.release_date}</p>
            <a href="detailinfo.html?id=${
              data.id
            }" class="more-info">More Info</a>
          </div>
          <div class="card-info">
            <h5>${data.original_title}</h5>
            <div><p>${data.vote_average}</p><div>${getStarRating(
        data.vote_average
      )}</div></div>
          </div>
        </div>`;
      return inHTML;
    });

    let htmlResult = html.join(" ");
    return htmlResult;
  }
}

getInitDetail();

async function getInitDetail() {
  const SIMILAR_URL = `${TMDB_URL}/movie/${movieId}/similar?api_key=${TMDB_AUTO_KEY}&page=1`;
  const RECOM_URL = `${TMDB_URL}/movie/${movieId}/recommendations?api_key=${TMDB_AUTO_KEY}&page=1`;

  const detailMovieInfo = new MovieDetail(movieId);
  const similarList = new MovieDetailList(SIMILAR_URL);
  const recomList = new MovieDetailList(RECOM_URL);

  // Get detail Information of selected Movie
  const movieDetail = await detailMovieInfo.getMovieInfo();
  await detailMovieInfo.getMainInfo(movieDetail);
  const key = await detailMovieInfo.getVideoApi();
  await detailMovieInfo.addVideo(key);

  const keyList = await detailMovieInfo.getVideoApiforClipList();
  await makeVideoList(keyList);
  await setClipList();
  await getSocialLink(movieId);

  const simListRes = await similarList.getMovieList();
  const recomListRes = await recomList.getMovieList();
  const genreRes = await similarList.getGenreArray();

  if (simListRes.results.length === 0)
    document.querySelector(".like-this-movies").style.display = "none";
  if (simListRes.results.length === 0)
    document.querySelector(".you-may-like").style.display = "none";

  const simHTML = await similarList.makeMovieCard(simListRes.results, genreRes);
  const recomHTML = await recomList.makeMovieCard(
    recomListRes.results,
    genreRes
  );
  document.querySelector("#likethisMovie").innerHTML = simHTML;
  document.querySelector("#maylikeMovie").innerHTML = recomHTML;
}

async function getSocialLink(selectedMovieId) {
  const response = await getConnect.get(
    `${TMDB_URL}/movie/${selectedMovieId}/external_ids?api_key=${TMDB_AUTO_KEY}`
  );

  await getSocial(response.data);
}

function getSocial(data) {
  let socialTag = "";

  if (data.imdb_id)
    socialTag += `<i class="fab fa-imdb" onclick="window.open('https://www.imdb.com/title/${
      data.imdb_id
    }')"></i>`;

  if (data.facebook_id)
    socialTag += `<i class="fab fa-facebook-square" onclick="window.open('https://facebook.com/${
      data.facebook_id
    }')"></i>`;

  if (data.instagram_id)
    socialTag += `<i class="fab fa-instagram" onclick="window.open('http://instagram.com/_u/${
      data.instagram_id
    }')"></i>`;

  if (data.twitter_id)
    socialTag += `<i class="fab fa-twitter" onclick="window.open('https://twitter.com/${
      data.twitter_id
    }')"></i>`;

  document.querySelector(".social-link").innerHTML = socialTag;
}
