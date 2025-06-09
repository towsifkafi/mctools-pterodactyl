import React, { useEffect, useState } from "react";
import Button from "@/components/elements/Button";
import { Tab } from "@headlessui/react";

import MinecraftTextFormatter from "./ColoredText/ColorFormat";
import GradientText from "./ColoredText/GradientText";
import MiniMessageEditor from "./ColoredText/MiniMessage";
import ColorPicker from "./ColorPicker";

const ColoredText = () => {

  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <>

      <Tab.Group>
        <Tab.List className="flex flex-wrap gap-1 mt-2 mb-5" style={{ fontFamily: 'Monocraft' }}>
          <Tab color={activeTab === 0 ? 'primary' : 'grey'} onClick={() => setActiveTab(0)} className="group" as={Button} size={"xsmall"}>Legacy</Tab>
          <Tab color={activeTab === 1 ? 'primary' : 'grey'} onClick={() => setActiveTab(1)} className="group" as={Button} size={"xsmall"}>MiniMessage</Tab>
          <Tab color={activeTab === 2 ? 'primary' : 'grey'} onClick={() => setActiveTab(2)} className="group" as={Button} size={"xsmall"}>Gradient</Tab>
          <Tab color={activeTab === 3 ? 'primary' : 'grey'} onClick={() => setActiveTab(3)} className="group" as={Button} size={"xsmall"}>Color Picker</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <MinecraftTextFormatter />
          </Tab.Panel>
          <Tab.Panel>
            <MiniMessageEditor />
          </Tab.Panel>
          <Tab.Panel>
            <GradientText />
          </Tab.Panel>
          <Tab.Panel>
            <ColorPicker />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
    </>
  );

};

export default ColoredText;