import { render, screen } from '@testing-library/react-native';
import React from 'react';
import EventsMap from '../src/pages/EventsMap';

describe('EventsMap', () => {
    it('MAP-01 shows the number of events in the footer', () => {
        render(<EventsMap navigation={{} as any} route={{} as any} />);

        expect(screen.getAllByTestId('map-marker')).toHaveLength(4);
        expect(screen.getByText('4 event(s) found')).toBeTruthy();
    });
});
