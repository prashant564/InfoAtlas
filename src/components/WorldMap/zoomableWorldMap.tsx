import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import WorldMap, {MAP_ASPECT_RATIO, WorldMapProps} from './worldMap.main';

// The SVG is drawn at twice its on-screen size and scaled down, so it stays
// sharp when zoomed in (the native view is a bitmap once drawn).
const RENDER_SCALE = 2;
const MAX_SCALE = 8;
const DOUBLE_TAP_SCALE = 3;
const ZOOM_STEP = 2;

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export type ZoomableWorldMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
};

export type ZoomableWorldMapProps = Omit<WorldMapProps, 'width'>;

type Size = {width: number; height: number};

/**
 * The world map, fitted inside its container, with pinch, pan and
 * double-tap zoom. Tapping a country still reaches the map's onPress.
 */
const ZoomableWorldMap = forwardRef<
  ZoomableWorldMapHandle,
  ZoomableWorldMapProps
>((props, ref) => {
  const [container, setContainer] = useState<Size | null>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pinchStart = useSharedValue({
    scale: 1,
    x: 0,
    y: 0,
    focalX: 0,
    focalY: 0,
  });
  const panLast = useSharedValue({x: 0, y: 0});
  const isPinching = useSharedValue(false);

  // Fit the whole map inside the container.
  const map = useMemo<Size | null>(() => {
    if (!container) {
      return null;
    }
    const width = Math.min(
      container.width,
      container.height * MAP_ASPECT_RATIO,
    );
    return {width, height: width / MAP_ASPECT_RATIO};
  }, [container]);

  const gesture = useMemo(() => {
    const containerWidth = container?.width ?? 0;
    const containerHeight = container?.height ?? 0;
    const mapWidth = map?.width ?? 0;
    const mapHeight = map?.height ?? 0;

    // Translation is relative to the centre; keep the map covering the
    // container (or centred when it is smaller than the container).
    const clampX = (x: number, s: number) => {
      'worklet';
      const max = Math.max(0, (mapWidth * s - containerWidth) / 2);
      return clamp(x, -max, max);
    };
    const clampY = (y: number, s: number) => {
      'worklet';
      const max = Math.max(0, (mapHeight * s - containerHeight) / 2);
      return clamp(y, -max, max);
    };

    const pinch = Gesture.Pinch()
      .onStart(event => {
        isPinching.value = true;
        pinchStart.value = {
          scale: scale.value,
          x: translateX.value,
          y: translateY.value,
          focalX: event.focalX - containerWidth / 2,
          focalY: event.focalY - containerHeight / 2,
        };
      })
      .onUpdate(event => {
        const start = pinchStart.value;
        const s = clamp(start.scale * event.scale, 1, MAX_SCALE);
        const ratio = s / start.scale;
        // Keep the point under the fingers under the fingers, following
        // them if they move while pinching.
        const focalX = event.focalX - containerWidth / 2;
        const focalY = event.focalY - containerHeight / 2;
        scale.value = s;
        translateX.value = clampX(focalX - (start.focalX - start.x) * ratio, s);
        translateY.value = clampY(focalY - (start.focalY - start.y) * ratio, s);
      })
      .onFinalize(() => {
        isPinching.value = false;
      });

    // Pans by deltas so it picks up smoothly after a pinch ends.
    const pan = Gesture.Pan()
      .averageTouches(true)
      .onStart(event => {
        panLast.value = {x: event.translationX, y: event.translationY};
      })
      .onUpdate(event => {
        const dx = event.translationX - panLast.value.x;
        const dy = event.translationY - panLast.value.y;
        panLast.value = {x: event.translationX, y: event.translationY};
        if (isPinching.value) {
          return;
        }
        translateX.value = clampX(translateX.value + dx, scale.value);
        translateY.value = clampY(translateY.value + dy, scale.value);
      });

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(event => {
        if (scale.value > 1) {
          scale.value = withTiming(1);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
          return;
        }
        // Zoom into the tapped point, centring it.
        const s = DOUBLE_TAP_SCALE;
        const x = event.x - containerWidth / 2;
        const y = event.y - containerHeight / 2;
        scale.value = withTiming(s);
        translateX.value = withTiming(clampX(-x * s, s));
        translateY.value = withTiming(clampY(-y * s, s));
      });

    return Gesture.Simultaneous(pinch, pan, doubleTap);
  }, [
    container,
    map,
    scale,
    translateX,
    translateY,
    pinchStart,
    panLast,
    isPinching,
  ]);

  // Zoom buttons for people who can't pinch; they zoom around the centre.
  useImperativeHandle(
    ref,
    () => {
      const zoomTo = (factor: number) => {
        if (!container || !map) {
          return;
        }
        const s = clamp(scale.value * factor, 1, MAX_SCALE);
        const ratio = s / scale.value;
        const maxX = Math.max(0, (map.width * s - container.width) / 2);
        const maxY = Math.max(0, (map.height * s - container.height) / 2);
        scale.value = withTiming(s);
        translateX.value = withTiming(
          clamp(translateX.value * ratio, -maxX, maxX),
        );
        translateY.value = withTiming(
          clamp(translateY.value * ratio, -maxY, maxY),
        );
      };
      return {
        zoomIn: () => zoomTo(ZOOM_STEP),
        zoomOut: () => zoomTo(1 / ZOOM_STEP),
      };
    },
    [container, map, scale, translateX, translateY],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value / RENDER_SCALE},
    ],
  }));

  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {width, height} = nativeEvent.layout;
    setContainer(previous =>
      previous?.width === width && previous?.height === height
        ? previous
        : {width, height},
    );
  };

  return (
    <GestureDetector gesture={gesture}>
      <View
        testID={'zoomable-world-map'}
        style={styles.container}
        onLayout={onLayout}>
        {container && map && (
          <Animated.View
            style={[
              styles.content,
              {
                width: map.width * RENDER_SCALE,
                height: map.height * RENDER_SCALE,
                // Centred, so scaling (around the view's centre) zooms
                // around the container's centre.
                left: (container.width - map.width * RENDER_SCALE) / 2,
                top: (container.height - map.height * RENDER_SCALE) / 2,
              },
              animatedStyle,
            ]}>
            <WorldMap {...props} width={map.width * RENDER_SCALE} />
          </Animated.View>
        )}
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
  },
});

export default ZoomableWorldMap;
