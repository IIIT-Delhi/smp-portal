import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminMeetingList from '../../components/dashboard/admin/meetings/AdminMeetingList';

describe(AdminMeetingList, () => {

        // The function should fetch meetings from the backend API and display them on the page.
    it('should fetch meetings from the backend API and display them on the page', () => {
        // Mock the axios.post method to return a successful response with sample data
        jest.mock('axios');
        axios.post.mockResolvedValueOnce({ status: 200, data: { previousMeeting: [], upcomingMeeting: [] } });
    
        // Render the AdminMeetingList component
        const { getByText } = render(<AdminMeetingList />);
    
        // Assert that the meetings are displayed on the page
        expect(getByText('Upcoming Meetings')).toBeInTheDocument();
        expect(getByText('Previous Meetings')).toBeInTheDocument();
    });


        // The function should allow the user to delete a meeting and update the page accordingly.
    it('should allow the user to delete a meeting and update the page accordingly', async () => {
        // Mock the axios.post method to return a successful response
        jest.mock('axios');
        axios.post.mockResolvedValueOnce({ status: 200 });
    
        // Render the AdminMeetingList component
        const { getByText } = render(<AdminMeetingList />);
    
        // Find the delete button and click it
        const deleteButton = getByText('Delete');
        fireEvent.click(deleteButton);
    
        // Assert that the axios.post method was called with the correct parameters
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/deleteMeetingById/', JSON.stringify({ meetingId: 'meetingId' }));
    
        // Wait for the axios.post method to resolve
        await waitFor(() => {});
    
        // Assert that the fetchMeetings function was called to update the page
        expect(fetchMeetings).toHaveBeenCalled();
    });


        // The function should allow the user to edit a meeting and update the page accordingly.
    it('should allow the user to edit a meeting and update the page accordingly', async () => {
        // Mock the axios.post method to return a successful response
        jest.mock('axios');
        axios.post.mockResolvedValueOnce({ status: 200 });
    
        // Render the AdminMeetingList component
        const { getByText } = render(<AdminMeetingList />);
    
        // Find the edit button and click it
        const editButton = getByText('Edit');
        fireEvent.click(editButton);
    
        // Assert that the axios.post method was called with the correct parameters
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/editMeetingById/', JSON.stringify({ meetingId: 'meetingId', schedulerId: 'schedulerId', title: 'title', date: 'date', time: 'time', attendee: [], description: 'description' }));
    
        // Wait for the axios.post method to resolve
        await waitFor(() => {});
    
        // Assert that the fetchMeetings function was called to update the page
        expect(fetchMeetings).toHaveBeenCalled();
    });



    // edge case
    // The backend API returns an error or an empty response, the function should handle the error and display an appropriate message to the user.
    it('should handle backend API errors and display an appropriate message', async () => {
        // Mock the axios.post method to return an error response
        jest.mock('axios');
        axios.post.mockRejectedValueOnce(new Error('API Error'));
    
        // Render the AdminMeetingList component
        const { getByText } = render(<AdminMeetingList />);
    
        // Wait for the axios.post method to reject
        await waitFor(() => {});
    
        // Assert that the error message is displayed on the page
        expect(getByText('Error fetching meetings: Error: API Error')).toBeInTheDocument();
    });

    
        // The user is not logged in, the function should redirect to the login page.
    it('should redirect to the login page when the user is not logged in', () => {
        // Mock the useAuth hook to return null for userDetails
        jest.mock('../../../../context/AuthContext');
        useAuth.mockReturnValue({ userDetails: null });
    
        // Render the AdminMeetingList component
        const { history } = renderWithRouter(<AdminMeetingList />, { route: '/dashboard/admin/meetings' });
    
        // Assert that the user is redirected to the login page
        expect(history.location.pathname).toBe('/login');
    });


});
