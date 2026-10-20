function buildProductName(name) {
  const trimmed = name.trim();
  const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return `${formatted} - 1 Kg`;
}

function formatQuantity(quantity) {
  return String(quantity);
}

module.exports = { buildProductName, formatQuantity };