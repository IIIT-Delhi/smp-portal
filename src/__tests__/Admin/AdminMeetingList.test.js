import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminMeetingList from '../../components/dashboard/admin/meetings/AdminMeetingList';
import axios from 'axios';

describe(AdminMeetingList, () => {

        // Fetches meetings from backend and displays them
    it('should fetch meetings from backend and display them', async () => {
        // Mock the useAuth hook
        jest.mock('../../context/AuthContext', () => ({
            useAuth: jest.fn(() => ({
                userDetails: { id: 1, role: 'admin' }
            }))
        }));
    
        // Mock the axios post request
        jest.mock('axios', () => ({
            post: jest.fn(() => Promise.resolve({ status: 200, data: { previousMeeting: [], upcomingMeeting: [] } }))
        }));
    
        // Import the component
        const AdminMeetingList = require('../../components/dashboard/admin/meetings/AdminMeetingList').default;
    
        // Render the component
        const { getByText } = render(<AdminMeetingList />);

         // Wait for the asynchronous axios.post to resolve
        await screen.findByText('Upcoming Meetings');
    
        // Assert that the meetings are fetched and displayed
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/getMeetings/', JSON.stringify({ id: 1, role: 'admin' }));
        expect(getByText('Upcoming Meetings')).toBeInTheDocument();
        expect(getByText('Previous Meetings')).toBeInTheDocument();
    });


});
