import { useEffect, useState } from "react";
import { MagnifyingGlass } from "phosphor-react";

// Buttons
import { Primary, NavLink } from "../../components/Buttons";

// Components
import Playlist from "../../components/Playlist";
import SearchResults from "../../components/SearchResults";

// API
import getTracks from "../../api/getTracks";
import getUser from "../../api/getUser";
import createPlaylist from "../../api/createPlaylist";
import addTracksToPlaylist from "../../api/addTracksToPlaylist";

// Constants
import {
  SPOTIFY_ENDPOINTS,
  REDIRECT_URI,
  RESPONSE_TYPE,
  SPOTIFY_SCOPES,
} from "../../api/constants";

const Home = () => {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);

  const scopes = [
    SPOTIFY_SCOPES.PLAYLIST_MODIFY_PRIVATE,
    SPOTIFY_SCOPES.PLAYLIST_MODIFY_PUBLIC,
  ];

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    handleSearch();
  };

  const addSong = (songId, cover, title, artist) => {
    setSongs([...songs, { songId, cover, title, artist }]);
  };

  const removeSong = (index) => {
    setSongs(songs.filter((song, i) => i !== index));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!token) {
      setQuery("");
      setResults([]);
      return;
    }

    const data = await getTracks(query, token);
    setResults(data.tracks.items);
  };

  const handleCreatePlaylist = async (
    title,
    description,
    songIds,
    visibility
  ) => {
    console.log(title, description, visibility, songIds);

    if (title === null || songIds.length === 0) {
      console.log(
        "Make sure the title field is not empty and include at least one song!"
      );
      return;
    }

    // Get user ID
    const user = await getUser(token);
    const userId = user.id;

    // Create new playlist
    const response = await createPlaylist(
      userId,
      token,
      title,
      description,
      visibility
    );

    const playlistId = response.id;

    // Add songs to the playlist
    await addTracksToPlaylist(token, playlistId, songIds);
    console.log(title, description, songIds, userId, response, visibility);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-10">
      {!token ? (
        <Primary
          option="login to spotify"
          link={`${SPOTIFY_ENDPOINTS.AUTHORIZE}?client_id=${
            process.env.REACT_APP_CLIENT_ID
          }&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
            "%20"
          )}&response_type=${RESPONSE_TYPE}`}
        />
      ) : (
        <Primary option="logout of spotify" onClick={logout} />
      )}

      <div className="flex flex-row items-center w-1/2 justify-between">
        <form onSubmit={handleSearch} className="flex">
          <input
            className="px-4 rounded focus:outline-none bg-primary text-white"
            type="text"
            placeholder="search for songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-primary hover:bg-secondary text-white font-bold p-4 rounded-full ml-5"
            type="submit"
          >
            <MagnifyingGlass size="1.5rem" />
          </button>
        </form>

        <div className="flex flex-row gap-5">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary border-0 rounded-full focus:outline-none focus:shadow-outline"
            onClick={() => {
              setVisibility(!visibility);
            }}
          >
            {visibility ? "show on profile" : "don't show on profile"}
          </button>

          <NavLink
            option="create playlist"
            onClick={() =>
              handleCreatePlaylist(
                title,
                description,
                songs.map((song) => `spotify:track:${song.songId}`),
                visibility
              )
            }
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-center w-screen h-1/2 gap-10">
        <SearchResults results={results} addSong={addSong} />
        <Playlist
          songs={songs}
          removeSong={removeSong}
          setTitle={setTitle}
          setDescription={setDescription}
        />
      </div>
    </div>
  );
};

export default Home;