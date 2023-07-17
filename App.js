import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import chatData from './chatData.json';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const scrollViewRef = useRef(null);

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleSend = () => {
    const reply = getBotReply(inputText);

    setChatLog([...chatLog, { message: inputText, reply }]);
    setInputText('');
  };

  const getBotReply = (message) => {
    const intents = chatData.intents;

    const lowerCaseMessage = message.toLowerCase();

    for (let i = 0; i < intents.length; i++) {
      const intent = intents[i];

      for (let j = 0; j < intent.patterns.length; j++) {
        const pattern = intent.patterns[j].toLowerCase();

        if (lowerCaseMessage.includes(pattern)) {
          return getRandomElement(intent.responses);
        }
      }
    }

    return getRandomElement(chatData.intents.find((intent) => intent.tag === 'noanswer').responses);
  };

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [chatLog]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {chatLog.map((log, index) => (
          <SafeAreaView key={index} style={styles.messageContainer}>
            <Text style={styles.message}>{log.message}</Text>
            <Text style={styles.reply}>{log.reply}</Text>
          </SafeAreaView>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "8%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  chatContainer: {
    flex: 1,
    marginBottom: "9%",
    width: '100%',
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reply: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});

export default App;
