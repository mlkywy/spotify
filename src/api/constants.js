export const REDIRECT_URI = "http://localhost:3000";
export const RESPONSE_TYPE = "token";

export const SPOTIFY_SCOPES = {
  PLAYLIST_MODIFY_PRIVATE: "playlist-modify-private",
  PLAYLIST_MODIFY_PUBLIC: "playlist-modify-public",
};

export const SPOTIFY_ENDPOINTS = {
  AUTHORIZE: "https://accounts.spotify.com/authorize",
  GET_USER: "https://api.spotify.com/v1/me",
  GET_TRACKS: "https://api.spotify.com/v1/search",
  CREATE_PLAYLIST: "https://api.spotify.com/v1/users/:userId/playlists",
  ADD_TRACKS_TO_PLAYLIST:
    "https://api.spotify.com/v1/playlists/:playlistId/tracks",
};
