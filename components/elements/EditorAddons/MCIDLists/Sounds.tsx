import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Sound {
  id: number;
  name: string;
  sounds: string[];
}

const Sounds = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Sound[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    const fetchSounds = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/data/sounds.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sound[] = await response.json();
        setSounds(data);
        setSearchResults(data); // Initialize search results with all sounds
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sounds. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchSounds();
  }, []);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    const result = sounds.filter((sound) => 
      sound.name && regex.test(sound.name)
    );
    setSearchResults(result);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateSearch(searchValue);
    }
  };

  if (loading) return <SpinnerOverlay visible={loading} />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Input
        className="w-[26rem] p-2 mb-3 rounded-md bg-[#141517] text-white placeholder-gray-400"
        type="text"
        placeholder="Enter sound name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Sounds</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((sound, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              key={sound.id || index}
            >
              <td className="p-3">
                <CopyOnClick text={sound.id.toString()}>
                  <span>{sound.id}</span>
                </CopyOnClick>
              </td>
              <td className="p-3">
                <CopyOnClick text={sound.name || ""}>
                  <span className="code">{sound.name || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td className="p-3">
                <button onClick={
                    () => {
                      let s = sound.sounds[Math.floor(Math.random() * sound.sounds.length)];
                      let audio = new Audio(`https://github.com/misode/mcmeta/raw/refs/heads/assets/assets/minecraft/sounds/${s}.ogg`);
                      audio.volume = 0.3;
                      audio.play();
                    }
                  }><i className="fa-solid fa-play"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Sounds;