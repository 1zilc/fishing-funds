declare global {
  interface Window {
    parsezindex: (response: {
      data: { diff: { f12: string; f13: string; f14: string }[] };
    }) => {
      name: string;
      code: string;
      show: boolean;
    }[];
  }
}

window.parsezindex = function (response) {
  return response.data.diff.map((i) => {
    return {
      name: i.f14,
      code: `${i.f13}.${i.f12}`,
      show: false,
    };
  });
};

export {};
