// Third-party players on the music page: a click-to-load SoundCloud widget and a lazily created
// Spotify embed. Each pauses the other when it starts playing, via the official APIs:
// https://developers.soundcloud.com/docs/api/html5-widget
// https://developer.spotify.com/documentation/embeds/references/iframe-api

interface SoundCloudWidget {
  bind(eventName: string, listener: () => void): void;
  pause(): void;
}

interface SoundCloudApi {
  Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & { Events: { PLAY: string } };
}

interface SpotifyPlaybackUpdate {
  data: { isPaused: boolean };
}

interface SpotifyEmbedController {
  addListener(eventName: 'playback_update', listener: (event: SpotifyPlaybackUpdate) => void): void;
  pause(): void;
}

interface SpotifyIframeApi {
  createController(
    element: HTMLElement,
    options: { uri: string },
    callback: (controller: SpotifyEmbedController) => void,
  ): void;
}

const musicWindow = window as Window & {
  SC?: SoundCloudApi;
  onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
};

let soundCloudWidget: SoundCloudWidget | undefined;
let spotifyController: SpotifyEmbedController | undefined;

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.append(script);
  });

const loadButton = document.querySelector<HTMLButtonElement>('#load-featured-player');
const embed = document.querySelector<HTMLElement>('#featured-player-embed');

loadButton?.addEventListener('click', async () => {
  if (!embed || embed.querySelector('iframe')) return;

  const playerUrl = loadButton.dataset.playerUrl;
  const trackTitle = loadButton.dataset.trackTitle;
  if (!playerUrl || !trackTitle) return;

  loadButton.disabled = true;
  spotifyController?.pause();

  // The widget API only sees the player's ready message if it is loaded before the iframe.
  // Without it the player still works, it just cannot pause Spotify.
  const soundCloud = await loadScript('https://w.soundcloud.com/player/api.js').then(
    () => musicWindow.SC,
    () => undefined,
  );

  const iframe = document.createElement('iframe');
  iframe.title = `SoundCloud player for ${trackTitle}`;
  iframe.allow = 'autoplay';
  iframe.src = playerUrl;
  iframe.loading = 'eager';

  embed.append(iframe);
  embed.hidden = false;
  loadButton.setAttribute('aria-expanded', 'true');
  loadButton.textContent = 'Player loaded';

  if (soundCloud) {
    soundCloudWidget = soundCloud.Widget(iframe);
    soundCloudWidget.bind(soundCloud.Widget.Events.PLAY, () => spotifyController?.pause());
  }
});

const spotifyEmbed = document.querySelector<HTMLElement>('#spotify-embed');
const spotifyTarget = spotifyEmbed?.querySelector<HTMLElement>('[data-spotify-target]');

if (spotifyEmbed && spotifyTarget) {
  const { spotifyUri, spotifyTitle } = spotifyEmbed.dataset;

  const createSpotifyController = (api: SpotifyIframeApi) => {
    if (!spotifyUri) return;

    api.createController(spotifyTarget, { uri: spotifyUri }, (controller) => {
      const spotifyIframe = spotifyEmbed.querySelector('iframe');
      if (spotifyIframe && spotifyTitle) spotifyIframe.title = spotifyTitle;

      let wasPaused = true;
      controller.addListener('playback_update', ({ data }) => {
        if (wasPaused && !data.isPaused) soundCloudWidget?.pause();
        wasPaused = data.isPaused;
      });
      spotifyController = controller;
    });
  };

  // Mirrors the native lazy iframe: the embed API is only fetched as the playlist nears the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      observer.disconnect();
      musicWindow.onSpotifyIframeApiReady = createSpotifyController;
      void loadScript('https://open.spotify.com/embed/iframe-api/v1').catch(() => undefined);
    },
    { rootMargin: '600px 0px' },
  );
  observer.observe(spotifyEmbed);
}
