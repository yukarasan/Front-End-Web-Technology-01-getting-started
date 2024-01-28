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
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Artist name (test):
        <input name="artist" />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
        {albums.map((album, index) => (
          <li key={index}>
            {album.title} - Released on: {album.releaseDate || 'Unknown'}
            {album.trackCount ? `, Tracks: ${album.trackCount}` : ''}
          </li>
        ))}
      </ol>
    </form>
  );
}

export default App