import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  onChange: (lang: 'en' | 'si' | 'ta') => void;
};

const TranslationToggle: React.FC<Props> = ({ onChange }) => {
  const [lang, setLang] = React.useState<'en' | 'si' | 'ta'>('en');

  const handleChange = (value: 'en' | 'si' | 'ta') => {
    setLang(value);
    onChange(value);
  };

  return (
    <View>
      <Picker selectedValue={lang} onValueChange={handleChange}>
        <Picker.Item label='English' value='en' />
        <Picker.Item label='සිංහල' value='si' />
        <Picker.Item label='தமிழ்' value='ta' />
      </Picker>
    </View>
  );
};

export default TranslationToggle;
