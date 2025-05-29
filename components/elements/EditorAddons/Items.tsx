import React, { useEffect, useState } from "react";
import items from './items';

import Input from "@/components/elements/Input";

interface Item {
    newID?: string;
    legacyID?: string;
    name?: string;
    stackSize?: number;
    texture?: string;
}

const Items = () => {

  // Item Search Logic
  const [searchValue, setSearchValue] = useState('');
  // @ts-ignore
  const [searchResults, setSearchResults] = useState<Item[]>(items);

  const updateSearch = (query: string) => {
    const lowercase = query.toLowerCase();
    setSearchResults(
      // @ts-ignore
      items.filter((item) => item.name.toLowerCase().replace(' ', '').includes(lowercase))
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        updateSearch(searchValue);
    }
  };

  const handleInput = () => {
    updateSearch(searchValue);
  };

    return (
        <>

            <Input
              className="w-[26rem] p-2 rounded-md bg-[#141517] text-white placeholder-gray-400"
              type="text"
              placeholder="Enter item name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleInput}
            />

            <br />
            <br />

            <table width={"100%"}>
                <thead>
                <tr style={{ marginBottom: "10px" }}>
                    <th>Texture</th>
                    <th>Name</th>
                    <th>ID</th>
                    <th>1.12 ID</th>
                </tr>
                </thead>
                <tbody>
                {searchResults.map((item, index) => (
                    <tr style={{ marginBottom: "5px", backgroundColor: index % 2 === 0 ? "transparent" : "#494D69" }} key={item.legacyID}>
                        <td>
                            <img width={"35px"} src={item.texture}/>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.newID}</td>
                        <td>{item.legacyID}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </>
    );
};

export default Items;