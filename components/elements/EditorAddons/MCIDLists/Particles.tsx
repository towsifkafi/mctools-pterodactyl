import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Particle {
  name: string;
  image: string;
}

const Particles = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    const fetchParticles = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/data/particles.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Particle[] = await response.json();
        setParticles(data);
        setSearchResults(data); // Initialize search results with all particles
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch particles. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchParticles();
  }, []);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    const result = particles.filter((particle) => 
      particle.name && regex.test(particle.name)
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
        placeholder="Enter particle name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((particle, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              key={particle.name || index}
            >
              <td>
                <img
                  className="p-1"
                  width={"100px"}
                  src={particle.image || "data:image/gif;base64,R0lGODlhAQABAAAAACH5ne+1BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
                  alt={particle.name || "Particle"}
                />
              </td>
              <td>
                <CopyOnClick text={particle.name || ""}>
                  <span className="code">{particle.name || "N/A"}</span>
                </CopyOnClick>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Particles;