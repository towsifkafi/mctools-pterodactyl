import React, { useEffect, useState } from 'react';

import emojis from './emojis';
import Button from '@/components/elements/Button';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Input from '@/components/elements/Input';

interface Emoji {
    emoji: string;
    name: string;
}

const EmojiList = () => {

    // Item Search Logic
    const [searchValue, setSearchValue] = useState('');
    // @ts-ignore
    const [searchResults, setSearchResults] = useState<Emoji[]>(emojis);

    const updateSearch = (query: string) => {
        const lowercase = query.toLowerCase();
        setSearchResults(
        // @ts-ignore
        emojis.filter((item) => item.name.toLowerCase().replace('_', '').includes(lowercase))
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
        <div className='flex flex-wrap gap-1' style={{ fontFamily: 'Monocraft' }}>

            <Input
              className="w-[26rem] p-2 rounded-md bg-[#141517] text-white placeholder-gray-400 mb-5"
              type="text"
              placeholder="Enter emoji name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleInput}
            />

            {searchResults.map((item, index) => (
                <CopyOnClick key={index} text={item.emoji}>
                    <Button color='grey' key={index}>
                        {item.emoji}
                    </Button>
                </CopyOnClick>
            ))}
            
        </div>
    );

}


export default EmojiList;