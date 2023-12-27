// let synth: SpeechSynthesis = window.speechSynthesis;
// let isSpeaking = false;
// let selectedVoiceName = "";

// async function toggleSpeech() {
//   const elements: NodeListOf<Element> | undefined = document
//     .querySelector("#app")
//     ?.querySelectorAll(".ler");

//   function speak(text: string) {
//     return new Promise<void>((resolve, reject) => {
//       if (!isSpeaking) {
//         const selectedVoice: SpeechSynthesisVoice | undefined = synth
//           .getVoices()
//           .find(
//             (voice: SpeechSynthesisVoice) => voice.name === selectedVoiceName
//           );

//         if (selectedVoice && text !== "") {
//           const utterance: SpeechSynthesisUtterance =
//             new SpeechSynthesisUtterance(text);
//           utterance.voice = selectedVoice;

//           utterance.addEventListener("start", () => {
//             console.log("Iniciado!");
//           });

//           utterance.addEventListener("end", () => {
//             console.log("Terminado!");
//             resolve();
//           });

//           synth.speak(utterance);
//           isSpeaking = true;
//         }
//       } else {
//         synth.cancel();
//         isSpeaking = false;
//         reject();
//       }
//     });
//   }

//   if (elements) {
//     const voices: SpeechSynthesisVoice[] = synth.getVoices();
//     const voice: SpeechSynthesisVoice | undefined = voices.find(
//       (voice: SpeechSynthesisVoice) => /pt-BR/gi.test(voice.lang)
//     );

//     if (voice && voice.name) selectedVoiceName = voice.name;
//     console.log("Voz selecionada: ", voice?.name);

//     for (const element of elements) {
//       if (element instanceof HTMLElement) {
//         const text = element.textContent;
//         if (text) {
//           // console.log("Texto: ", text);
//           element.classList.add("yellow");
//           try {
//             await speak(text);
//           } catch (error) {
//             console.log("Erro:", error);
//           }
//           element.classList.remove("yellow");
//         }
//       }
//     }
//   }
// }

// if(start){
//     const date = new Date(start);
//     const dd = Utilities.formatDate(date, "America/Sao_Paulo", "dd/MM");
//     const hh = Utilities.formatDate(date, "America/Sao_Paulo", "HH:mm");
//     const se = settings.semana[date.getDay()];
//     dateFomated = `${dd} ${se} ${hh}`
//     dateISO = date.toISOString()
//   }
