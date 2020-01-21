import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { bool, func, object, string } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';
import Layout from '../../constants/Layout';

import WordTooltip from './WordTooltip';
import PowerUp from '../Match/PowerUp';
import TopControls from './TopControls';

import ArrowLeft from '../../../assets/icons/arrowLeft.svg';
import ArrowRight from '../../../assets/icons/arrowRight.svg';

const titles = [
  'Press the Record Button once to record.',
  'Record with sound.',
  'The word you have to act.',
  'Activate Powerups',
  'Top bar info.'
];
const descriptions = [
  'A 3 second countdown will start and after that you have 6 seconds to record your word.',
  'When a word is too difficult to act or you activate the mic powerup you will be able to record with sound.',
  'You can press re-roll to get another word or the ? button for more info.',
  'Powerups give you certain advantages. Press one before recording to get more info.',
  'Look at the top bar for info about your opponent, category and match score.'
];

const W_HEIGHT = Layout.window.height;
const W_WIDTH = Layout.window.width;

const Powerups = ({ onPress }) => (
  <View style={styles.powerups}>
    <PowerUp
      icon="microphone-alt"
      text="Mic - Record your video w/ sound."
      onPress={onPress}
      infoDuration={2000}
    />
    <PowerUp
      icon="hand-pointer"
      text="Hand - Select the word you want."
      onPress={onPress}
      infoDuration={2000}
    />
  </View>
);

const Tooltip = ({ word, color, onPress }) => (
  <View style={styles.tooltip}>
    <WordTooltip
      word={word}
      color={color}
      rollCount={2}
      openHint={onPress}
      roll={onPress}
      openPurchase={onPress}
    />
  </View>
);

const RecordButton = ({ allowMic, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.mainButton}>
      <View style={styles.innerCircle}>
        {allowMic ? (
          <FontAwesome5
            name="microphone-alt"
            size={24}
            color="rgba(124,77,255,0.8)"
          />
        ) : null}
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const Walkthrough = ({ close, word, category, opponent }) => {
  const [page, setPage] = useState(0);
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });
  const {
    animationValue: arrowAnimation,
    animateTo: animateArrowTo
  } = useAnimation();

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const animateLeftArrow = {
    transform: [
      {
        translateY: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: [
            0,
            0,
            -132,
            -(W_HEIGHT - 72 * 2 - 15),
            -(W_HEIGHT - 72 * 2 - 15)
          ]
        })
      },
      {
        translateX: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: [0, 0, -48, W_WIDTH - 144 - 54, 36]
        })
      },
      {
        rotate: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: ['0deg', '0deg', '0deg', '0deg', '-90deg']
        })
      }
    ]
  };

  const animateRightArrow = {
    transform: [
      {
        translateY: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: [
            0,
            0,
            -132,
            -(W_HEIGHT - 72 * 2 - 78),
            -(W_HEIGHT - 72 * 2 - 15)
          ]
        })
      },
      {
        translateX: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: [0, 0, 48, -24, -36]
        })
      },
      {
        rotate: arrowAnimation.current.interpolate({
          inputRange: [0, 1, 2, 3, 4],
          outputRange: ['0deg', '0deg', '0deg', '180deg', '90deg']
        })
      }
    ]
  };

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 150);
  };

  const handleNext = () => {
    const totalPages = titles.length;
    if (page + 1 === totalPages) handleClose();
    else {
      setPage(page + 1);
      animateArrowTo(page + 1);
    }
  };

  const handlePrev = () => {
    if (page === 0) return;
    setPage(page - 1);
    animateArrowTo(page - 1);
  };

  const renderHighlightElement = () => {
    switch (page) {
      case 0:
        return <RecordButton onPress={handleNext} />;
      case 1:
        return <RecordButton onPress={handleNext} allowMic />;
      case 2:
        return (
          <Tooltip word={word} color={category.color} onPress={handleNext} />
        );
      case 3:
        return <Powerups onPress={handleNext} />;
      case 4:
        return (
          <TopControls
            goBack={handleNext}
            iconName="ios-arrow-round-back"
            uri={opponent.profilePic}
            username={opponent.displayName}
            userScore={0}
            opponentScore={0}
            isRecording={false}
            category={category}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, animateOpacity]}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handlePrev}>
          <View style={styles.leftOverlay} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleNext}>
          <View style={styles.rightOverlay} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{titles[page]}</Text>
        <Text style={styles.description}>{descriptions[page]}</Text>
        {renderHighlightElement()}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handlePrev}>
            <Text
              style={[styles.buttonText, { opacity: page === 0 ? 0.2 : 1 }]}
            >
              Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.currentPage}>
            {page + 1}/{titles.length}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {page + 1 === titles.length ? 'Close' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.arrowLeft, animateLeftArrow]}>
          <ArrowLeft width={72} />
        </Animated.View>
        <Animated.View style={[styles.arrowRight, animateRightArrow]}>
          <ArrowRight width={72} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  leftOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '50%'
  },
  rightOverlay: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%'
  },
  content: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24
  },
  title: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 24,
    textAlign: 'center'
  },
  description: {
    color: '#fff',
    fontFamily: 'sf-regular',
    fontSize: 18,
    opacity: 0.8,
    textAlign: 'center'
  },
  footer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    position: 'absolute',
    right: 0
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  currentPage: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  mainButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    bottom: 36,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    marginLeft: 48,
    marginRight: 48,
    position: 'absolute',
    width: 84
  },
  innerCircle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54
  },
  tooltip: {
    bottom: 132,
    position: 'absolute'
  },
  powerups: {
    position: 'absolute',
    right: 24,
    top: 72
  },
  arrowLeft: {
    bottom: 36,
    position: 'absolute',
    left: 54,
    zIndex: 5
  },
  arrowRight: {
    bottom: 36,
    position: 'absolute',
    right: 54,
    zIndex: 5
  }
});

Powerups.propTypes = {
  onPress: func.isRequired
};

Tooltip.propTypes = {
  word: string.isRequired,
  color: string.isRequired,
  onPress: func.isRequired
};

RecordButton.propTypes = {
  allowMic: bool,
  onPress: func.isRequired
};

RecordButton.defaultProps = {
  allowMic: false
};

Walkthrough.propTypes = {
  close: func.isRequired,
  word: string.isRequired,
  opponent: object.isRequired,
  category: object.isRequired
};

export default Walkthrough;
