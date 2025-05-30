import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Enchantment {
  id: number;
  name: string;
  displayName: string;
  maxLevel: number;
}

const Enchantments = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Enchantment[]>([]);
  const [enchantments, setEnchantments] = useState<Enchantment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    const fetchEnchantments = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/PrismarineJS/minecraft-data/refs/heads/master/data/pc/1.21.4/enchantments.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Enchantment[] = await response.json();
        setEnchantments(data);
        setSearchResults(data); // Initialize search results with all enchantments
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch enchantments. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEnchantments();
  }, []);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    const result = enchantments.filter((enchantment) => 
      enchantment.displayName && regex.test(enchantment.displayName)
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
        placeholder="Enter enchantment display name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Display Name</th>
            <th className="p-2">Name</th>
            <th className="p-2">Max Level</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((enchantment, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              key={enchantment.id || index}
            >
              <td className="p-3">
                <CopyOnClick text={enchantment.id.toString()}>
                  <span>{enchantment.id}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={enchantment.displayName || ""}>
                  <span className="font-bold">{enchantment.displayName || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={enchantment.name || ""}>
                  <span className="code">{enchantment.name || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={enchantment.maxLevel.toString()}>
                  <span>{enchantment.maxLevel}</span>
                </CopyOnClick>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Enchantments;