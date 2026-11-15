import 'react-native-get-random-values';
import React, { useState, useContext } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RectButton } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { v4 as uuidv4 } from 'uuid';

import BigButton from '../components/BigButton';
import { AuthenticationContext } from '../context/AuthenticationContext';
import { getFromCache } from '../services/caching';
import { createEvent } from '../services/api';

export default function CreateEvent({ navigation }: StackScreenProps<any>) {
    const authenticationContext = useContext(AuthenticationContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('1');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [latitude, setLatitude] = useState('51.0447');
    const [longitude, setLongitude] = useState('-114.0719');

    const handleCreateEvent = async () => {
        if (
            !name.trim() ||
            !description.trim() ||
            !dateTime ||
            !Number.isFinite(Number(volunteersNeeded)) ||
            Number(volunteersNeeded) < 1 ||
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude))
        ) {
            Alert.alert('Validation Error', 'Please complete all fields correctly.');
            return;
        }

        if (dateTime <= new Date()) {
            Alert.alert('Validation Error', 'Please select a future date and time.');
            return;
        }

        const user = authenticationContext?.value;

        if (!user?.id) {
            Alert.alert('Error', 'User information is not available.');
            return;
        }

        setLoading(true);

        try {
            const accessToken = await getFromCache<string>('accessToken');

            await createEvent(
                {
                    id: uuidv4(),
                    name: name.trim(),
                    description: description.trim(),
                    dateTime: dateTime.toISOString(),
                    organizerId: user.id,
                    position: {
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                    },
                    volunteersNeeded: Number(volunteersNeeded),
                    volunteersIds: [],
                },
                accessToken
            );

            Alert.alert('Success', 'Event created successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('EventsMap'),
                },
            ]);
    } catch (error: any) {
    Alert.alert(
        'Error',
        error?.response?.data?.message ||
        error?.message ||
        JSON.stringify(error)
    );
} finally {
    setLoading(false);
}
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Event</Text>

            <Text style={styles.label}>Event Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter event name"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.description]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your event"
                multiline
            />

            <Text style={styles.label}>Date and Time</Text>
            <RectButton
                style={styles.dateButton}
                onPress={() => setDatePickerVisible(true)}
            >
                <Text style={styles.dateText}>
                    {dateTime ? dateTime.toLocaleString() : 'Select date and time'}
                </Text>
            </RectButton>

            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="datetime"
                minimumDate={new Date()}
                onConfirm={(date) => {
                    setDateTime(date);
                    setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
            />

            <Text style={styles.label}>Volunteers Needed</Text>
            <TextInput
                style={styles.input}
                value={volunteersNeeded}
                onChangeText={setVolunteersNeeded}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Latitude</Text>
            <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Longitude</Text>
            <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="decimal-pad"
            />

            <BigButton
                label={loading ? 'Creating...' : 'Create Event'}
                color="#00A3FF"
                disabled={loading}
                onPress={handleCreateEvent}
            />

            <View style={{ height: 16 }} />

            <BigButton
                label="Cancel"
                color="#4D6F80"
                onPress={() => navigation.goBack()}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#F2F3F5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#031A62',
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        color: '#4D6F80',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        fontSize: 15,
    },
    description: {
        height: 110,
        textAlignVertical: 'top',
    },
    dateButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    dateText: {
        color: '#4D6F80',
        fontSize: 15,
    },
});