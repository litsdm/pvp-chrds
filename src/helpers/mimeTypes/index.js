import db from './db.json';

const extensions = Object.create(null);
const types = Object.create(null);

const lookup = extension => {
  if (!extension || typeof extension !== 'string') {
    return false;
  }

  return types[extension] || false;
};

const populateMaps = () => {
  const preference = ['nginx', 'apache', undefined, 'iana'];

  Object.keys(db).forEach(type => {
    const mime = db[type];
    const exts = mime.extensions;

    if (!exts || !exts.length) {
      return;
    }

    // mime -> extensions
    extensions[type] = exts;

    // extension -> mime
    for (let i = 0; i < exts.length; i += 1) {
      const extension = exts[i];

      if (types[extension]) {
        const from = preference.indexOf(db[types[extension]].source);
        const to = preference.indexOf(mime.source);

        if (types[extension] !== 'application/octet-stream'
          && (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue; // eslint-disable-line no-continue
        }
      }

      // set the extension -> mime
      types[extension] = type;
    }
  });
};

populateMaps();

export default lookup;
