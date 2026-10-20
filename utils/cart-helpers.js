function buildProductName(name) {
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);
    return `${formatted} - 1 Kg`;
}

module.exports = { buildProductName };