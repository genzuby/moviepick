function autoPlay(key) {
  document.querySelector(
    ".trailer > iframe"
  ).src = `${YOUTUBE_EMBED}${key}?autoplay=1`;
}

function makeVideoList(results) {
  results.forEach(result => {
    const divObj = document.createElement("picture");
    divObj.id = result.key;
    divObj.className = "trailer-thumb";

    const youtubeKey = result.key;
    const imgVal = `<img src="//img.youtube.com/vi/${youtubeKey}/0.jpg" onclick="autoPlay('${youtubeKey}');" />`;

    divObj.innerHTML = imgVal;
    document.querySelector(".trailer-thumb-group").appendChild(divObj);
  });
  // Add arrowbutton for next items
  document.querySelector(
    ".trailer-thumb-group"
  ).innerHTML += `<i class="fas fa-chevron-circle-left left-arrow" id="left-arrow" onclick="moveLeft();"></i>
  <i class="fas fa-chevron-circle-right right-arrow" id="right-arrow" onclick="moveRight();"></i>`;
}

let currentClipPage = 0;
const lenClip = 6;

function listReset() {
  const clipList = document.querySelectorAll(".trailer-thumb");
  for (let i = 0; i < clipList.length; i++) {
    clipList[i].style.display = "none";
  }
}

function setClipList() {
  const clipList = document.querySelectorAll(".trailer-thumb");
  if (lenClip >= clipList.length) {
    return;
  }
  listReset();
  for (let i = 0; i < lenClip; i++) {
    clipList[i].style.display = "block";
  }
  document.querySelector("#right-arrow").style.display = "block";
}

function moveLeft() {
  listReset();
  const clipList = document.querySelectorAll(".trailer-thumb");

  currentClipPage -= lenClip;
  const untilCount = currentClipPage + lenClip;
  for (let i = currentClipPage; i < untilCount; i++) {
    clipList[i].style.display = "block";
  }

  if (currentClipPage == 0)
    document.querySelector(".left-arrow").style.display = "none";
  document.querySelector(".right-arrow").style.display = "block";
}

function moveRight() {
  const clipList = document.querySelectorAll(".trailer-thumb");
  listReset();

  currentClipPage += lenClip;
  const untilCount =
    currentClipPage + lenClip > clipList.length
      ? clipList.length
      : currentClipPage + lenClip;
  for (let i = currentClipPage; i < untilCount; i++) {
    clipList[i].style.display = "block";
  }

  if (currentClipPage + lenClip >= clipList.length)
    document.querySelector("#right-arrow").style.display = "none";
  document.querySelector("#left-arrow").style.display = "block";
}
