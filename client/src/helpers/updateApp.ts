import { IApp, IEvento } from '../app';

export function mapEvento(e: IEvento): IEvento {
  const {
    id,
    list = '',
    title = '',
    locale = '',
    desc = '',
    date,
    end = e.date,
    updated,
    gid,
    maps,
    recurring,
  } = e;
  return {
    id,
    list,
    title,
    locale,
    desc,
    date: new Date(date),
    end: new Date(end),
    updated: updated ? new Date(updated) : new Date(),
    gid,
    maps,
    recurring,
  };
}

export function mergeObjects<T>(target: T, source: T): T {
  for (const key in source) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      target[key] = mergeObjects(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target as T;
}

export function updateApp(app: IApp, newApp: Partial<IApp>): void {
  mergeObjects(app, newApp) as IApp;
  app.eventos.items = [...app.eventos.items.map(mapEvento)];
}
