export interface Evento {
  id: number;
  list: string;
  title: string;
  locale: string;
  desc: string;
  date?: Date;
  end?: Date;
  gid?: string;
  updated?: Date;
  recurring?: string;
  maps?: string;
}
