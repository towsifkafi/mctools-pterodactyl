import React, { useState, useEffect } from 'react';
import Editor from './MiniMEditor';
import OutputPane from './OutputPane';

import useLocalStorage from '../../../lib/useLocalStorage';

const MiniMessageEditor: React.FC = () => {
  const [inputText, setInputText] = useLocalStorage<string>('minimessage_text', 'Your text here');

  useEffect(() => {
    setInputText(inputText);
  }, [inputText]);

  return (
    <div className="flex flex-col p-1">
      <Editor inputText={inputText} setInputText={setInputText} />
      <OutputPane inputText={inputText} />
    </div>
  );
};

export default MiniMessageEditor;