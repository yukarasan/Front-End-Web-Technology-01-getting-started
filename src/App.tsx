import { FormEvent, useState } from 'react'
import './App.css'

function App() {
  return (
    <AlbumPicker />
  )
}

function AlbumPicker() {
  // Updating the state to hold an array of objects
  const [albums, setAlbums] = useState<{ title: string, releaseDate: string, trackCount: number }[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false); // State to track if search has been performed

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      artist: { value: string };
    };
    const artist = encodeURIComponent(target.artist.value);
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
    const response = await fetch(url);

    // Includes dates and track counts in the type
    const mbResult = (await response.json()) as {
      releases: { title: string, date: string, 'track-count': number }[];
    };
    
    console.log(mbResult);
    const { releases } = mbResult;

    // Updating this to include the release date and track count
    setAlbums(releases.map(({ title, date, 'track-count': trackCount }) => ({ title, releaseDate: date, trackCount })));
    // Updating the state to indicate a search has been performed: 
    setSearchPerformed(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Artist name:
          <input name="artist" />
        </label>
      </div>
      <div className="search-button">
        <button type="submit" >Search</button>
      </div>

      {searchPerformed ? 
        (albums.length > 0 ? <p>Albums:</p> : <p>No albums found for this artist.</p>) : 
        <p>Search for your favorite artist!</p>
      }

      <ol>
        {albums.map((album, index) => (
          <li key={index}>
          <strong>{album.title}</strong> - Released on: {album.releaseDate || 'Unknown'}
          {album.trackCount ? `, Tracks: ${album.trackCount}` : ''}
        </li>
        ))}
      </ol>
    </form>
  );
}

export default App