export function format(date: Date) {
  try {
    const format = new Date(date);
    format.setHours(format.getHours() - 3);
    return format.toISOString().slice(0, 16);
  } catch (e) {
    e;
  }
}

export function isValidDate(date: Date | undefined) {
  try {
    return !!date?.getHours();
  } catch (e) {
    e;
  }
}
