import { fetchAudio, fetchFile, metadatafile } from "./server.js";
import { audioInit } from "./utils.js";

const dataPath = "/database/data/";
const audioPath = "/database/audio/";
const videoPath = "/database/video/";

localStorage.setItem("data-path", dataPath);
localStorage.setItem("audio-path", audioPath);
localStorage.setItem("video-path", videoPath);

const forArtist = document.querySelector("#round-box ul");
const forSong = document.querySelector("#content-box ul");

// Display Audio-File
const fileShow = async () => {
  try {
    const audios = await fetchAudio(audioPath); // Fetch Audio-File
    const titles = audios.map((audio) => decodeURI(audio.replace(".mp3", "")));

    localStorage.removeItem("titles"); // Clear
    localStorage.setItem("titles", JSON.stringify(titles)); // Default

    const metadata = await Promise.all(
      audios.map((audio) => metadatafile(audioPath + audio))
    ); // Fetch Metadata

    const frag = document.createDocumentFragment();

    metadata.slice(0, metadata.length / 2).forEach((data) => {
      const temp = forSong.firstElementChild.cloneNode(true);
      temp.firstElementChild.src = data.picture;
      temp.children[1].textContent = data.title;
      frag.appendChild(temp);
    });

    forSong.appendChild(frag);
    forSong.firstElementChild.classList.add("hidden");
  } catch (error) {
    console.log(error);
  }
};

// Display Fol (Artist + Playlist)
const folShow = async (file, template) => {
  try {
    if (!file && !template) return;
    const datafile = await fetchFile(dataPath + file); // Fetch Data
    const keys = Object.keys(datafile); // Collect Keys

    const frag = document.createDocumentFragment();

    keys.slice(0, 20).forEach((key) => {
      const temp = template.firstElementChild.cloneNode(true);
      temp.firstElementChild.src = datafile[key].picture;
      temp.children[1].textContent = key;
      frag.appendChild(temp);
    });

    template.appendChild(frag);
    template.firstElementChild.classList.add("hidden");

    return datafile; // Return Datafile
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  try {
    const artists = await folShow("artists.json", forArtist); // Display Fol (Artist)
    await fileShow(); // Display Audio-File

    // Play Audio-File (Click)
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
