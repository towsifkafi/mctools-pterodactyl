import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Effect {
  name: string;
  id: string;
  image: string;
}

const Effects = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Effect[]>([]);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    // @ts-ignore
    const fetchEffects = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/data/effects.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Effect[] = await response.json();
        setEffects(data);
        setSearchResults(data); // Initialize search results with all effects
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch effects. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEffects();
  }, []);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    const result = effects.filter((effect) => 
      effect.name && regex.test(effect.name)
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
        placeholder="Enter effect name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">Icon</th>
            <th className="p-2">Name</th>
            <th className="p-2">ID</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((effect, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              key={effect.id || index}
            >
              <td>
                <img
                  className="p-2 m-1"
                  width={"50px"}
                  src={effect.image || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
                  alt={effect.name || "Effect"}
                />
              </td>
              <td className="p-2">
                <CopyOnClick text={effect.name || ""}>
                  <span>{effect.name || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={effect.id || ""}>
                  <span className="code">{effect.id || "N/A"}</span>
                </CopyOnClick>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Effects;