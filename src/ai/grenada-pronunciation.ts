/** Explicit scoped repair of Kokoro's Grenada vowel, not a global dictionary. */
export const correctGrenadaPhonemes = (text: string, phonemes: string) => {
 const expected = text.match(/\bGrenada(?:['’]s)?\b/g)?.length ?? 0;
 const baseline = 'ɡɹɛnˈɑːdə';
 const occurrences = phonemes.split(baseline).length - 1;
 if (!expected || occurrences !== expected) throw new Error('Grenada pronunciation repair requires exact text/phoneme occurrence agreement');
 return {phonemes: phonemes.split(baseline).join('ɡɹənˈeɪdə'), occurrences};
};
