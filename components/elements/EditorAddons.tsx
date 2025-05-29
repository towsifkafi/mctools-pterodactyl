import React, { useState } from 'react';

import { Dialog } from '@/components/elements/dialog';
import Button from '@/components/elements/Button';

import EmojiList from './EditorAddons/EmojiList';
import InventoryList from './EditorAddons/InvList';
import SmallText from './EditorAddons/SmallText';
import Items from './EditorAddons/Items';
import ColorPicker from './EditorAddons/ColorPicker';
import ColoredText from './EditorAddons/ColoredText';

import Modal from '@/components/elements/Modal';

const EditorAddons = () => {

  const [openModals, setOpenModals] = useState({
    emoji: false,
    inv: false,
    smallText: false,
    items: false,
    colorPicker: false,
    coloredText: false
  });

  const handleOpen = (modalKey: keyof typeof openModals) => {
    setOpenModals((prev) => ({ ...prev, [modalKey]: true }));
  };

  const handleClose = (modalKey: keyof typeof openModals) => {
    setOpenModals((prev) => ({ ...prev, [modalKey]: false }));
  };

  return (
    <>
      <div className='flex flex-wrap gap-1 mt-2 mb-3' style={{ flexDirection: 'row-reverse', fontFamily: 'Monocraft' }}>
        <Button className='group' color={openModals.inv ? 'primary' : 'grey'} size={"xsmall"}  onClick={() => handleOpen('inv')}>
          <i className="fa-solid fa-box mr-1"></i>
          {/* <span className='ml-1 hidden opacity-0 transition-all duration-200 ease-in-out ml-1 group-hover:inline group-hover:opacity-100'>Inv</span> */}
          Inv
        </Button>
        <Button color={openModals.emoji ? 'primary' : 'grey'} size={"xsmall"} onClick={() => handleOpen('emoji')}>
          <i className="fa-solid fa-file-lines mr-1"></i> Unicode List
        </Button>
        <Button color={openModals.smallText ? 'primary' : 'grey'} size={"xsmall"} onClick={() => handleOpen('smallText')}>
          <i className="fa-solid fa-font mr-1"></i> Small Text
        </Button>
        <Button color={openModals.items ? 'primary' : 'grey'} size={"xsmall"} onClick={() => handleOpen('items')}>
         <i className="fa-solid fa-apple-whole mr-1"></i>Items
        </Button>
        <Button color={openModals.colorPicker ? 'primary' : 'grey'} size={"xsmall"} onClick={() => handleOpen('colorPicker')}>
          <i className="fa-solid fa-palette mr-1"></i>Color Picker
        </Button>
        <Button color={openModals.coloredText ? 'primary' : 'grey'} size={"xsmall"} onClick={() => handleOpen('coloredText')}>
          <i className="fa-solid fa-palette mr-1"></i>Colored Text
        </Button>
      </div>
      
      <Dialog open={openModals.inv} onClose={() => handleClose('inv')}>
        <InventoryList />
      </Dialog>

      <Dialog open={openModals.emoji} onClose={() => handleClose('emoji')}>
        <EmojiList />
      </Dialog>

      <Dialog open={openModals.smallText} onClose={() => handleClose('smallText')}>
        <SmallText />
      </Dialog>

      <Dialog open={openModals.items} onClose={() => handleClose('items')}>
        <Items />
      </Dialog>

      <Dialog open={openModals.colorPicker} onClose={() => handleClose('colorPicker')}>
        <ColorPicker />
      </Dialog>

      {/* <Modal dismissable={true} children={<ColorPicker />} visible={openModals.colorPicker} onDismissed={() => {handleClose('colorPicker')} } /> */}

      <Dialog open={openModals.coloredText} onClose={() => handleClose('coloredText')}>
        <ColoredText />
      </Dialog>

    </>
  );
};

export default EditorAddons;