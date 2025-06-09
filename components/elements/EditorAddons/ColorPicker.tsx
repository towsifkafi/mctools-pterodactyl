import React, { useState, useEffect } from "react";

import { Button } from "@/components/elements/button";
import CopyOnClick from "@/components/elements/CopyOnClick";

import useLocalStorage from "../../lib/useLocalStorage";

const ColorPicker = () => {
    
    const [color, setColor] = useLocalStorage('colorpicker_color', '#00AAAA');

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const common_colors = [{"color":"#000000","code":"§0"},{"color":"#0000AA","code":"§1"},{"color":"#00AA00","code":"§2"},{"color":"#00AAAA","code":"§3"},{"color":"#AA0000","code":"§4"},{"color":"#AA00AA","code":"§5"},{"color":"#FFAA00","code":"§6"},{"color":"#AAAAAA","code":"§7"},{"color":"#555555","code":"§8"},{"color":"#5555FF","code":"§9"},{"color":"#55FF55","code":"§a"},{"color":"#55FFFF","code":"§b"},{"color":"#FF5555","code":"§c"},{"color":"#FF55FF","code":"§d"},{"color":"#FFFF55","code":"§e"},{"color":"#FFFFFF","code":"§f"}]

    return (
        <>
        
        <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-full h-24 cursor-pointer bg-transparent border-none"
              style={{ border: "none", padding: "0", borderColor: "transparent" }}
        />
        <br />
        {/* commonly used colors */}
        <div className="flex items-center gap-2 mt-2">
            {common_colors.map((color, index) => (
                <div key={index} onClick={() => setColor(color.color)}
                className="w-8 h-8 rounded-md cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: color.color }}
                >
                    <span>{color.code}</span>
                </div>
            ))}
        </div>
        <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 mt-2">
                <div
                    className="w-16 h-16 rounded-md border border-gray-400"
                    style={{ backgroundColor: color }}
                />
                <span className="text-lg font-mono">{color.toUpperCase()}</span>
              </div>
              {/* <Button size={Button.Sizes.Small} onClick={copyToClipboard}>
                Copy
              </Button> */}
              <CopyOnClick text={color} children={<Button size={Button.Sizes.Small}>Copy</Button>} />
        </div>
        
        
        </>
    );
};


export default ColorPicker;