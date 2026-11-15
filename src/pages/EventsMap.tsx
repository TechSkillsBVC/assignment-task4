import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';

import * as MapSettings from '../constants/MapSettings';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';
import { getEvents } from '../services/api';

interface Event {
    id: string;
    name: string;
    description: string;
    dateTime: string;
    organizerId: string;
    volunteersNeeded: number;
    volunteersIds: string[];
    position: {
        latitude: number;
        longitude: number;
    };
}

export default function EventsMap(props: StackScreenProps<any>) {
    const { navigation } = props;
    const authenticationContext = useContext(AuthenticationContext);
    const mapViewRef = useRef<MapView>(null);

    const [events, setEvents] = useState<Event[]>([]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadEvents = async () => {
                try {
                    const response = await getEvents();

                    const futureEvents: Event[] = response.data.filter(
                        (event: Event) =>
                            new Date(event.dateTime).getTime() > Date.now()
                    );
if (isActive) {
    setEvents(futureEvents);

    if (futureEvents.length > 0) {
        setTimeout(() => {
            mapViewRef.current?.fitToCoordinates(
                futureEvents.map(({ position }) => ({
                    latitude: position.latitude,
                    longitude: position.longitude,
                })),
                {
                    edgePadding: MapSettings.EDGE_PADDING,
                    animated: true,
                }
            );
        }, 500);
    }
}
                } catch (error) {
                    console.log('LOAD EVENTS ERROR:', error);
                }
            };

            loadEvents();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleNavigateToCreateEvent = () => {
        navigation.navigate('CreateEvent');
    };

    const handleNavigateToEventDetails = () => {};

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['userInfo', 'accessToken']);
        authenticationContext?.setValue(undefined);
        navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
});
    };

    const handleMapReady = () => {
    setTimeout(() => {
        if (events.length > 0 && mapViewRef.current) {
            mapViewRef.current.fitToCoordinates(
                events.map((event) => ({
                    latitude: event.position.latitude,
                    longitude: event.position.longitude,
                })),
                {
                    edgePadding: MapSettings.EDGE_PADDING,
                    animated: true,
                }
            );
        }
    }, 1000);
};

    return (
        <View style={styles.container}>
           <MapView
    ref={mapViewRef}
mapType="standard"
    initialRegion={{
        latitude: 51.0447,
        longitude: -114.0719,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }}
    style={styles.mapStyle}
>
   
    <Marker
    coordinate={{
        latitude: 51.0447,
        longitude: -114.0719,
    }}
    title="Test Marker"
    description="Calgary Test Location"
    pinColor="red"
/>

    {events.map((event) => (
    <Marker
        key={event.id}
        coordinate={event.position}
        title={event.name}
        description={event.description}
        onCalloutPress={() => handleNavigateToEventDetails()}
    />
))}
</MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {events.length} event(s) found
                </Text>

                <RectButton
                    style={[styles.smallButton, { backgroundColor: '#00A3FF' }]}
                    onPress={handleNavigateToCreateEvent}
                >
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>

            <RectButton
                style={[
                    styles.logoutButton,
                    styles.smallButton,
                    { backgroundColor: '#4D6F80' },
                ]}
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#FFF" />
            </RectButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    mapStyle: {
        ...StyleSheet.absoluteFillObject,
    },

    logoutButton: {
        position: 'absolute',
        top: 70,
        right: 24,
        elevation: 3,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 56,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    smallButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});