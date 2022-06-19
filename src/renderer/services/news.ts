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
// 获取最新资讯
export async function GetRecent(keyword: string, pageindex: number) {
  try {
    const { body } = await request<{
      IsSuccess: true;
      Code: 0;
      Message: '成功';
      TotalPage: 505;
      TotalCount: 5041;
      Keyword: '1.600519';
      Data: {
        Art_UniqueUrl: 'http://finance.eastmoney.com/a/202205252390829633.html';
        Art_Title: '茅台拍出天价 闹剧一场';
        Art_Url: 'http://finance.eastmoney.com/news/1354,202205252390829633.html';
        Art_CreateTime: '2022-05-25 09:11:35';
        Art_Content: '　　●近期，一瓶号称产自1992年的汉帝茅台在线上拍卖，赚足了人们的眼球。它起拍价定为3999万元，第一次拍卖临近结束被喊停，有人恶意出价99亿元，主办方被迫结束拍卖。第二次拍卖于20日结束，围观者多达12.4万人次，但仅有6人报名，到拍卖结束也无人报价。(北青网5月21日报道)...';
      }[];
      RelatedWord: '';
      StillSearch: ['贵州茅台', '贵州茅台'];
      StockModel: {
        Name: '贵州茅台';
        Code: '600519';
      };
    }>(`https://searchapi.eastmoney.com/bussiness/Web/GetCMSSearchList`, {
      responseType: 'json',
      headers: {
        Referer: 'https://so.eastmoney.com/',
      },
      searchParams: {
        _: Date.now(),
        keyword,
        type: 8193,
        pageindex,
        pagesize: 10,
        name: 'web',
      },
    });
    return {
      total: body.TotalCount > 100 ? 100 : body.TotalCount,
      list: body.Data,
    };
  } catch (error) {
    return {
      total: 0,
      list: [],
    };
  }
}
