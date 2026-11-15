
/* ========================================
   NGODINGTIME — SPOTIFY PLAYER
======================================== */

const spotifyLink = document.getElementById("spotify-link");

if (spotifyLink) {
    spotifyLink.href =
        "https://open.spotify.com/playlist/6k5JZvcL5SHAHToFpY6umE";

    spotifyLink.target = "_blank";
    spotifyLink.rel = "noopener noreferrer";
}

console.log("NgodingTime Spotify Player initialisé !");
