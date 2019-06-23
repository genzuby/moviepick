initCastList(movieId);

async function initCastList(selectedMovieId) {
  const castList = await getCastArray(selectedMovieId);
  const directorsList = await getCrewInfo(castList.crew, "Directing");
  const writersList = await getCrewInfo(castList.crew, "Writing");
  const producersList = await getCrewInfo(castList.crew, "Production");
  const castInfo = castList.cast;

  const director = directorsList.filter(person => person.job === "Director");

  makeMainCast(
    {
      directorsList: director,
      writersList: writersList.slice(0, 3),
      producersList: producersList.slice(0, 3),
      mainCast: castInfo.slice(0, 5)
    },
    "cast-main"
  );

  makeDetailCast([...director, ...castInfo]);
}

async function getCastArray(selectedMovieId) {
  const response = await getConnect.get(
    `${TMDB_URL}/movie/${selectedMovieId}/credits?api_key=${TMDB_AUTO_KEY}`
  );
  return response.data;
}

function getCrewInfo(crews, department) {
  const crewInfo = crews.filter(crew => crew.department === department);
  return crewInfo;
}

const accumCast = dataset => {
  return dataset.reduce(
    (accumList, data, idx) =>
      dataset.length === idx + 1
        ? accumList + ` ${data.name} (${data.job})`
        : accumList + ` ${data.name} (${data.job}), `,
    ""
  );
};

function makeMainCast(castObject, htmlObj) {
  let mainCastInfo = "";

  const dirctorName = accumCast(castObject.directorsList);
  const writerName = accumCast(castObject.writersList);
  const producerName = accumCast(castObject.producersList);

  const starName = castObject.mainCast.reduce(
    (starList, star, idx) =>
      castObject.mainCast.length === idx + 1
        ? (starList += ` ${star.name}`)
        : (starList += ` ${star.name}, `),
    ""
  );

  mainCastInfo = `<h4>Dirctors : ${dirctorName}</h4><h4>Writers : ${writerName}</h4><h4>Producers : ${producerName}</h4><h4>Stars : ${starName}</h4>`;
  document.querySelector(`.${htmlObj}`).innerHTML = mainCastInfo;
}

function makeDetailCast(castList) {
  castList.forEach(cast => {
    const castDiv = document.createElement("div");
    castDiv.className = "cast";
    castDiv.id = cast.id;

    const imgCast = document.createElement("img");
    // imgCast.src = TMDB_IMG_URL_SML + cast.profile_path;
    cast.profile_path === null
      ? (imgCast.src = checkImg("Person"))
      : (imgCast.src = TMDB_IMG_URL_SML + cast.profile_path);

    const actorName = document.createElement("h5");
    actorName.innerHTML = cast.name;
    const rolePar = document.createElement("p");
    rolePar.className = "role";
    rolePar.innerHTML = cast.character ? cast.character : cast.job;

    castDiv.appendChild(imgCast);
    castDiv.appendChild(actorName);
    castDiv.appendChild(rolePar);

    document.querySelector(".cast-list").appendChild(castDiv);
  });
}

// Personal detail info : not deveoped yet
function detailPersonInfo(personId) {
  const personInfo = getConnect.get(
    `${TMDB_URL}/person/${personId}?api_key=${TMDB_AUTO_KEY}`
    // "https://api.themoviedb.org/3/person/1245?api_key=5a52ce9bf39ebab5b14ee20ac710c3cf"
  );

  const dataSet = personInfo.data;
  console.log(dataSet);

  // const personCredit = await getConnect.get(
  //   `${TMDB_URL}/person/${personId}/combined_credits?api_key=${TMDB_AUTO_KEY}`
  // );
  // // console.log(personCredit);

  // const dataSet = personCredit.data;

  // let crewDeptArray = await dataSet.crew.map(person => {
  //   return person.job;
  // });
  // let crewDept = await [...new Set(crewDeptArray)];

  // if (dataSet.cast.length > 0) crewDept.unshift("Actor");

  // let staringMovie = dataSet.cast.filter(datum => {
  //   return datum.media_type === "movie";
  // });

  // let staringTv = dataSet.cast.filter(datum => {
  //   return datum.media_type === "tv";
  // });

  // console.log(staringMovie, staringTv);
}
