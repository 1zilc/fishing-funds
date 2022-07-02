import { createSlice } from '@reduxjs/toolkit';

export interface UpdaderState {
  updateInfo: {
    files: [];
    path: string; // 'Fishing-Funds-2.1.2-mac.zip';
    releaseDate: string; // '2021-02-09T10:56:06.524Z';
    releaseName: string; // '2.1.2';
    releaseNotes: string; // '<ol>↵<li>添加一键展开/折叠快捷功能</li>↵<li>修复已知BUG</li>↵<li>暂时移除自动更新功能（macOS下暂未签名）</li>↵</ol>';
    sha512: string; // 'wfUByGGFLzvDKrKPQqhz/rbqPceUjJN+EPgpXikNXTiGUHkUudLdlkCer87vyn11+NsSUSdF7uULV9mPqJSMDw==';
    version: string; // '2.1.2';
  };
}

const initialState: UpdaderState = {
  updateInfo: {
    files: [],
    path: '',
    releaseDate: '',
    releaseName: '',
    releaseNotes: '',
    sha512: '',
    version: '',
  },
};

const uptaderSlice = createSlice({
  name: 'uptader',
  initialState,
  reducers: {
    updateAvaliableAction(state, action) {
      state.updateInfo = action.payload;
    },
  },
});

export const { updateAvaliableAction } = uptaderSlice.actions;

export default uptaderSlice.reducer;
