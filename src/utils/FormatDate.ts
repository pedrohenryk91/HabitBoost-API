export function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses vão de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}