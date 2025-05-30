import React, { useEffect, useState } from "react";
import Button from "@/components/elements/Button";
import { Tab } from "@headlessui/react";

import Items from "./MCIDLists/Items";
import Entities from "./MCIDLists/Entities";
import Particles from "./MCIDLists/Particles";
import Enchantments from "./MCIDLists/Enchantments";
import Effects from "./MCIDLists/Effects";
import Sounds from "./MCIDLists/Sounds";

const MinecraftIDs = () => {

  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <>

      <Tab.Group>
        <Tab.List className="flex flex-wrap gap-1 mt-2 mb-3" style={{ fontFamily: 'Monocraft' }}>
          <Tab color={activeTab === 0 ? 'primary' : 'grey'} onClick={() => setActiveTab(0)} className="group" as={Button} size={"xsmall"}>Items</Tab>
          <Tab color={activeTab === 1 ? 'primary' : 'grey'} onClick={() => setActiveTab(1)} className="group" as={Button} size={"xsmall"}>Entities</Tab>
          <Tab color={activeTab === 2 ? 'primary' : 'grey'} onClick={() => setActiveTab(2)} className="group" as={Button} size={"xsmall"}>Particles</Tab>
          <Tab color={activeTab === 3 ? 'primary' : 'grey'} onClick={() => setActiveTab(3)} className="group" as={Button} size={"xsmall"}>Enchants</Tab>
          <Tab color={activeTab === 4 ? 'primary' : 'grey'} onClick={() => setActiveTab(4)} className="group" as={Button} size={"xsmall"}>Effects</Tab>
          <Tab color={activeTab === 5 ? 'primary' : 'grey'} onClick={() => setActiveTab(5)} className="group" as={Button} size={"xsmall"}>Sounds</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Items />
          </Tab.Panel>
          <Tab.Panel>
            <Entities />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel>
            <Particles />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel>
            <Enchantments />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel>
            <Effects />
          </Tab.Panel>
        </Tab.Panels>
        <Tab.Panels>
          <Tab.Panel>
            <Sounds />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
    </>
  );

};

export default MinecraftIDs;