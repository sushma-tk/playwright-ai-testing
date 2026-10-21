function buildProductName(name) {
  const trimmedName = name.trim();
  const capitalizedName =
    trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
  return `${capitalizedName} - 1 Kg`;
}

function formatQuantity(quantity) {
  return `${quantity} Kg`;
}

module.exports = { buildProductName, formatQuantity };
