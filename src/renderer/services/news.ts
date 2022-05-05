import request from '@/utils/request';

// 获取股市直播
export async function GetLiveList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_zhiboall_ajaxResult_70_1_.html`, {
      responseType: 'text',
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
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_101_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_103_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_102_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取商品
export async function GetGoodsList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_106_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取外汇
export async function GetExchangeList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_107_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取债券
export async function GetBondList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_108_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取基金
export async function GetFundList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_109_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取中国央行
export async function GetChinaList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_118_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取美联储
export async function GetUsaList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_119_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取欧洲央行
export async function GetEuList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_120_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取英国央行
export async function GetUkList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_121_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
// 获取日本央行
export async function GetJpList() {
  try {
    const { body: script } = await request(`https://newsapi.eastmoney.com/kuaixun/v1/getlist_122_ajaxResult_50_1_.html`, {
      responseType: 'text',
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
