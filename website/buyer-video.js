const video = document.querySelector('#buyer-video');
const cover = document.querySelector('.buyer-video-cover');
const playButton = document.querySelector('#play-buyer-video');

if (video && cover && playButton) {
  playButton.addEventListener('click', async () => {
    try {
      await video.play();
    } catch {
      cover.hidden = true;
      video.controls = true;
    }
  });
  video.addEventListener('play', () => { cover.hidden = true; });
  video.addEventListener('ended', () => { cover.hidden = false; });
}
