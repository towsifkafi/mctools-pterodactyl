import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Entity {
  id: number;
  name: string;
  displayName: string;
  image: string;
}

const Entities = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Entity[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    // @ts-ignore
    const fetchEntities = async () => {
      try {
        const response = await fetch("https://gist.githubusercontent.com/towsifkafi/9456de03870226c780febc692d90c00d/raw/42fc6a2105d1ed4adafdbb042c6f34aeeafd03dd/entities.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Entity[] = await response.json();
        setEntities(data);
        setSearchResults(data); // Initialize search results with all entities
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch entities. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchEntities();
  }, []);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    const result = entities.filter((entity) => 
        entity.displayName && regex.test(entity.displayName)
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
        placeholder="Enter entity display name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">ID</th>
            <th className="p-2">Display Name</th>
            <th className="p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((entity, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              key={entity.id || index}
            >
              <td>
                <img src={entity.image ? entity.image : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="} alt={entity.name} />
              </td>
              <td className="p-2">
                <CopyOnClick text={entity.id.toString()}>
                  <span>{entity.id}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={entity.displayName || ""}>
                  <span>{entity.displayName || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={entity.name || ""}>
                  <span className="code">{entity.name || "N/A"}</span>
                </CopyOnClick>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Entities;