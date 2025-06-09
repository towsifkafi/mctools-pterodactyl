import React, { useEffect, useRef } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Button from '@/components/elements/Button';
import Input, { Textarea } from '@/components/elements/Input';

interface ColorPaletteProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ inputText, setInputText, textareaRef }) => {
  const colors = [
    { color: '#000000', title: 'Black' }, { color: '#555555', title: 'Dark Gray' },
    { color: '#0000aa', title: 'Dark Blue' }, { color: '#5555ff', title: 'Blue' },
    { color: '#00aa00', title: 'Dark Green' }, { color: '#55ff55', title: 'Green' },
    { color: '#00aaaa', title: 'Dark Aqua' }, { color: '#55ffff', title: 'Aqua' },
    { color: '#aa0000', title: 'Dark Red' }, { color: '#ff5555', title: 'Red' },
    { color: '#aa00aa', title: 'Dark Purple' }, { color: '#ff55ff', title: 'Light Purple' },
    { color: '#ffaa00', title: 'Gold' }, { color: '#ffff55', title: 'Yellow' },
    { color: '#aaaaaa', title: 'Gray' }, { color: '#ffffff', title: 'White' },
  ];

  const applyTagAtCursor = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.slice(start, end);
    const tagName = tag.toLowerCase().replace(' ', '_');
    
    let newText: string;
    if (selectedText) {
      newText = `${inputText.slice(0, start)}<${tagName}>${selectedText}</${tagName}>${inputText.slice(end)}`;
    } else {
      newText = `${inputText.slice(0, start)}<${tagName}>${inputText.slice(end)}</${tagName}>`;
    }
    
    setInputText(newText);
    textarea.focus();
    textarea.setSelectionRange(start + tagName.length + 2, start + tagName.length + 2);
  };

  const applyHexColor = (hexValue: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !/^#[0-9A-Fa-f]{6}$/.test(hexValue)) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.slice(start, end);
    
    let newText: string;
    if (selectedText) {
      newText = `${inputText.slice(0, start)}<color:${hexValue}>${selectedText}</color>${inputText.slice(end)}`;
    } else {
      newText = `${inputText.slice(0, start)}<color:${hexValue}>${inputText.slice(end)}</color>`;
    }
    
    setInputText(newText);
    textarea.focus();
    textarea.setSelectionRange(start + hexValue.length + 8, start + hexValue.length + 8); // Account for <color:#xxxxxx>
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center p-2 rounded">
        <i className="fas fa-palette"></i>
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 w-64 shadow-lg rounded-md p-4">
          <div className="grid grid-cols-8 gap-1">
            {colors.map(({ color, title }) => (
              <Menu.Item key={color}>
                <div
                    className={`w-6 h-6 rounded-full`}
                    style={{ backgroundColor: color }}
                    title={title}
                    onClick={() => applyTagAtCursor(title)}
                />
                {/* {({ active }) => (
                  <div
                    className={`swatch ${active ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color }}
                    title={title}
                    onClick={() => applyTagAtCursor(title)}
                  />
                )} */}
              </Menu.Item>
            ))}
          </div>
          <hr className="my-2" />
          <div className="flex items-center space-x-2 font-minecraft">
            <input
              id="color-picker"
              className="rounded-full bg-transparent border-none self-center w-8 h-8"
              type="color"
              defaultValue="#ffffff"
            />
            <Button
              size='xsmall'
              color='grey'
              onClick={() => {
                const colorInput = document.getElementById('color-picker') as HTMLInputElement;
                if (colorInput) applyHexColor(colorInput.value);
              }}
            >
              Apply Color
            </Button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface EditorProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
}

