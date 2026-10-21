function buildProductName(name) {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} - 1 Kg`;
}

module.exports = { buildProductName };
