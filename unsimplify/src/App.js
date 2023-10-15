import React from 'react';
import { View, Text } from 'react-native';
import NewsComponent from './NewsComponent'; // Import the NewsComponent

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
        My News App
      </Text>
      <NewsComponent /> {/* Render the NewsComponent here */}
    </View>
  );
};

export default App;





