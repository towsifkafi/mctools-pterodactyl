import React, { useEffect, useState } from 'react';

import Button from '@/components/elements/Button';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Input from '@/components/elements/Input';
import SpinnerOverlay from "@/components/elements/SpinnerOverlay";

interface Emoji {
    emoji: string;
    name: string;
}

const EmojiList = () => {
    // Item Search Logic
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<Emoji[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // @ts-ignore
        const fetchEmojis = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://gist.githubusercontent.com/towsifkafi/e379ca37bcaaa7d74ee475e80a2db3b3/raw/d98f73df49275ea7445d3ae20dc47de997803461/emojis.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch emoji data');
                }
                const emojis: Emoji[] = await response.json();
                setSearchResults(emojis);
            } catch (err) {
                setError('Error fetching emojis');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmojis();
    }, []);

    const updateSearch = (query: string) => {
        const lowercase = query.toLowerCase();
        setSearchResults(
            // @ts-ignore
            searchResults.filter((item) => item.name.toLowerCase().replace('_', '').includes(lowercase))
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

    if (isLoading) return <SpinnerOverlay visible={isLoading} />;

    if (error) {
        return <div>{error}</div>;
    }

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
                <CopyOnClick text={item.emoji}>
                    <Button color='grey'>
                        {item.emoji}
                    </Button>
                </CopyOnClick>
            ))}
        </div>
    );
}

export default EmojiList;