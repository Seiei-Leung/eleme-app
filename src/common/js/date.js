export function formatDate(date, formatStr) {
  let obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(formatStr)) {
    // RegExp.$1是RegExp的一个属性
    // 指的是与正则表达式匹配的第一个子匹配(以括号为标志)字符串, 以此类推, RegExp.$2, RegExp.$3 ...
    formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in obj) {
    if (new RegExp(`(${k})`).test(formatStr)) {
      let str = obj[k] + '';
      formatStr = formatStr.replace(RegExp.$1, (str.length === 1 ? ('0' + str) : str));
    }
  }
  return formatStr;
};
