import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { bool, func, number, string } from 'prop-types';

import { shuffle, withRandomLetters, whitespaces } from '../helpers/string';

import Layout from '../constants/Layout';

const Letter = ({ character, onPress, size, withBorder }) => (
  <View style={[styles.letterWrapper, { height: size, width: size }]}>
    {character ? (
      <Animated.View style={[styles.letter]}>
        <TouchableOpacity style={styles.letterButton} onPress={onPress}>
          <Text style={styles.character}>{character}</Text>
        </TouchableOpacity>
        <View style={styles.tileBottom} />
      </Animated.View>
    ) : null}
    <View style={[styles.charBG, withBorder ? styles.withBorder : {}]} />
  </View>
);

const LetterSoup = ({ word }) => {
  const [characters, setCharacters] = useState([]);
  const [result, setResult] = useState(Array(word.length).fill(''));
  const [selected, setSelected] = useState({});

  const { spaceCount, positions } = whitespaces(word);
  const totalLength = word.length - spaceCount > 12 ? 16 : 12;
  const letterSize =
    Layout.window.width / (totalLength / 2) - (totalLength / 2 + 1);

  useEffect(() => {
    prepareWord();
  }, []);

  const prepareWord = () => {
    const withRandom = withRandomLetters(word);
    const shuffled = shuffle(withRandom);
    setCharacters(shuffled.split(''));
  };

  const selectCharacter = (character, index) => () => {
    let didAdd = false;
    for (let i = 0; i < result.length; i += 1) {
      if (!result[i] && !positions[i]) {
        didAdd = true;
        setSelected({ ...selected, [i]: index });
        setResult([...result.slice(0, i), character, ...result.slice(i + 1)]);
        break;
      }
    }

    if (!didAdd) {
      // result is full, check answer
    }
  };

  const removeFromResult = index => () => {
    const copy = { ...selected };
    delete copy[index];
    setSelected(copy);
    setResult([...result.slice(0, index), '', ...result.slice(index + 1)]);
  };

  const calculateResultSize = () => {
    const words = word.split(' ');
    let maxLength = 0;

    words.forEach(item => {
      if (maxLength < item.length) maxLength = item.length;
    });

    return Layout.window.width / maxLength - 42 / maxLength;
  };

  const renderResultCharacters = () => {
    const words = [];
    const resultSize = calculateResultSize();
    let letters = [];

    result.forEach((character, index) => {
      if (positions[index]) {
        words.push(letters);
        letters = [];
        return;
      }

      const letter = (
        <Letter
          character={character}
          onPress={removeFromResult(index)}
          size={resultSize}
          withBorder
        />
      );
      letters.push(letter);
    });

    words.push(letters);

    return words.map(item => <View style={styles.resultRow}>{item}</View>);
  };

  const renderCharacters = () =>
    characters.map((character, index) => (
      <Letter
        character={Object.values(selected).includes(index) ? '' : character}
        onPress={selectCharacter(character, index)}
        size={letterSize}
      />
    ));

  return (
    <View style={styles.container}>
      <View style={styles.result}>{renderResultCharacters()}</View>
      <View style={styles.soup}>{renderCharacters()}</View>
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    left: 0,
    position: 'absolute',
    right: 0
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  soup: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 3,
    paddingVertical: 24,
    width: '100%',
    zIndex: 2
  },
  result: {
    width: '100%',
    zIndex: 2
  },
  resultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: '100%'
  },
  letterWrapper: {
    borderRadius: 8,
    height: Layout.window.width / 6 - 7,
    width: Layout.window.width / 6 - 7,
    marginBottom: 6,
    marginHorizontal: 3,
    maxWidth: Layout.window.width / 6 - 7,
    maxHeight: Layout.window.width / 6 - 7
  },
  letter: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    zIndex: 1
  },
  charBG: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  withBorder: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderColor: '#7c4dff',
    borderStyle: 'dashed',
    borderWidth: 1
  },
  letterButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    height: '75%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1
  },
  tileBottom: {
    backgroundColor: 'rgba(124,77,255, 0.2)',
    bottom: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0
  },
  empty: {
    height: Layout.window.width / 6 - 7,
    width: Layout.window.width / 6 - 7,
    marginBottom: 6,
    marginHorizontal: 3
  },
  divider: {
    backgroundColor: '#fff',
    height: 1,
    opacity: 0.4,
    marginHorizontal: 3,
    marginVertical: 12,
    width: '100%',
    zIndex: 1
  },
  character: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 16
  }
});

Letter.propTypes = {
  character: string.isRequired,
  onPress: func.isRequired,
  size: number.isRequired,
  withBorder: bool
};

Letter.defaultProps = {
  withBorder: false
};

LetterSoup.propTypes = {
  word: string.isRequired
};

export default LetterSoup;
