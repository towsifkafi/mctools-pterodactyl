import React, { useState, useEffect, useRef } from 'react';
import { Tab } from '@headlessui/react';

import { Textarea } from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import CopyOnClick from "@/components/elements/CopyOnClick";
import EmojiList from './EmojiList';
import { Dialog } from '@/components/elements/dialog';

interface TabData {
  name: string;
  content: string;
}

const tabData: TabData[] = [
  { name: 'Text', content: '' },
  { name: 'Sign', content: '' },
  { name: 'Book', content: '' },
  { name: 'Chat', content: '' },
  { name: 'MOTD', content: '' },
  { name: 'Name', content: '' },
  { name: 'Lore', content: '' },
  { name: 'Kick', content: '' },
];

const colorMap: { [key: string]: string } = {
  '0': '000000', // Black
  '1': '0000AA', // Dark Blue
  '2': '00AA00', // Dark Green
  '3': '00AAAA', // Dark Aqua
  '4': 'AA0000', // Dark Red
  '5': 'AA00AA', // Dark Purple
  '6': 'FFAA00', // Gold
  '7': 'AAAAAA', // Gray
  '8': '555555', // Dark Gray
  '9': '5555FF', // Blue
  'a': '55FF55', // Green
  'b': '55FFFF', // Aqua
  'c': 'FF5555', // Red
  'd': 'FF55FF', // Light Purple
  'e': 'FFFF55', // Yellow
  'f': 'FFFFFF', // White
};

const decorationMap: { [key: string]: string } = {
  'k': 'font-weight: bold;',
  'l': 'font-weight: bold;',
  'm': 'text-decoration: line-through;',
  'n': 'text-decoration: underline;',
  'o': 'font-style: italic;',
};

