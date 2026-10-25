/*
 * Global Jest setup.
 *
 * Replaces modules that depend on native code with JavaScript test doubles
 * so that screens and components can be rendered in a Node environment.
 */

// AsyncStorage: in-memory implementation provided by the library.
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// react-native-maps: MapView and Marker are rendered as Views (testID "map-view" / "map-marker").
jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View } = require('react-native');

    class MockMapView extends React.Component {
        fitToCoordinates = jest.fn();
        render() {
            return React.createElement(View, { testID: 'map-view' }, this.props.children);
        }
    }

    const Marker = (props) => React.createElement(View, { testID: 'map-marker' }, props.children);

    return {
        __esModule: true,
        default: MockMapView,
        Marker,
        PROVIDER_GOOGLE: 'google',
    };
});

// react-native-keyboard-aware-scroll-view: replaced with ScrollView, as the
// original reads native platform constants that are undefined under Jest.
jest.mock('react-native-keyboard-aware-scroll-view', () => {
    const { ScrollView } = require('react-native');
    return { KeyboardAwareScrollView: ScrollView };
});

// @expo/vector-icons: Feather is rendered as Text containing the icon name.
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    const Feather = (props) => React.createElement(Text, null, props.name);
    Feather.glyphMap = {};
    return { Feather };
});
