import React, { useEffect, useState } from "react";

import Select from '@/components/elements/Select';
import useLocalStorage from "../../lib/useLocalStorage";

const InventoryList = () => {
    
    const inventory_types = [{
        name: "Anvil",
        img: "anvil"
    }, {
        name: "Beacon",
        img: "beacon"
    }, {
        name: "Blast Furnace",
        img: "blast-furnace"
    }, {
        name: "Brewing Stand",
        img: "brewing-stand"
    }, {
        name: "Cartography Table",
        img: "cartography-table"
    }, {
        name: "Chest (Large)",
        img: "chest-large"
    }, {
        name: "Chest (Small)",
        img: "chest-small"
    }, {
        name: "Crafting Table",
        img: "crafting-table"
    }, {
        name: "Dispenser",
        img: "dispenser"
    }, {
        name: "Donkey",
        img: "donkey"
    }, {
        name: "Dropper",
        img: "dropper"
    }, {
        name: "Enchanting Table",
        img: "enchanting-table"
    }, {
        name: "Furnace",
        img: "furnace"
    }, {
        name: "Grindstone",
        img: "grindstone"
    }, {
        name: "Hopper",
        img: "hopper"
    }, {
        name: "Horse",
        img: "horse"
    }, {
        name: "Llama",
        img: "llama"
    }, {
        name: "Loom",
        img: "loom"
    }, {
        name: "Player",
        img: "player"
    }, {
        name: "Shulker Box",
        img: "shulker-box"
    }, {
        name: "Smithing Table",
        img: "smithing-table"
    }, {
        name: "Smoker",
        img: "smoker"
    }, {
        name: "Stonecutter",
        img: "stonecutter"
    }, {
        name: "Villager",
        img: "villager"
    }]

    const [selectedImage, setSelectedImage] = useLocalStorage('inv_image', 'chest-large');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedImage(event.target.value);
    };

    return (
        <>
            <Select onChange={handleSelectChange} value={selectedImage}>
            {inventory_types.map((item, index) => (
                <option key={index} value={item.img}>
                {item.name}
                </option>
            ))}
            </Select>
            <br />
            {selectedImage && <img src={`https://mcutils.com/inventory/${selectedImage}.png`} alt={selectedImage} />}
        </>
    );

}

export default InventoryList