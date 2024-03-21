import { boot } from 'quasar/wrappers';
import { Socket, io } from 'socket.io-client';
import { IApp, IEvento, app } from 'src/app';
import { settings } from 'src/settings';
import { Notify } from 'quasar';
import { mapEvento, updateApp } from 'src/helpers/updateApp';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: Socket;
  }
}

const config = {
  auth: {
    token: localStorage.getItem('token'),
  },
};

export let socket: Socket | null = null;
if (config.auth.token) {
  socket = io(window.location.origin, config);
}

export default boot(({ app }) => {
  if (socket) {
    app.config.globalProperties.$socket = socket;
  }
});

export async function saveApp(app: IApp) {
  new Promise<IApp>((resolve) => {
    socket?.emit('saveApp', app, (saved: IApp) => {
      resolve(saved);
    });
  });

  Notify.create({
    type: 'positive',
    message: 'Salvo com sucesso!',
    position: 'top-right',
  });
}

export async function saveEventos(events: IEvento[]): Promise<IEvento[]> {
  const savedEvents = await Promise.all(
    events.map((event) => {
      return new Promise<IEvento>((resolve) => {
        socket?.emit('save', event, (savedEvent: IEvento) => {
          resolve(savedEvent);
        });
      });
    })
  );
  return savedEvents;
}

export async function removeEventos(events: IEvento[]): Promise<IEvento[]> {
  const removedEvents = await Promise.all(
    events.map((event) => {
      return new Promise<IEvento>((resolve) => {
        socket?.emit('remove', event, (removedEvent: IEvento) => {
          resolve(removedEvent);
        });
      });
    })
  );
  return removedEvents;
}

export async function rebootAPP() {
  Notify.create({
    type: 'negative',
    message: 'Reiniciando servidor!!!',
    position: 'top-right',
    timeout: 60000,
  });
  socket?.emit('reboot');
}

export async function reloadAPP() {
  socket?.emit('reload');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 10000);
  });
}

socket?.on('app', (application) => {
  updateApp(app, JSON.parse(JSON.stringify(application)));
  console.log('App carregado.');
});

socket?.on('eventos', (eventos: IEvento[]) => {
  app.eventos.items = [];
  setTimeout(() => {
    app.eventos.items = [...eventos.map(mapEvento)];
    console.log('Eventos recebidos via socket: ', app.eventos.items.length);
  }, 10);
});

socket?.on('connect', () => {
  settings.connected = true;
  settings.admin = true;
});

socket?.on('disconnect', () => {
  console.log('Desconectado do servidor socket!');
  if (settings.connected) {
    Notify.create({
      type: 'negative',
      message: 'Servidor OFF!',
      position: 'top-right',
    });
  }
  settings.connected = false;
  settings.admin = false;
});

// // Solicita permissão para enviar notificações
// Notification.requestPermission().then(function(permission) {
//   if (permission === 'granted') {
//     console.log('Permissão para enviar notificações concedida!');
//   } else {
//     console.warn('Permissão para enviar notificações não concedida.');
//   }
// });

// // Função para enviar uma notificação
// function enviarNotificacao() {
//   if (Notification.permission === 'granted') {
//     const notification = new Notification('Título da Notificação', {
//       body: 'Corpo da Notificação',
//       icon: 'icons/icon-192x192.png'
//     });

//     notification.onclick = function() {
//       console.log('Notificação clicada!');
//     };
//   } else {
//     console.warn('Permissão para enviar notificações não concedida.');
//   }
// }
// enviarNotificacao()
