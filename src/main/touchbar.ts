import { TouchBar } from 'electron';
import { Menubar } from 'menubar';
import { generateWalletIcon } from './icon';
import { sendMessageToRenderer } from './util';
import * as Enums from '../renderer/utils/enums';

const { TouchBarButton, TouchBarGroup } = TouchBar;

type Item =
  | Electron.TouchBarButton
  | Electron.TouchBarColorPicker
  | Electron.TouchBarGroup
  | Electron.TouchBarLabel
  | Electron.TouchBarPopover
  | Electron.TouchBarScrubber
  | Electron.TouchBarSegmentedControl
  | Electron.TouchBarSlider
  | Electron.TouchBarSpacer;

export default class TouchBarManager {
  items: Item[];

  mb: Menubar;

  itemType: Enums.TabKeyType = Enums.TabKeyType.Funds;

  walletItems: Item[] = [];

  zindexItems: Electron.TouchBarButton[] = [];

  constructor(items: Item[], mb: Menubar) {
    this.items = items;
    this.mb = mb;
  }

  updateZindexItems(configs: Electron.TouchBarButtonConstructorOptions[]) {
    this.zindexItems = configs.map((config) => new TouchBarButton(config));
    if (this.itemType === Enums.TabKeyType.Zindex) {
      this.updateTouchBar();
    }
  }

  updateWalletItems(configs: (Electron.TouchBarButtonConstructorOptions & { iconIndex: number; id: string })[]) {
    this.walletItems = configs.map(
      (config) =>
        new TouchBarButton({
          label: config.label,
          icon: generateWalletIcon(config.iconIndex),
          iconPosition: 'left',
          click: () => sendMessageToRenderer(this.mb, 'change-current-wallet-code', config.id),
          backgroundColor: config.backgroundColor,
        })
    );
    if (
      this.itemType === Enums.TabKeyType.Funds ||
      this.itemType === Enums.TabKeyType.Stock ||
      this.itemType === Enums.TabKeyType.Quotation ||
      this.itemType === Enums.TabKeyType.Coin
    ) {
      this.updateTouchBar();
    }
  }

  constructItems() {
    switch (this.itemType) {
      case Enums.TabKeyType.Zindex:
        return this.zindexItems;
      default:
        return this.walletItems;
    }
  }

  updateItems(type: Enums.TabKeyType) {
    this.itemType = type;
    this.updateTouchBar();
  }

  updateTouchBar() {
    const items = this.constructItems();
    const touchbar = new TouchBar({ items });
    this.mb.window?.setTouchBar(touchbar);
  }
}
