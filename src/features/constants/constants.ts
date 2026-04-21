export const EMPLOYEES = [
    { id: 1, name: 'Fred' },
    { id: 2, name: 'Jomar V.' }
]

export const CUSTOMER_CATEGORIES = [
    { id: 1, name: 'Store', price: 25 },
    { id: 2, name: 'House', price: 30 },
    { id: 3, name: 'Mixed', price: 27 }
]

export const EXPENSE_CATEGORIES = [
    { id: 1, name: 'Gas' },
    { id: 2, name: 'Snacks' },
    { id: 3, name: 'Lunch' },
    { id: 4, name: 'Seals/Plastic' },
    { id: 5, name: 'Supplies' },
    { id: 6, name: 'Maintenance' },
    { id: 7, name: 'Bike Maintenance' },
    { id: 8, name: 'Gallons' },
    { id: 9, name: 'Electricity' },
    { id: 10, name: 'Nawasa' },
    { id: 11, name: 'Rent' },
    { id: 12, name: 'Product Test' },
    { id: 13, name: 'Other' },
];

export const CUSTOMERS = [
  { id: 1, name: 'Agotto Gesul' },
  { id: 2, name: 'Alex' },
  { id: 3, name: 'Althea' },
  { id: 4, name: 'Amy' },
  { id: 5, name: 'Antolin' },
  { id: 6, name: 'Anthony' },
  { id: 7, name: 'Baro 5 Police' },
  { id: 8, name: 'Baro Houses' },
  { id: 9, name: 'Bantog' },
  { id: 10, name: 'Beth' },
  { id: 11, name: 'Bustillos' },
  { id: 12, name: 'Clara' },
  { id: 13, name: 'Cruz' },
  { id: 14, name: 'Domanpot Houses' },
  { id: 15, name: 'Kalbo' },
  { id: 16, name: 'Maisan' },
  { id: 17, name: 'Mani' },
  { id: 18, name: 'Marie' },
  { id: 19, name: 'Oliver' },
  { id: 20, name: 'Raphy' },
  { id: 21, name: 'Santa Ana' },
  { id: 22, name: 'Subd. Houses' },
  { id: 23, name: 'Talyer' },
  { id: 24, name: 'Tandoc' },
  { id: 25, name: 'Tining' },
  { id: 26, name: 'Vilma' },
  { id: 27, name: 'Waray' },
  { id: 28, name: 'Pio' },
  { id: 29, name: 'Bong' },
  { id: 30, name: 'RMC' },
  { id: 999, name: 'Other - Add name on notes' },
].sort((a, b) => {
  // Always push "Other" to the bottom
  if (a.name.startsWith('Other')) return 1;
  if (b.name.startsWith('Other')) return -1;
  return a.name.localeCompare(b.name);
});
