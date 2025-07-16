import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

const TypingDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -4,
            duration: 250,
            delay,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );
    };

    createAnimation(dot1, 0).start();
    createAnimation(dot2, 150).start();
    createAnimation(dot3, 300).start();
  }, []);

  return (
    <View className="flex-row space-x-4 mt-1">
      {[dot1, dot2, dot3].map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#666',
            transform: [{ translateY: anim }],
          }}
        />
      ))}
    </View>
  );
};

export default TypingDots;
