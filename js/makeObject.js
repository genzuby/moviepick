class Movie {
  constructor(movieid) {
    this.movieid = movieid;
  }

  getMovieInfo() {
    const response = getConnect
      .get(`${TMDB_URL}/movie/${this.movieid}?api_key=${TMDB_AUTO_KEY}`)
      .then(response => {
        return response.data;
      });

    return response;
  }

  getVideoApi() {
    const videoKey = getConnect
      .get(`${TMDB_URL}/movie/${this.movieid}/videos?api_key=${TMDB_AUTO_KEY}`)
      .then(response => {
        return response.data.results[0].key;
      });

    return videoKey;
  }

  addVideo(videokey) {
    const iTrailerObj = document.createElement("iframe");
    iTrailerObj.src = YOUTUBE_EMBED + videokey;
    iTrailerObj.frameBorder = "0";
    iTrailerObj.allowFullscreen = "allowfullscreen";
    document.querySelector(".trailer").appendChild(iTrailerObj);
  }
}

class MovieList {
  constructor(url) {
    this.url = url;
  }

  getMovieList() {
    const response = getConnect.get(this.url).then(response => {
      return response.data;
    });

    return response;
  }

  getGenreArray() {
    const genreArr = getConnect.get(GENRE_NAME).then(response => {
      return response.data.genres;
    });

    return genreArr;
  }

  getGenreNames(dataset, ids) {
    const result = ids
      .map(id => dataset.find(data => data.id === id))
      .reduce(
        (addGen, gen, idx) =>
          ids.length === idx + 1
            ? addGen + gen.name
            : addGen + gen.name + " | ",
        ""
      );

    return result;
  }
}
