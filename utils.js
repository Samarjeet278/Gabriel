import { metadatafile } from "./server.js";

// Select Casual Index
export const select = (array) => {
  try {
    if (!Array.isArray(array) || array.length == 0)
      console.log("Invalid Input.");

    const index = Math.floor(Math.random() * array.length);
    return array[index];
  } catch (error) {
    console.log(error);
  }
};

// Convert (Sec Into Min)
export const convert = (sec) => {
  try {
    if (isNaN(sec) || sec < 0) return "00:00";
    const min = Math.floor(sec / 60);
    const remainSec = Math.floor(sec % 60);
    const formatMin = min.toString().padStart(2, "0");
    const formatSec = remainSec.toString().padStart(2, "0");
    return `${formatMin}:${formatSec}`;
  } catch (error) {
    console.log(error);
  }
};

// Convert (Sec Into H/M/S)
export const updateSec = (sec) => {
  try {
    if (isNaN(sec) || sec < 0) return "0";
    if (sec >= 3600) {
      const hrs = Math.floor(sec / 3600);
      return `${hrs} Hour${hrs > 1 ? "s" : ""}`;
    } else if (sec >= 60) {
      const min = Math.floor(sec / 60);
      return `${min} Minute${min > 1 ? "s" : ""}`;
    } else {
      return `${sec} Second${sec !== 1 ? "s" : ""}`;
    }
  } catch (error) {
    console.log(error);
  }
};

let file = null;

const forAudio = new Audio();
const audioPath = localStorage.getItem("audio-path");
const titles = JSON.parse(localStorage.getItem("titles"));

const forSound = document.querySelectorAll("#sound-box");
const forInfoBox = document.querySelectorAll("#info-box");
const forProgress = document.querySelectorAll("#progress");
const forCoverBox = document.querySelectorAll("#cover-box");
const forProgBox = document.querySelectorAll("#progress-box");
const forContInfo = document.querySelectorAll("#content-info");
const forNextBtns = document.querySelectorAll("[aria-label='next']");
const forShuBtns = document.querySelectorAll("[aria-label='shuffle']");
const forReptBtns = document.querySelectorAll("[aria-label='repeat']");
const forPrevBtns = document.querySelectorAll("[aria-label='previous']");
const forDownBtns = document.querySelectorAll("[aria-label='download']");
const forPlayBtns = document.querySelectorAll("[aria-label='play-pause']");

// Audio-File Play
export const audioInit = async (audio, path) => {
  try {
    if (!audio && !path) return;

    file = audio; // Update

    const source = path + "/" + audio + ".mp3";

    if (forAudio.src !== source) {
      forAudio.src = source;
      forAudio.preload = "auto";
      forAudio.load(); // Load
    }

    await forAudio.play().catch(console.log);

    // Update Play-Pause Button
    forPlayBtns.forEach((button) => {
      button.firstElementChild.classList.add("hidden");
      button.lastElementChild.classList.remove("hidden");
    });

    const metadata = await metadatafile(source); // Fetch Metadata

    const comment =
      typeof metadata.comment === "object"
        ? Object.values(metadata.comment)[0]
        : metadata.comment;

    const lyrics = String(comment || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0); // Lyrics Array

    // Update Info
    forInfoBox.forEach((tag) => {
      tag.firstElementChild.textContent = metadata.title;
      tag.lastElementChild.textContent = metadata.artist;
    });

    // Update Picture
    forContInfo.forEach((tag) => {
      tag.firstElementChild.setAttribute("src", metadata.picture);
    });

    // Update Extended Info
    forCoverBox.forEach((tag) => {
      tag.firstElementChild.setAttribute("src", metadata.picture);

      const frag = document.createDocumentFragment();
      const template = tag.lastElementChild;

      lyrics.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        frag.appendChild(li);
      });

      template.innerHTML = "";
      template.appendChild(frag); // Update Lyrics
    });
  } catch (error) {
    console.log(error);
  }
};

