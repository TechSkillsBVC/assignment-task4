import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders correctly', () => {
        const { getByTestId } = render(<LoadingSpinner />);
        expect(getByTestId('loading-spinner')).toBeTruthy();
    });

    it('accepts custom color prop', () => {
        const { getByTestId } = render(<LoadingSpinner color="#FF0000" />);
        const spinner = getByTestId('loading-spinner');
        expect(spinner.props.color).toBe('#FF0000');
    });

    it('accepts custom size prop', () => {
        const { getByTestId } = render(<LoadingSpinner size="small" />);
        const spinner = getByTestId('loading-spinner');
        expect(spinner.props.size).toBe('small');
    });
});
