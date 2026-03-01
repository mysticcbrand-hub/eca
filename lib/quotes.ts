export const dailyQuotes = [
  "Controla tu atención. Controla tu vida.",
  "El silencio también es un logro.",
  "Cada decisión correcta dobla la siguiente.",
  "No te motives. Aparece de todas formas.",
  "El viejo tú no llega hasta aquí.",
  "Construyes en silencio. Los resultados hablan después.",
  "La energía que no gastas, la inviertes.",
  "No hay app que te salve. Solo tus decisiones.",
  "Un día más. Eso es todo lo que hay que hacer.",
  "El impulso pasa. El hábito se queda.",
  "La disciplina es la forma más alta de cuidado propio.",
  "No esperes estar listo. Empieza igual.",
];

export const cumplimientoMessages = [
  "Sólido. El contador sube.",
  "Correcto. Un día más en el registro.",
  "Constancia sin testigos. La forma más pura.",
  "Eso es todo. Mañana lo mismo.",
  "El sistema funciona porque tú lo haces funcionar.",
];

export const recaidaMessages = [
  "Los datos están guardados. Mañana, día uno otra vez.",
  "Una caída no borra lo que ya construiste.",
  "El récord histórico queda. El conteo reinicia.",
  "El proceso no termina. Solo se reinicia.",
  "Ya sabes lo que se siente llegar lejos.",
];

export function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

export function getRandomMessage(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
