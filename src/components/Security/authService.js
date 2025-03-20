import $ from 'jquery';
import { config } from '../../config';

const baseURL = config.baseURL;

export const refreshToken = (onSuccess, onError) => {
    let user = JSON.parse(localStorage.getItem("user"));
    
    if (!user?.refreshToken) {
        onError('No refresh token available');
        return;
    }

    $.ajax({
        method: 'POST',
        url: `${baseURL}/app/v1/security/refresh-token`,
        data: JSON.stringify({ refreshToken: user.refreshToken}),
        headers: {
            'x-auth-key': user.token,
            "content-type": "application/json",
        },
        success: function(response) {
            if (response.data.token) {
                user = {
                    ...user,
                    ...response.data
                }
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', JSON.stringify(response.data.token));
                onSuccess(user.token);
            } else {
                onError('Failed to refresh token');
            }
        },
        error: function(xhr) {
            onError(xhr.responseText || 'Failed to refresh token');
        }
    });
};