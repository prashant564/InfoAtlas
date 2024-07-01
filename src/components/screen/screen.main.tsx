/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar as NativeStatusBar,
  View,
} from 'react-native';
import {StatusBar} from 'react-native-bars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {isNonScrolling, offsets, presets} from './screen.presets';

import {useAppTheme} from '@themes/getTheme';

import {
  ScreenProps,
  NonScrollingScreenStoreProps,
  ScrollingScreenStoreProps,
} from './typings';

const isIos = Platform.OS === 'ios';

const AnimatedBox = Animated.createAnimatedComponent(View);

function ScreenWithoutScrolling(
  props: ScreenProps & NonScrollingScreenStoreProps,
) {
  const {theme} = useAppTheme();
  const insets = useSafeAreaInsets();
  const preset = presets(theme).fixed;
  const style = props.style || {};
  const backgroundStyle = props.backgroundColor
    ? {backgroundColor: props.backgroundColor}
    : {};

  const animBoxPadding = useSharedValue(insets.top);
  const animatedBoxStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(animBoxPadding.value, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  React.useEffect(() => {
    animBoxPadding.value = insets.top;
  }, [animBoxPadding, insets.top, props.unsafe]);

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}>
      <StatusBar animated barStyle={props.statusBar || 'dark-content'} />
      <NativeStatusBar
        animated
        barStyle={props.statusBar || 'dark-content'}
        backgroundColor={props.statusBarBg || theme.appColors.white}
        hidden={props.hidden}
      />
      <AnimatedBox style={[preset.inner, style, animatedBoxStyle]}>
        {props.children}
      </AnimatedBox>
    </KeyboardAvoidingView>
  );
}

function ScreenWithScrolling(props: ScreenProps & ScrollingScreenStoreProps) {
  const {theme} = useAppTheme();
  const insets = useSafeAreaInsets();
  const preset = presets(theme).scroll;
  const style = props.style || {};
  const backgroundStyle = props.backgroundColor
    ? {backgroundColor: props.backgroundColor}
    : {};
  const animBoxPadding = useSharedValue(insets.top);
  const animatedBoxStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(animBoxPadding.value, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    animBoxPadding.value = insets.top;
  }, [animBoxPadding, insets.top, props.unsafe]);

  const onRefresh = React.useCallback(() => {
    // triggerAnalytics('Pulled to Refresh');
    if (props.hasPTR) {
      //add api calls here which are common and need to polled regularly
    }
  }, []);

  //[props, kycStatus]

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? 'padding' : undefined}
      keyboardVerticalOffset={offsets[props.keyboardOffset || 'none']}>
      <StatusBar animated barStyle={props.statusBar || 'dark-content'} />
      <NativeStatusBar
        barStyle={props.statusBar || 'dark-content'}
        backgroundColor={props.statusBarBg || theme.appColors.white}
        hidden={props.hidden}
        animated
      />
      <AnimatedBox style={[preset.outer, backgroundStyle, animatedBoxStyle]}>
        <ScrollView
          nestedScrollEnabled
          style={[preset.outer, props.scrollViewContainerStyles]}
          contentContainerStyle={[preset.inner, style]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            props.hasPTR ? (
              <RefreshControl
                colors={[
                  theme.appColors.primary100,
                  theme.appColors.confusedYellow,
                  theme.appColors.redOrangified,
                  theme.appColors.goodblue,
                ]}
                tintColor={'#8708D7'}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            ) : undefined
          }>
          {props.children}
        </ScrollView>
      </AnimatedBox>
    </KeyboardAvoidingView>
  );
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
function Screen(props: ScreenProps): React.ReactElement {
  const {theme} = useAppTheme();
  if (isNonScrolling(props.preset || 'fixed', theme)) {
    return <ScreenWithoutScrolling {...props} />;
  } else {
    return <ScreenWithScrolling {...props} />;
  }
}

export default Screen;
