const AsyncStorage = require('@react-native-async-storage/async-storage').default;

export const translateText = async (
  text: string,
  targetLang: 'si' | 'ta' | 'en',
): Promise<string> => {
  const key = `translation_${targetLang}_${text}`;
  const cached = await AsyncStorage.getItem(key);
  if (cached) return cached;

  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    const data = await response.json();
    if (data.translatedText) {
      await AsyncStorage.setItem(key, data.translatedText);
      return data.translatedText;
    }

    return text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
};
