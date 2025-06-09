import React from 'react';
import { Tab } from '@headlessui/react';
import Button from '@/components/elements/Button';

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

interface TextPreviewProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  previewText: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ activeTab, setActiveTab, previewText }) => {
  return (
    <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
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
            <div className="relative w-[550px]">
              <img src="https://mcutils.com/display/motd.svg" alt="MOTD" className="w-full" />
              <div className="absolute top-[13px] left-[105px] right-0 bottom-0 flex flex-col">
                <p
                  className="font-minecraft font-bold text-[15px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: "Minecraft Server" }}
                />
                <p
                  className="font-minecraft bold text-[15px] leading-[1.3] text-start max-h-[calc(100%-20px)] overflow-hidden whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: previewText }}
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
      <Tab.List className="flex gap-1 mt-2 justify-center items-center">
        {tabData.map((tab, index) => (
          <Tab
            key={index}>
            <Button size="xsmall" color={activeTab === index ? 'primary' : 'grey'}>
                {tab.name}
            </Button>
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
};

export default TextPreview;