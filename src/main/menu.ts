import { Menu } from 'electron';

export function createAppMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: '编辑',
      submenu: [
        {
          role: 'undo',
        },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
  ]);
  return menu;
}
