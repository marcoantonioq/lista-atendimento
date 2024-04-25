navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Mensagem recebida na página:', event.data);
});