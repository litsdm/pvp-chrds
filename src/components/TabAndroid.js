import React, { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { bool, func, object } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const Tab = ({ renderIcon, isActive, route, onTabPress }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: false });

  useEffect(() => {
    if (isActive) animateTo(1);
    else animateTo(0);

    return () => animateTo(0);
  }, [isActive]);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onTabPress({ route })}
      style={styles.touchy}
    >
      <View style={styles.wrapper}>
        <Animated.View
          style={[
            styles.innerBG,
            animateOpacity,
            {
              backgroundColor: isActive
                ? Colors.tabBackgroundSelected[route.routeName]
                : 'transparent',
              width:
                route.routeName === 'Categories'
                  ? Layout.window.width / 4 + 12
                  : Layout.window.width / 4
            }
          ]}
        />
        {renderIcon({ route, focused: isActive })}
        <Animated.Text
          style={[
            styles.label,
            animateOpacity,
            { color: Colors.tabIconSelected[route.routeName] }
          ]}
        >
          {route.routeName}
        </Animated.Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  touchy: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    width: Layout.window.width / 4
  },
  innerBG: {
    borderRadius: 24,
    height: 36,
    position: 'absolute',
    paddingHorizontal: 12,
    width: '100%'
  },
  label: {
    color: '#7C4DFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    opacity: 0
  }
});

Tab.propTypes = {
  isActive: bool.isRequired,
  onTabPress: func.isRequired,
  renderIcon: func.isRequired,
  route: object.isRequired
};

export default Tab;
