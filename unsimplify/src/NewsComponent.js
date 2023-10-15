import React, { useEffect, useState } from 'react';
import { View, Text, WebView } from 'react-native';

const NewsComponent = () => {
  const [newsContent, setNewsContent] = useState('');

  useEffect(() => {
    const fetchNewsContent = async () => {
      const url = 'https://www.foxnews.com/live-news/hamas-attack-israel-war';

      try {
        const response = await fetch(url);
        const html = await response.text();
        setNewsContent(html);
      } catch (error) {
        console.error('Error fetching news content:', error);
      }
    };

    fetchNewsContent();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
        News Article
      </Text>
      <WebView source={{ html: newsContent }} style={{ flex: 1 }} />
    </View>
  );
};

export default NewsComponent;