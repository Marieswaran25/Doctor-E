import { SessionStorage } from '@Customtypes/sessionStorage';

export const getAccessTokenFromSessionStorage = () => {
    return localStorage.getItem(SessionStorage.ACCESS_TOKEN);
};
