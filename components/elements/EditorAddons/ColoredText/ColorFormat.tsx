import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import CopyOnClick from "@/components/elements/CopyOnClick";
import EmojiList from '../EmojiList';
import { Dialog } from '@/components/elements/dialog';
import TextPreview from './TextPreview';

import useLocalStorage from '../../../lib/useLocalStorage';

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
  const [activeTab, setActiveTab] = useLocalStorage<number>("formatter_tab", 0);
  const [text, setText] = useLocalStorage<string>("formatter_text", 'Your Text Here');
  const [previewText, setPreviewText] = useState<string>('');
  const [color, setColor] = useLocalStorage<string>('formatter_color_picker', '#FFFFFF');
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
              style={{ height: '45px' }}
              ref={textInputRef}
            />
            <CopyOnClick text={text} children={
              <Button>
                Copy
              </Button>
            }/>
          </div>
        </div>
        <div className="w-full mt-2">
          <TextPreview activeTab={activeTab} setActiveTab={setActiveTab} previewText={previewText} />
        </div>
      </div>
    </div>
  );
};

export default MinecraftTextFormatter;