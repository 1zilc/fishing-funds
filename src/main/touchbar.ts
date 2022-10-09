import { TouchBar } from 'electron';
import { Menubar } from 'menubar';
import { generateIconFromDataURL, generateIconFromPath } from './icon';
import { sendMessageToRenderer } from './util';
import * as Enums from '../renderer/utils/enums';

const { TouchBarButton, TouchBarSegmentedControl } = TouchBar;

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

  walletItems: Item[] = [];

  zindexItems: Electron.TouchBarButton[] = [];

  tabItems: Electron.TouchBarSegmentedControl[] = [];

  eyeStatusItems: Electron.TouchBarButton[] = [];

  constructor(items: Item[], mb: Menubar) {
    this.items = items;
    this.mb = mb;
  }

  updateZindexItems(configs: Electron.TouchBarButtonConstructorOptions[]) {
    this.zindexItems = configs.map((config) => new TouchBarButton(config));
    this.updateTouchBar();
  }

  updateWalletItems(configs: (Electron.TouchBarButtonConstructorOptions & { dataURL: string; id: string })[]) {
    this.walletItems = configs.map(
      (config) =>
        new TouchBarButton({
          label: config.label,
          icon: generateIconFromDataURL(config.dataURL),
          iconPosition: 'left',
          click: () => sendMessageToRenderer(this.mb.window, 'change-current-wallet-code', config.id),
          backgroundColor: config.backgroundColor,
        })
    );
    this.updateTouchBar();
  }

  updateTabItems(configs: (Electron.TouchBarButtonConstructorOptions & { key: Enums.TabKeyType; selected: boolean })[]) {
    const selectedIndex = configs.findIndex(({ selected }) => selected);
    this.tabItems = [
      new TouchBarSegmentedControl({
        segmentStyle: 'automatic',
        segments: configs.map((config) => ({ label: config.label })),
        change: (selectedIndex) => {
          sendMessageToRenderer(this.mb.window, 'change-tab-active-key', selectedIndex);
        },
        selectedIndex,
      }),
    ];
    this.updateTouchBar();
  }

  updateEysStatusItems(status: Enums.EyeStatus) {
    this.eyeStatusItems = [
      new TouchBarButton({
        icon:
          status === Enums.EyeStatus.Open
            ? generateIconFromDataURL('touchbar/eye-open.png')
            : generateIconFromPath('touchbar/eye-close.png'),
        click: () => sendMessageToRenderer(this.mb.window, 'change-eye-status'),
      }),
    ];
    this.updateTouchBar();
  }

  updateTouchBar() {
    const touchbar = new TouchBar({
      items: ([] as Item[]).concat(this.zindexItems, this.walletItems, this.tabItems, this.eyeStatusItems),
    });
    this.mb.window?.setTouchBar(touchbar);
  }
}
