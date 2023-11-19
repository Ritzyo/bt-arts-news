import React from 'react';
import Summarizer from './components/Summarizer';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
        My News App
      </Text>
      <Summarizer />
    </View>
  );
};

export default App;





