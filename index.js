import { fetchAudio, fetchFile, metadatafile } from "./server.js";
import { audioInit } from "./utils.js";

const dataPath = "/database/data/";
const audioPath = "/database/audio/";
const videoPath = "/database/video/";

localStorage.setItem("data-path", dataPath);
localStorage.setItem("audio-path", audioPath);
localStorage.setItem("video-path", videoPath);

const forSong = document.querySelector("#content-box ul");
const forArtist = document.querySelector("#round-box ul");

// Display Audio-File
const fileShow = async () => {
  try {
    const audios = await fetchAudio(audioPath); // Fetch Audio-File
    const titles = audios.map((audio) => decodeURI(audio.replace(".mp3", "")));

    localStorage.setItem("titles", JSON.stringify(titles)); // Default

    const metadata = await Promise.all(
      audios.map((audio) => metadatafile(audioPath + audio))
    ); // Fetch Metadata

    const frag = document.createDocumentFragment();

    metadata.slice(0, metadata.length / 2).forEach((data) => {
      const temp = forSong.firstElementChild.cloneNode(true); // Cloning Enable
      temp.children[0].src = data.picture;
      temp.children[1].textContent = data.title;
      frag.appendChild(temp);
    });

    forSong.appendChild(frag); // Append Frag
    forSong.firstElementChild.classList.add("hidden"); // Hide Temp
  } catch (error) {
    console.log(error);
  }
};

// Display Fol (Artist + Playlist)
const folShow = async (file, template) => {
  try {
    if (!file && !template) return; // Default
    const fileData = await fetchFile(dataPath + file); // Fetch File-Data
    const keys = Object.keys(fileData); // Collect Keys

    const frag = document.createDocumentFragment();

    keys.slice(0, 20).forEach((key) => {
      const temp = forArtist.firstElementChild.cloneNode(true); // Cloning Enable
      temp.children[0].src = fileData[key].picture;
      temp.children[1].textContent = key;
      frag.appendChild(temp);
    });

    forArtist.appendChild(frag); // Append Frag
    forArtist.firstElementChild.classList.add("hidden"); // Hide Temp

    return fileData; // Return File-Data
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  try {
    const artists = await folShow("artists.json", forArtist);
    await fileShow();

    forSong.addEventListener("click", async (event) => {
      const li = event.target.closest("li");
      if (li && li.children.length > 1) {
        const audio = li.children[1].textContent.trim();
        if (audio) await audioInit(audio, audioPath);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

main();
