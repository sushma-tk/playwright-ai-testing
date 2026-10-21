function buildProductName(name) {
  const trimmedName = name.trim();
  const capitalizedName =
    trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
  return `${capitalizedName} - 1 Kg`;
}

module.exports = { buildProductName };
