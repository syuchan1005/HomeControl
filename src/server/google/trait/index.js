const fs = require('fs');

const Trait = {};

fs.readdirSync(`${__dirname}/types`).forEach((name) => {
  Trait[name.substr(0, name.length - 3)] = require(`${__dirname}/types/${name}`).default; // eslint-disable-line
});

export default Trait;
