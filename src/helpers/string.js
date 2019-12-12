export const withRandomLetters = str => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const { spaceCount } = whitespaces(str);
  const finishLength = str.length - spaceCount > 12 ? 16 : 12;
  let result = str.toUpperCase().replace(/\s/g, '');

  const length = finishLength - result.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const shuffle = str => {
  const a = str.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join('');
};

export const whitespaces = str => {
  const positions = getAllIndexesHash(str, ' ');
  const spaceCount = Object.keys(positions).length;
  return { spaceCount, positions };
};

/* const getAllIndexes = (str, search) =>
  str.split('').reduce((result, element, index) => {
    if (element === search) result.push(index);
    return result;
  }, []); */

const getAllIndexesHash = (str, search) => {
  const indexes = {};
  for (let i = 0; i < str.length; i += 1)
    if (str.charAt(i) === search) indexes[i] = true;
  return indexes;
};
