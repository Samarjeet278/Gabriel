// import { metadatafile } from "./server.js";
// import { audioInit, updateSec, convert } from "./utils.js";

// const fol = localStorage.getItem("fol");
// const verified = localStorage.getItem("verified");
// const audioPath = localStorage.getItem("audio-path");
// const folData = JSON.parse(localStorage.getItem("fol-data"));

// const forVid = document.querySelector("#vid-nav");
// const folPic = document.querySelector("#fol-nav");
// const folDesc = document.querySelector("#fol-desc");
// const folBout = document.querySelector("#fol-about");
// const forUlQ = document.querySelector("#queue-list");
// const forSong = document.querySelector("#list-body");
// const forSept = document.querySelector("#separator");

// // Display (Audio-File + Info)
// const fileShow = async () => {
//   try {
//     const content = Object.values(folData[fol].songs); // Fetch Audio-File
//     const audios = content.map((data) => data + ".mp3");

//     localStorage.setItem("titles", JSON.stringify(content));

//     // Audio-File Metadata Extraction
//     const metadata = await Promise.all(
//       audios.map((audio) => metadatafile(audioPath + audio))
//     );

//     let total = null;
//     let duration = null;

//     const frag = document.createDocumentFragment();

//     metadata.forEach((data, index) => {
//       const temp = forSong.firstElementChild.cloneNode(true); // Enable Cloning
//       temp.children[0].textContent = index + 1;
//       temp.children[1].src = data.picture;
//       temp.children[2].textContent = data.title;
//       temp.children[3].textContent = data.artist;
//       temp.children[4].textContent = convert(data.duration);
//       frag.appendChild(temp); // Append Template

//       total = index + 1;
//       duration += data.duration;
//     });

//     const text = `Gabriel · ${total} Songs · About ${updateSec(duration)}`;
//     folPic.firstElementChild.src = folData[fol].picture;
//     folDesc.firstElementChild.lastElementChild.textContent = verified;
//     folDesc.children[1].textContent = fol;
//     folDesc.children[2].lastElementChild.textContent = text;

//     forSong.appendChild(frag); // Append Fragment
//     forSong.firstElementChild.classList.add("hidden"); // Delete Template
//   } catch (error) {
//     console.log(error);
//   }
// };

// async function main() {
//   try {
//     await fileShow(); // Display (Audio-File + Info)

//     // Play Audio-File (Click)
//     forSong.addEventListener("click", async (event) => {
//       const li = event.target.closest("li");
//       if (!li && !li.children.length > 1) return;
//       const audio = li.children[2].textContent.trim();
//       if (audio) await audioInit(audio, audioPath);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