const MinecraftTextFormatter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');
  const [color, setColor] = useState<string>('#FFFFFF');
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [showEmojiList, setShowEmojiList] = useState(false);

  const handleEmojiOpen = () => {
    setShowEmojiList(true);
  };

  const handleEmojiClose = () => {
    setShowEmojiList(false);
  };

  const insertTextAtCursor = (value: string) => {
    const inputBox = textInputRef.current;
    if (!inputBox) return;

    const startPos = inputBox.selectionStart || 0;
    const endPos = inputBox.selectionEnd || 0;
    const currentValue = inputBox.value;

    const newText = currentValue.substring(0, startPos) + value + currentValue.substring(endPos);
    setText(newText);

    const updatedCursorPosition = startPos + value.length;
    requestAnimationFrame(() => {
      inputBox.focus();
      inputBox.setSelectionRange(updatedCursorPosition, updatedCursorPosition);
    });
  };


  const autoSizeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    // @ts-ignore
    if (!target.value.includes('\n')) {
      target.style.height = '';
    } else {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    }
  };

  const applyMinecraftFormatting = (inputText: string): string => {
    let htmlText = '';

    const isValidColorChar = (char: string): boolean =>
      (char >= '0' && char <= '9') || (char >= 'a' && char <= 'f') || (char >= 'A' && char <= 'F');

    const isValidDecorationChar = (char: string): boolean =>
      (char >= 'k' && char <= 'o') || (char >= 'K' && char <= 'O');

    const isGradient = (text: string): boolean => {
      const regex = /&#([A-Fa-f0-9]{6})/g;
      return regex.test(text);
    };

    const getGradientColor = (text: string): string => {
      const regex = /&#([A-Fa-f0-9]{6})/g;
      let gradientColor = '';
      text.replace(regex, (_match, color) => {
        gradientColor = color;
        return color;
      });
      return gradientColor;
    };

    let coloringMode = false;
    let colorType = '';
    let coloredText = '';
    let decorationMode = false;
    let decorationStyles = '';
    let decorationColorType = '';
    let decorationText = '';

    const releaseTextOfColorMode = () => {
      if (!coloringMode) return;
      htmlText += `<span style="color: #${colorType};">${coloredText}</span>`;
      coloringMode = false;
      coloredText = '';
      colorType = '';
    };

    const releaseTextOfDecorationMode = () => {
      if (!decorationMode) return;
      htmlText += `<span style="color: #${decorationColorType}; ${decorationStyles}">${decorationText}</span>`;
      decorationMode = false;
      decorationText = '';
      decorationStyles = '';
      decorationColorType = '';
    };

    for (let i = 0; i < inputText.length; i++) {
      const c = inputText[i];
      const nextC = inputText.charAt(i + 1);
      const hasFormatSign = c === '&';
      let gradient = false;
      const hexSlice = inputText.slice(i, i + 8);

      if (hasFormatSign && (isValidColorChar(nextC) || (gradient = isGradient(hexSlice)))) {
        if (gradient) {
          i += 7;
        } else {
          i += 1;
        }
        releaseTextOfColorMode();
        releaseTextOfDecorationMode();
        colorType = gradient ? getGradientColor(hexSlice) : colorMap[nextC];
        coloringMode = true;
        continue;
      } else if (hasFormatSign && isValidDecorationChar(nextC)) {
        i += 1;
        if (decorationMode) {
          const inheritDecorations = decorationStyles;
          const inheritDecorationsColor = decorationColorType;
          releaseTextOfDecorationMode();
          decorationStyles += inheritDecorations;
          decorationColorType = inheritDecorationsColor;
        }
        if (coloringMode) {
          decorationColorType = colorType;
          releaseTextOfColorMode();
        }
        decorationStyles += decorationMap[nextC];
        decorationMode = true;
        continue;
      } else if (hasFormatSign && nextC === 'r') {
        i += 1;
        releaseTextOfColorMode();
        releaseTextOfDecorationMode();
        continue;
      }

      if (coloringMode) {
        coloredText += c;
      } else if (decorationMode) {
        decorationText += c;
      } else {
        htmlText += c;
      }
    }

    releaseTextOfColorMode();
    releaseTextOfDecorationMode();

    textInputRef.current?.focus();

    return getResetStyle() + htmlText;
  };

  const getResetStyle = (): string => {
    // @ts-ignore
    if ([0, 3, 5, 6, 7].includes(activeTab)) {
      return `<span style="color: #FFFFFF;">`;
      // @ts-ignore
    } else if ([1, 2].includes(activeTab)) {
      return `<span style="color: #000000;">`;
    } else if (activeTab === 4) {
      return `<span style="color: #AAAAAA;">`;
    }
    return `<span>`;
  };

  useEffect(() => {
    setPreviewText(applyMinecraftFormatting(text));
  }, [text, activeTab]);

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 xl:flex xl:flex-col justify-center items-start gap-3">
          <div className="flex flex-row gap-1">
            <div className="flex gap-1 flex-wrap">
              {['0', '1', '2', '3', '4', '5', '6', '7'].map((code) => (
                <button
                  key={code}
                  className={`w-8 h-8 text-sm rounded-md text-white hover:bg-[#${colorMap[code]}90]`}
                  style={{ backgroundColor: `#${colorMap[code]}` }}
                  onClick={() => insertTextAtCursor(`&${code}`)}
                >
                  &{code}
                </button>
              ))}
              {['8', '9', 'a', 'b', 'c', 'd', 'e', 'f'].map((code) => (
                <button
                  key={code}
                  className={`w-8 h-8 text-sm rounded-md hover:bg-[#${colorMap[code]}90] ${
                    // @ts-ignore
                    ['a', 'b', 'c', 'd', 'e', 'f'].includes(code) ? 'text-black' : 'text-white'
                  }`}
                  style={{ backgroundColor: `#${colorMap[code]}` }}
                  onClick={() => insertTextAtCursor(`&${code}`)}
                >
                  &{code}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            
          </div>
          <div className="flex flex-wrap flex-row gap-1">
            <div className="flex flex-row flex-wrap gap-1">
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&l')}
              >
                Bold
              </Button>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&n')}
              >
                Underline
              </Button>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&o')}
              >
                Italic
              </Button>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&m')}
              >
                Strikethrough
              </Button>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&k')}
              >
                Magic
              </Button>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor('&r')}
              >
                Reset
              </Button>
              <Button color='grey' size='xsmall' onClick={() => {
                handleEmojiOpen();
              }} >
                Emoji
              </Button>
              <Dialog open={showEmojiList} onClose={handleEmojiClose}>
                <EmojiList />
              </Dialog>
              <Button color='grey' size='xsmall'
                onClick={() => insertTextAtCursor(`&${color}`)}
              >
                Hex
              </Button>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-full bg-transparent border-none h-8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <div className="flex gap-3 w-full mb-3">
          
          <div className="w-full flex flex-row items-center justify-center gap-2">
          <Textarea
            className='w-full max-w-full overflow-y-hidden resize-none'
            id="textinput"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autoSizeTextArea(e);
            }}
            // className="text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] mt-8 w-full max-w-full overflow-y-hidden resize-none"
            style={{ height: '35px' }}
            ref={textInputRef}
          />

          <CopyOnClick text={text} children={
            <Button
            >
            Copy
            </Button>
          }/>
          </div>

          
        </div>
          <Tab.Panels>
            <div className="mt-1 mb-8 flex justify-center">
              {activeTab === 0 ? (
                <p
                  className="font-minecraft break-all text-2xl text-center"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: previewText }}
                />
              ) : activeTab === 1 ? (
                <div className="relative w-[500px] mx-auto">
                  <img src="https://mcutils.com/display/sign.png" alt="Sign" className="w-full" />
                  <div className="absolute top-[10px] left-[10px] right-[10px] bottom-[10px] flex items-center justify-center">
                    <p
                      className="font-minecraft text-[40px] leading-[1.3] text-center max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 2 ? (
                <div className="relative w-[250px] mx-auto">
                  <img src="https://mcutils.com/display/book.svg" alt="Book" className="w-full" />
                  <div className="absolute top-[10px] left-[30px] right-[30px] bottom-[10px] flex items-center justify-center">
                    <p
                      className="font-minecraft text-[15px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 3 ? (
                <div className="relative w-[550px] mx-auto">
                  <img src="https://mcutils.com/display/chat.svg" alt="Chat" className="w-full" />
                  <div className="absolute top-[10px] left-[10px] right-[30px] bottom-[10px] flex flex-col-reverse w-[480px] bg-black/[.6]">
                    <p
                      className="font-minecraft text-[13px] m-1.5 leading-[1.3] text-start overflow-hidden whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 4 ? (
                <div className="relative w-[650px] mx-auto">
                  <img src="https://mcutils.com/display/motd.svg" alt="MOTD" className="w-full" />
                  <div className="absolute top-[-50px] left-[-132px] right-[30px] bottom-[10px] flex items-center justify-center">
                    <p className="font-minecraft text-[22px] leading-[1.3] text-start whitespace-pre-wrap break-words text-white">
                      Minecraft Server
                    </p>
                  </div>
                  <div className="mt-1 absolute top-[5px] left-[125px] right-[30px] bottom-[10px] flex">
                    <p
                      className="font-minecraft text-[22px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words mt-3"
                      dangerouslySetInnerHTML={{ __html: "\n"+previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 5 ? (
                <div className="relative w-[500px] mx-auto">
                  <img src="https://mcutils.com/display/name.svg" alt="Name" className="w-full" />
                  <div className="absolute top-[16px] left-[24px] right-0 bottom-0 flex">
                    <p
                      className="font-minecraft text-[30px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 6 ? (
                <div className="relative w-[500px] mx-auto">
                  <img src="https://mcutils.com/display/lore.svg" alt="Lore" className="w-full" />
                  <div className="absolute top-[60px] left-[24px] right-[24px] bottom-[25px] flex">
                    <p
                      className="font-minecraft text-[30px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : activeTab === 7 ? (
                <div className="relative w-[550px] mx-auto">
                  <img src="https://mcutils.com/display/kick.svg" alt="Kick" className="w-full" />
                  <div className="absolute top-[55px] left-[30px] right-[30px] bottom-[10px] flex items-center justify-center">
                    <p
                      className="font-minecraft text-[17px] leading-[1.3] text-center max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words h-full"
                      dangerouslySetInnerHTML={{ __html: previewText }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </Tab.Panels>
          <Tab.List className="self-center grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2 -mt-2">
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `px-4 py-2 rounded focus:outline-none ${
                    selected ? 'bg-gray-200 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};

export default MinecraftTextFormatter;