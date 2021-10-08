const { got } = window.contextModules;

export async function GetListFromEastmoney(po: string, fs: string) {
  try {
    const { body } = await got<{
      rc: 0;
      rt: 6;
      svr: 181240773;
      lt: 1;
      full: 1;
      data: {
        total: 1;
        diff: [
          {
            f1: 4;
            f2: 6.4616;
            f3: 0.2;
            f4: 0.0128;
            f5: 0;
            f6: '-';
            f7: 0.39;
            f8: '-';
            f9: '-';
            f10: '-';
            f11: 0.0;
            f12: 'USDCNH';
            f13: 133;
            f14: '美元离岸人民币';
            f15: 6.4707;
            f16: 6.4458;
            f17: 6.449;
            f18: 6.4488;
            f20: '-';
            f21: '-';
            f22: 0.0;
            f23: '-';
            f24: 0.05;
            f25: -0.64;
            f62: '-';
            f115: '-';
            f128: '-';
            f140: '-';
            f141: '-';
            f136: '-';
            f152: 2;
          }
        ];
      };
    }>('http://73.push2.eastmoney.com/api/qt/clist/get', {
      searchParams: {
        pn: 1,
        pz: 200,
        po,
        fltt: 2,
        invt: 2,
        fid: 'f3',
        fields: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152',
        fs,
        _: new Date().getTime(),
      },
      responseType: 'json',
    });
    return Object.values(body.data.diff).map((i) => ({
      code: i.f12,
      name: i.f14,
      zxj: i.f2,
      zde: i.f4,
      zdf: i.f3,
      jk: i.f17,
      zg: i.f15,
      zd: i.f16,
      zs: i.f18,
    }));
  } catch (error) {
    return [];
  }
}

export async function GetGlobalBondFromEastmoney() {
  try {
    const { body: script } = await got('http://quote.eastmoney.com/center/api/qqzq.js', {
      searchParams: {
        _: new Date().getTime(),
      },
    });
    const result: {
      code: string; //'US2Y_B';
      name: string; //'美国2年期国债';
      percent: string; //'0.00';
      price: string; // 0.22;
      timestamp: string; // 1629467984;
    }[] = eval(`(()=>{
      ${script};
      return BONDdata;
    })()`);
    return result;
  } catch (error) {
    return [];
  }
}
