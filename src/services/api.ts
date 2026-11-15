import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:3333',
});

export const authenticateUser = (
    email: string,
    password: string
): Promise<AxiosResponse> => {
    return api.post('/login', { email, password });
};

export interface CreateEventData {
    id: string;
    name: string;
    description: string;
    dateTime: string;
    organizerId: string;
    position: {
        latitude: number;
        longitude: number;
    };
    volunteersNeeded: number;
    volunteersIds: string[];
}

export const createEvent = (
    event: CreateEventData,
    accessToken: string
): Promise<AxiosResponse> => {
    return api.post('/events', event, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
export const getEvents = (): Promise<AxiosResponse> => {
    return api.get('/events');
};