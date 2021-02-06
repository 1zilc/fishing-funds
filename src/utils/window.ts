window.jsonpgz = function (response) {
  return response;
};

window.parsezindex = function (response) {
  return response.data.diff.map((i) => {
    return {
      name: i.f14,
      code: `${i.f13}.${i.f12}`,
      show: false,
    };
  });
};
