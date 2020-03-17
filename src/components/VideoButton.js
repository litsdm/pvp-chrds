import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { bool, func, number, object, string } from 'prop-types';

const VideoButton = ({
  text,
  onPress,
  style,
  disabled,
  iconName,
  iconType,
  paddingHorizontal
}) => {
  const [bottomStyles, setBottomStyles] = useState({});

  const handleLayout = ({
    nativeEvent: {
      layout: { height, width }
    }
  }) => {
    setBottomStyles({ width: width + 2, height });
  };

  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <View style={styles.onTop} onLayout={handleLayout}>
        <Text
          style={[
            styles.buttonText,
            { marginRight: iconName ? 6 : 0, paddingHorizontal }
          ]}
        >
          {text}
        </Text>
        {iconName ? (
          <>
            {iconType === 'Ion' ? (
              <Ionicons name={iconName} size={14} color="#7c4dff" />
            ) : (
              <FontAwesome5 name={iconName} size={14} color="#7c4dff" />
            )}
          </>
        ) : null}
      </View>
      <View style={[bottomStyles, styles.buttonBottom]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  onTop: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 24,
    zIndex: 1
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 12,
    marginRight: 6
  },
  buttonBottom: {
    backgroundColor: '#7c4dff',
    borderRadius: 24,
    bottom: -3,
    left: -1,
    position: 'absolute'
  }
});

VideoButton.propTypes = {
  text: string.isRequired,
  onPress: func,
  style: object,
  disabled: bool,
  iconName: string,
  iconType: string,
  paddingHorizontal: number
};

VideoButton.defaultProps = {
  onPress: () => {},
  style: {},
  disabled: false,
  iconName: '',
  paddingHorizontal: 0,
  iconType: 'FA5'
};

export default VideoButton;
