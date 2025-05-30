import React, { useEffect, useState } from "react";

import Input from "@/components/elements/Input";
import CopyOnClick from "@/components/elements/CopyOnClick";
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Item {
  newID?: string;
  legacyID?: string;
  name?: string;
  stackSize?: number;
  texture?: string;
}

const Items = () => {
  
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //@ts-ignore
    const fetchItems = async () => {
      try {
        
        const response = await fetch("https://raw.githubusercontent.com/flytegg/mc-utils/refs/heads/master/src/lib/items.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Item[] = await response.json();
        setItems(data);
        setSearchResults(data); // Initialize search results with all items
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch items. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    console.log("Updated searchResults:", searchResults);
    setSearchResults(searchResults);
  }, [searchResults]);


  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase().trim();
    const regex = new RegExp(`${lowercase}`, "gi");
    let result = items.filter((item) => {
        // @ts-ignore
        return item.name && regex.test(item.name);
      })
    console.log(result);
    setSearchResults(result);
  };

  // const handleInput = () => {
  //   updateSearch(searchValue);
  // };

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
        placeholder="Enter item name..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyPress}
        // onBlur={handleInput}
      />

      <table width={"100%"}>
        <thead style={{ marginBottom: "10px" }}>
          <tr>
            <th className="p-2">Texture</th>
            <th className="p-2">Name</th>
            <th className="p-2">ID</th>
            <th className="p-2">1.8 ID</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((item, index) => (
            <tr
              className="even:bg-gray-400/30 odd:bg-gray-500/30"
              // key={item.legacyID || index} // Fallback to index if legacyID is undefined
            >
              <td>
                <img
                  className="p-1 ml-2"
                  width={"35px"}
                  src={item.texture || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
                  alt={item.name || "Item"}
                />
              </td>
              <td>
                <CopyOnClick text={item.name || ""}>
                  <span>{item.name || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={item.newID || ""}>
                  <span className="code">{item.newID || "N/A"}</span>
                </CopyOnClick>
              </td>
              <td>
                <CopyOnClick text={item.legacyID || ""}>
                  <span className="code">{item.legacyID || "N/A"}</span>
                </CopyOnClick>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Items;