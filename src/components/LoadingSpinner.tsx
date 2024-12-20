import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingSpinnerProps {
    color?: string;
    size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    color = '#007AFF',
    size = 'large'
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator 
                testID="loading-spinner"
                size={size} 
                color={color} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F3F5'
    }
});
