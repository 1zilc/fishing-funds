const { got } = window.contextModules;

// 获取股市直播
export async function GetLiveList() {
  try {
    const { body: script } = await got(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_zhiboall_ajaxResult_70_1_.html`, {
      searchParams: {
        _: Date.now(),
      },
    });

    const list: News.ResponseItem[] = eval(`(()=>{
      ${script}
      return ajaxResult.LivesList;
    })()`);
    return list;
  } catch (error) {
    return [];
  }
}

// 获取焦点新闻
export async function GetFocusList() {
  try {
    const { body: script } = await got(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_101_ajaxResult_50_1_.html`, {
      searchParams: {
        _: Date.now(),
      },
    });

    const list: News.ResponseItem[] = eval(`(()=>{
      ${script}
      return ajaxResult.LivesList;
    })()`);
    return list;
  } catch (error) {
    return [];
  }
}
// 获取上市公司新闻
export async function GetListedList() {
  try {
    const { body: script } = await got(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_103_ajaxResult_50_1_.html`, {
      searchParams: {
        _: Date.now(),
      },
    });

    const list: News.ResponseItem[] = eval(`(()=>{
      ${script}
      return ajaxResult.LivesList;
    })()`);
    return list;
  } catch (error) {
    return [];
  }
}
// 获取全球新闻
export async function GetGlobalList() {
  try {
    const { body: script } = await got(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_102_ajaxResult_50_1_.html`, {
      searchParams: {
        _: Date.now(),
      },
    });

    const list: News.ResponseItem[] = eval(`(()=>{
      ${script}
      return ajaxResult.LivesList;
    })()`);
    return list;
  } catch (error) {
    return [];
  }
}
