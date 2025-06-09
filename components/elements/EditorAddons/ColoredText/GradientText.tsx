import React, { useState, useEffect } from 'react';
import Gradient from './Gradient';

import { Dialog } from '@headlessui/react';
import Input from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import CopyOnClick from '@/components/elements/CopyOnClick';
import TextPreview from './TextPreview';

import useLocalStorage from '../../../lib/useLocalStorage';

// @ts-ignore
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const GradientText = () => {
  const [text, setText] = useLocalStorage('gradient_text', 'Your Text Here');
  const [colors, setColors] = useLocalStorage('gradient_colors', ['#32E7D2', '#B1E0E7']);
  const [outputText, setOutputText] = useState('');
  const [outputMinimessage, setOutputMinimessage] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [activeTab, setActiveTab] = useLocalStorage<number>('gradient_tab', 0);

  const calculateResult = () => {
    const midpoint = Math.max(colors.length, text.replace(/\s/g, '').length); // Ensure midpoint is at least the number of colors
    const gradient = new Gradient();
    gradient.setColorGradient(...colors);
    gradient.setMidpoint(midpoint);
    const gradientColors = gradient.getColors();

    let hexIndex = 0;
    let output = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        output += '&' + gradientColors[hexIndex % gradientColors.length];
        hexIndex++;
      }
      output += char;
    }
    setOutputText(output);
    setOutputMinimessage(`<gradient:${colors.join(':')}>${text}</gradient>`);

    const regex = /&#([A-Fa-f0-9]{6})/g;
    setPreviewText(
      output.replace(regex, (match, color) => `<span style="color: #${color}">`)
    );
  };

  useEffect(() => {
    calculateResult();
  }, [text, colors]);

  const addColor = () => {
    setColors([...colors, '#FFFFFF']); // Add white as a default new color
  };

  const permutate = () => {
    const newColors = [...colors];
    shuffleArray(newColors);
    setColors(newColors);
  }

  // @ts-ignore
  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  // @ts-ignore
  const updateColor = (index, value) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const copyValue = () => {
    
  };

  const copyMinimessageValue = () => {
    
  };

  return (
    <main className="w-full mx-auto">
      <div className="grid grid-cols-1 xl:flex flex-col justify-center gap-3 items-start text-center">
        <div className="flex flex-col w-full">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="serverJarName"
            className='w-full'
            placeholder="Enter text here"
            // className="py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
          />
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="rounded-full bg-transparent border-none self-center w-10 h-10"
                  />
                  {colors.length > 2 && (
                    <button
                      onClick={() => removeColor(index)}
                      className="rounded text-sm px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 absolute top-1 right-1"
                    ></button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button color='grey' size='xsmall'  onClick={addColor}>
                Add Color
            </Button>
            <Button color='grey' size='xsmall' onClick={permutate}>
                Permutation
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full pt-5">
        {/* <p
          className="font-minecraft break-all text-2xl text-center mt-5"
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: previewText }}
        /> */}
        <TextPreview activeTab={activeTab} setActiveTab={setActiveTab} previewText={previewText} />
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-white text-[12px] mt-8 mb-3 ml-1">CHAT COLORS</span>
        <div className="flex gap-3">
          <Input
            value={outputText}
            disabled
            className="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-full max-w-full"
          />
          <CopyOnClick text={outputText} children={
            <Button color='grey' size='xsmall'>
              Copy
            </Button>
          } />
        </div>
      </div>

      <div className="flex flex-col">
      <span className="font-bold text-white text-[12px] mt-4 mb-3 ml-1">MINIMESSAGE</span>
        <div className="flex gap-3">
          <Input
            value={outputMinimessage}
            disabled
            className="inline-block text-sm text-gray-400 font-mono rounded-md p-2 bg-[#141517] h-[35px] w-full max-w-full"
          />
          <CopyOnClick text={outputMinimessage} children={
            <Button color='grey' size='xsmall'>
              Copy
            </Button>
          } />

        </div>
      </div>

    </main>
  );
};

export default GradientText;