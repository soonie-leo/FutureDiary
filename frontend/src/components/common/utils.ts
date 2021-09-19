export const getNumberWithComma = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// html 인코딩이 되어 있어서 굳이 이렇게 한번 더 디코딩이 필요한 경우 호출
export const htmlDecode = (input: string): string => {
  const e = document.createElement('div');
  e.innerHTML = input;
  const output = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  return typeof output === 'string' ? output : '';
};
