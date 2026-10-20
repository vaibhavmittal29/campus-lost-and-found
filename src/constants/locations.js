export const LOCATIONS = [
  { id: 'tt', label: 'Technology Tower (TT)', x: 50, y: 50 },
  { id: 'sjt', label: 'Silver Jubilee Tower (SJT)', x: 58, y: 46 },
  { id: 'mb', label: 'Main Building', x: 42, y: 55 },
  { id: 'lib', label: 'Central Library', x: 46, y: 40 },
  { id: 'anna', label: 'Anna Auditorium', x: 35, y: 48 },
  { id: 'foodys', label: 'Foodys / Food Court', x: 62, y: 58 },
  { id: 'gdn', label: 'Gandhi Block', x: 54, y: 62 },
  { id: 'mh', label: "Men's Hostel Area", x: 80, y: 30 },
  { id: 'lh', label: "Ladies' Hostel Area", x: 20, y: 25 },
  { id: 'sports', label: 'Sports Complex', x: 75, y: 78 },
  { id: 'gate', label: 'Main Gate', x: 12, y: 85 },
  { id: 'other', label: 'Somewhere else on campus', x: 50, y: 50 },
]

export const getLocation = (id) => {
  return LOCATIONS.find((loc) => loc.id === id) || {
    id: 'other',
    label: 'Campus Grounds',
    x: 50,
    y: 50,
  }
}
