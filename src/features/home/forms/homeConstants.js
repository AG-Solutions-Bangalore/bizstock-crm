export const TABS = [
  { value: "stock-view", label: "Stock View" },
  { value: "outofstock", label: "Out of Stock" },
  { value: "graph", label: "Graph" },
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const getYears = () => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const years = [];
  if (currentYear < startYear) {
    return [startYear.toString()];
  }
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
};
