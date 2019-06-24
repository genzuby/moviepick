const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/original";
const TMDB_IMG_URL_SML = "https://image.tmdb.org/t/p/w500";
const TMDB_AUTO_KEY = "4777c5796835519cf0b4eee975064849";
// const TMDB_AUTO_KEY = "5a52ce9bf39ebab5b14ee20ac710c3cf"; //  for local test
const YOUTUBE_EMBED = "https://www.youtube.com/embed/";
const GENRE_NAME = `${TMDB_URL}/genre/movie/list?api_key=${TMDB_AUTO_KEY}`;
const NOW_PLAYING = `${TMDB_URL}/movie/now_playing?api_key=${TMDB_AUTO_KEY}&page=1`;
const TOP_RATING = `${TMDB_URL}/movie/top_rated?api_key=${TMDB_AUTO_KEY}&page=1`;
const MOVIE_POPULAR = `${TMDB_URL}/movie/popular?api_key=${TMDB_AUTO_KEY}&page=1`;
const HOST_URL = "https://moviepick.netlify.com/";
// const HOST_URL = "http://127.0.0.1:5500/"; //  for local test

const getConnect = axios.create();

getMoreInfo = param => {
  window.open(`${HOST_URL}detailinfo.html?id=${param}`, "_parent");
};

function getHome() {
  window.open(HOST_URL, "_parent");
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const getStarRating = ratingvalue => {
  const value = Math.round((ratingvalue * 10) / 2);
  const starcount = parseInt(value / 10);
  const halfstar = value % 10;
  const emptystar = 5 - Math.ceil(value / 10);
  let starHtml = `<div class="star-rating">`;

  if (starcount > 0) {
    for (i = 0; i < starcount; i++) {
      starHtml += `<i class="fas fa-star 3x"></i>`;
    }
  }
  if (halfstar >= 3) {
    starHtml += `<i class="fas fa-star-half-alt 3x"></i>`;
  } else if (halfstar > 0 && halfstar < 3) {
    starHtml += `<i class="far fa-star 3x"></i>`;
  }
  if (emptystar > 0) {
    for (i = 0; i < emptystar; i++) {
      starHtml += `<i class="far fa-star 3x"></i>`;
    }
  }
  starHtml += "</div>";

  return starHtml;
};

const getLangList = langs => {
  return langs.reduce(
    (accumList, lang) => (accumList += lang.name + " | "),
    ""
  );
};

const getGenreList = genres => {
  return genres.reduce(
    (genrelist, genre, idx) =>
      genres.length === idx + 1
        ? (genrelist += genre.name)
        : (genrelist += genre.name + " | "),
    ""
  );
};

function checkImg(imgInfo) {
  let imgPath = "";
  if (imgInfo === "Poster") {
    imgPath = "../img/poster.png";
  } else if (imgInfo === "Person") {
    imgPath = "../img/face.png";
  }
  return imgPath;
}