const Editor: React.FC<EditorProps> = ({ inputText, setInputText }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyTagAtCursor = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.slice(start, end);
    
    let newText: string;
    if (selectedText) {
      newText = `${inputText.slice(0, start)}<${tag}>${selectedText}</${tag}>${inputText.slice(end)}`;
    } else {
      newText = `${inputText.slice(0, start)}<${tag}>${inputText.slice(end)}</${tag}>`;
    }
    
    setInputText(newText);
    textarea.focus();
    textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2);
  };

  const applyActionTag = (tag: string, value: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.slice(start, end);
    
    const newText = `${inputText.slice(0, start)}<${tag}:${value}>${selectedText}</${tag}>${inputText.slice(end)}`;
    setInputText(newText);
    textarea.focus();
    textarea.setSelectionRange(start + tag.length + value.length + 3, start + tag.length + value.length + 3);
  };

  return (
    <div className="p-2">
      <div className="flex items-center mb-2">
        <label htmlFor="input" className="mr-2"></label>
        <div className="flex-1"></div>
        <ColorPalette inputText={inputText} setInputText={setInputText} textareaRef={textareaRef} />
        <div className="flex space-x-1 ml-2">
          <Button
            size="xsmall"
            color="grey"
            title="Add bold text"
            onClick={() => applyTagAtCursor('b')}
          >
            <i className="fas fa-bold"></i>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add italic text"
            onClick={() => applyTagAtCursor('i')}
          >
            <i className="fas fa-italic"></i>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add underlined text"
            onClick={() => applyTagAtCursor('u')}
          >
            <i className="fas fa-underline"></i>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add strikethrough text"
            onClick={() => applyTagAtCursor('st')}
          >
            <i className="fas fa-strikethrough"></i>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add clickable URL"
            onClick={() => applyActionTag('click', 'open_url:"https://example.com"')}
          >
            <i className="fas fa-link"></i>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add clickable command"
            onClick={() => applyActionTag('click', 'run_command:"/say Hello"')}
          >
            <svg className="w-4 h-4" viewBox="0 0 448 512">
              <path fill="currentColor" d="M339.313 2.75926L386.7 2.91021C404.492 2.91021 413.209 14.9141 404.991 30.6898L133.238 492.841L130.988 496.844C127.683 503.157 121.522 508.383 114.492 508.383L67.7287 508.443L61.7829 508.443C43.9915 508.443 35.2739 496.439 43.4916 480.663L45.4373 476.663L322.817 14.2984C326.122 7.98572 332.283 2.75926 339.313 2.75926Z"/>
            </svg>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add clickable command suggestion"
            onClick={() => applyActionTag('click', 'suggest_command:"/say Hello"')}
          >
            <svg className="w-4 h-4" viewBox="0 0 448 512">
              <path fill="currentColor" d="M382.313 2.75926L429.7 2.91021C447.492 2.91021 456.209 14.9141 447.991 30.6898L176.238 492.841L173.988 496.844C170.683 503.157 164.522 508.383 157.492 508.383L110.729 508.443L104.783 508.443C86.9915 508.443 78.2739 496.439 86.4916 480.663L88.4373 476.663L365.817 14.2984C369.122 7.98572 375.283 2.75926 382.313 2.75926Z"/>
              <path fill="currentColor" d="M117.524 0C65.5586 0 31.9004 21.3336 5.47526 59.3802C0.681636 66.282 2.1595 75.7449 8.84635 80.8254L36.931 102.163C43.6842 107.294 53.293 106.094 58.5801 99.457C74.888 78.9858 86.985 67.1992 112.458 67.1992C132.487 67.1992 157.26 80.115 157.26 99.5757C157.26 114.287 145.14 121.843 125.364 132.952C102.302 145.908 71.7839 162.031 71.7839 202.365V208.75C71.7839 217.397 78.7793 224.406 87.4089 224.406H134.59C143.22 224.406 150.215 217.397 150.215 208.75V204.984C150.215 177.025 231.77 175.86 231.77 100.2C231.771 43.2217 172.785 0 117.524 0ZM111 243.624C86.1328 243.624 65.9017 263.895 65.9017 288.812C65.9017 313.728 86.1328 334 111 334C135.867 334 156.098 313.728 156.098 288.811C156.098 263.895 135.867 243.624 111 243.624Z"/>
            </svg>
          </Button>
          <Button
            size="xsmall"
            color="grey"
            title="Add hoverable text"
            onClick={() => applyActionTag('hover', 'show_text:"Hover text"')}
          >
            <svg className="w-4 h-4" viewBox="0 0 512 512">
              <path fill="currentColor" d="M462.5 0C489.838 0 512 16.0056 512 35.75V250.25C512 269.994 489.838 286 462.5 286H165.5C138.162 286 116 269.994 116 250.25V35.75C116 16.0056 138.162 0 165.5 0H462.5Z"/>
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M97.5989 285.387L38.7062 449H15.7143C11.5466 449 7.54961 450.659 4.60261 453.613C1.65561 456.567 0 460.573 0 464.75V496.25C0 500.427 1.65561 504.433 4.60261 507.387C7.54961 510.341 11.5466 512 15.7143 512H141.429C145.596 512 149.593 510.341 152.54 507.387C155.487 504.433 157.143 500.427 157.143 496.25V464.75C157.143 460.573 155.487 456.567 152.54 453.613C149.593 450.659 145.596 449 141.429 449H122.198L145.082 386H294.918L317.802 449H298.571C294.404 449 290.407 450.659 287.46 453.613C284.513 456.567 282.857 460.573 282.857 464.75V496.25C282.857 500.427 284.513 504.433 287.46 507.387C290.407 510.341 294.404 512 298.571 512H424.286C428.453 512 432.45 510.341 435.397 507.387C438.344 504.433 440 500.427 440 496.25V464.75C440 460.573 438.344 456.567 435.397 453.613C432.45 450.659 428.453 449 424.286 449H401.294L350.181 307H266.217L266.308 307.25H173.692L173.783 307H146.625C125.418 307 106.983 298.253 97.5989 285.387Z"/>
            </svg>
          </Button>
        </div>
      </div>
      <Textarea
        id="input"
        className="w-full p-2 border rounded mono-font"
        rows={4}
        placeholder="<blue>Hello <red>World!"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        ref={textareaRef}
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;