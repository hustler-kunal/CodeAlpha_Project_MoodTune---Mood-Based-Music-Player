const moods = {
  chill: [
    { title: "Chill Vibes", file: "assets/chill/song1.mp3", cover: "assets/chill/cover1.jpg" }
  ],
  focus: [
    { title: "Deep Focus", file: "assets/focus/song2.mp3", cover: "assets/focus/cover2.jpg" }
  ],
  happy: [
    { title: "Good Mood", file: "assets/happy/song3.mp3", cover: "assets/happy/cover3.jpg" }
  ]
};

let currentMood = "";
let currentIndex = 0;
let isShuffling = false;
let isRepeating = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const volumeSlider = document.getElementById("volume");
const seekbar = document.getElementById("seekbar");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const playlistElement = document.getElementById("playlist");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const player = document.querySelector(".player");
const volumeValueDisplay = document.getElementById("volume-value");

document.querySelectorAll("[data-mood]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentMood = btn.dataset.mood;
    currentIndex = 0;
    loadTrack();
    player.style.display = "flex";
    document.body.setAttribute("data-mood", currentMood);
    loadPlaylist();
  });
});

function loadTrack() {
  const track = moods[currentMood][currentIndex];
  audio.src = track.file;
  cover.src = track.cover;
  title.textContent = track.title;
  audio.load();
  audio.play();
  
  // Update play button state when a new track is loaded and auto-play starts
  playBtn.textContent = "⏸";  // Change button to 'pause' when song starts automatically

  // Reset the volume to the default value
  volumeSlider.value = 1;
  audio.volume = 1;
  volumeValueDisplay.textContent = "100%"; // Update display
}

function loadPlaylist() {
  playlistElement.innerHTML = '';
  moods[currentMood].forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadTrack();
    });
    playlistElement.appendChild(li);
  });
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";  // Change button to 'pause' when song starts playing
  } else {
    audio.pause();
    playBtn.textContent = "▶️";  // Change button to 'play' when song is paused
  }
});

nextBtn.addEventListener("click", () => {
  if (isShuffling) {
    currentIndex = Math.floor(Math.random() * moods[currentMood].length);
  } else {
    currentIndex = (currentIndex + 1) % moods[currentMood].length;
  }
  loadTrack();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + moods[currentMood].length) % moods[currentMood].length;
  loadTrack();
});

repeatBtn.addEventListener("click", () => {
  isRepeating = !isRepeating;
  repeatBtn.textContent = isRepeating ? "🔁 (On)" : "🔁 (Off)";
});

shuffleBtn.addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleBtn.textContent = isShuffling ? "🔀 (On)" : "🔀 (Off)";
});

audio.addEventListener("ended", () => {
  if (isRepeating) {
    loadTrack();
  } else {
    nextBtn.click();
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;

  // Update the volume value display
  const volumePercentage = Math.round(volumeSlider.value * 100);
  volumeValueDisplay.textContent = `${volumePercentage}%`;
});

audio.addEventListener("timeupdate", () => {
  seekbar.value = (audio.currentTime / audio.duration) * 100 || 0;

  // Format current time and duration
  const currentMinutes = Math.floor(audio.currentTime / 60);
  const currentSeconds = Math.floor(audio.currentTime % 60);
  const durationMinutes = Math.floor(audio.duration / 60);
  const durationSeconds = Math.floor(audio.duration % 60);

  currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
  durationDisplay.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
});

seekbar.addEventListener("input", () => {
  audio.currentTime = (seekbar.value / 100) * audio.duration;
});
