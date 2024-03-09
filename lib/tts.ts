
export function tts(text: string) {

  speechSynthesis.cancel();
  console.log("Voices: ", speechSynthesis.getVoices());

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';

  // TODO it would be better to have a slider that allows the user to set the utterance rate. That should be passed in as an argument
  if (navigator.userAgent.toLowerCase().search("firefox")) {
    utterance.rate = 0.8;
    utterance.lang = 'fr';
  }

  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}