export function sortDatesWithPositions(dateList: string[]): Record<string, number> {
  const datesWithObjects = dateList.map(date => ({
    originalDate: date,
    dateObject: new Date(date)
  }))

  datesWithObjects.sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime())

  const result: Record<string, number> = {}
  datesWithObjects.forEach((item, index) => {
    result[item.originalDate] = index + 1
  })

  return result;
}