const fs = require('fs');

const Trait = {};
if (process.env.NODE_ENV === 'production') {
  const context = require.context('./types/', false, /\.js$/);
  context.keys().forEach((...key) => {
    Trait[key[0].substr(2, key[0].length - 5)] = context(...key).default;
  });
} else {
  fs.readdirSync(`${__dirname}/types`).forEach((name) => {
    Trait[name.substr(2, name.length - 5)] = require(`${__dirname}/types/${name}`).default; // eslint-disable-line
  });
}

export default Trait;