try {
  // Button Update (Play-Pause)
  forAudio.addEventListener("ended", () => {
    forPlayBtns.forEach((button) => {
      button.lastElementChild.classList.add("hidden");
      button.firstElementChild.classList.remove("hidden");
    });
  });

  // Progress Functionality (Status)
  forAudio.addEventListener("timeupdate", () => {
    const percent = (forAudio.currentTime / forAudio.duration) * 100;
    forProgBox.forEach((tag) => {
      tag.firstElementChild.textContent = convert(forAudio.currentTime);
      tag.lastElementChild.textContent = convert(forAudio.duration);
    });

    forProgress.forEach((tag) => {
      tag.firstElementChild.style.left = percent + "%";
      tag.lastElementChild.style.width = percent + "%";
    });
  });

  // Progress Functionality (Click)
  forProgress.forEach((tag) => {
    tag.addEventListener("click", (event) => {
      if (!forAudio.src) return;
      // Calculate Position
      const range = event.currentTarget.getBoundingClientRect();
      const click = event.clientX - range.left;
      const percent = Math.min(100, Math.max(0, (click / range.width) * 100)); // Ensure 0 - 100 Range

      forAudio.currentTime = (percent / 100) * forAudio.duration;

      // Update Progress UI
      tag.firstElementChild.style.left = percent + "%";
      tag.lastElementChild.style.width = percent + "%";
    });
  });

  // Button Functionality (Play-Pause)
  forPlayBtns.forEach((button) => {
    button.addEventListener("click", () => {
      if (!forAudio.src) return;
      else if (forAudio.paused) {
        forAudio.play();
        button.firstElementChild.classList.add("hidden");
        button.lastElementChild.classList.remove("hidden");
      } else {
        forAudio.pause();
        button.lastElementChild.classList.add("hidden");
        button.firstElementChild.classList.remove("hidden");
      }
    });
  });

  // Button Functionality (Previous)
  forPrevBtns.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!forAudio.src) return;
      const index = titles.indexOf(file) - 1;
      if (index >= 0) await audioInit(titles[index], audioPath);
    });
  });

  // Button Functionality (Next)
  forNextBtns.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!forAudio.src) return;
      const index = titles.indexOf(file) + 1;
      if (index < titles.length) await audioInit(titles[index], audioPath);
    });
  });

  // Button Functionality (Shuffle)
  forShuBtns.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!forAudio.src) return;
      await audioInit(select(titles), audioPath);
    });
  });

  // Button Functionality (Repeat)
  forReptBtns.forEach((button) => {
    button.dataset.repeat = "false"; // Default State

    button.addEventListener("click", () => {
      const isRepeating = button.dataset.repeat === "true";

      if (isRepeating) {
        button.dataset.repeat = "false";
        forAudio.removeEventListener("ended", audioRepeat);
        button.firstElementChild.setAttribute("color", "#ffffff"); // Inactive color
      } else {
        button.dataset.repeat = "true";
        forAudio.addEventListener("ended", audioRepeat);
        button.firstElementChild.setAttribute("color", "#ed254e"); // Active color
      }
    });

    const audioRepeat = () => {
      forAudio.play();
      forPlayBtns.forEach((button) => {
        button.firstElementChild.classList.add("hidden");
        button.lastElementChild.classList.remove("hidden");
      });
    };
  });
  // Button Functionality (Download)
  forDownBtns.forEach((button) => {
    button.addEventListener("click", () => {
      if (!forAudio.src) return;
      const link = document.createElement("a");
      link.href = forAudio.src;
      link.download = `Gabriel Music 320kbps - ${file}`;
      link.click();
    });
  });

  // Button Functionality (Sound)
  forSound.forEach((button) => {
    button.firstElementChild.addEventListener("click", () => {
      button.firstElementChild.firstElementChild.classList.toggle("hidden");
      button.firstElementChild.lastElementChild.classList.toggle("hidden");

      if (forAudio.volume > 0) {
        forAudio.volume = 0.0;
        button.lastElementChild.firstElementChild.style.left = "0%";
        button.lastElementChild.lastElementChild.style.width = "0%";
      } else {
        forAudio.volume = 1.0;
        button.lastElementChild.firstElementChild.style.left = "100%";
        button.lastElementChild.lastElementChild.style.width = "100%";
      }
    });

    // Sound Functionality
    forSound.forEach((tag) => {
      tag.lastElementChild.addEventListener("click", (event) => {
        // Calculate Position
        const range = event.currentTarget.getBoundingClientRect();
        const click = event.clientX - range.left;
        const percent = Math.min(100, Math.max(0, (click / range.width) * 100)); // Ensure 0 - 100 Range

        forAudio.volume = percent / 100;
        tag.lastElementChild.firstElementChild.style.left = percent + "%";
        tag.lastElementChild.lastElementChild.style.width = percent + "%";

        if (percent === 0) {
          tag.firstElementChild.firstElementChild.classList.add("hidden");
          tag.firstElementChild.lastElementChild.classList.remove("hidden");
        } else {
          tag.firstElementChild.lastElementChild.classList.add("hidden");
          tag.firstElementChild.firstElementChild.classList.remove("hidden");
        }
      });
    });
  });
} catch (error) {
  console.log(error);
}
