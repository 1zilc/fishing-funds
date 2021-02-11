import { AnyAction } from 'redux';

import { UPDATE_AVALIABLE } from '../actions/updater';

export interface UpdaderState {
  updateInfo: {
    files: [];
    path: string; //'Fishing-Funds-2.1.2-mac.zip';
    releaseDate: string; //'2021-02-09T10:56:06.524Z';
    releaseName: string; //'2.1.2';
    releaseNotes: string; //'<ol>↵<li>添加一键展开/折叠快捷功能</li>↵<li>修复已知BUG</li>↵<li>暂时移除自动更新功能（macOS下暂未签名）</li>↵</ol>';
    sha512: string; //'wfUByGGFLzvDKrKPQqhz/rbqPceUjJN+EPgpXikNXTiGUHkUudLdlkCer87vyn11+NsSUSdF7uULV9mPqJSMDw==';
    version: string; //'2.1.2';
  };
}

export default function uptader(
  state = {
    updateInfo: {},
  },
  action: AnyAction
) {
  switch (action.type) {
    case UPDATE_AVALIABLE:
      return {
        ...state,
        updateInfo: action.payload,
      };
    default:
      return state;
  }
}
