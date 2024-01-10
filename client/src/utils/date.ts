export const diaSemana = (date?: Date) => {
  if (!date) return "";
  const semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return semana[date.getDay()] || "";
};

export const dia = (date?: Date) => {
  if (!date) return "";
  return String(date.getDate() || "").padStart(2, "0");
};
export const mes = (date?: Date) => {
  if (!date) return "";
  return String(date.getMonth() + 1 || "").padStart(2, "0");
};

export const diaMes = (date?: Date) => {
  if (!date) return "";
  return `${dia(date)}/${mes(date)}`;
};

export const hora = (date?: Date) => {
  if (!date) return "";
  const hours = String(date.getHours() || "").padStart(2, "0");
  const min = String(date.getMinutes() || "").padStart(2, "0");
  return `${hours}:${min}`;
};
