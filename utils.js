export const dateAddedAsString = (date) => {
  return date.toISOString().split('T')[0]
}
