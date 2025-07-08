import { SessionStorage } from '@Customtypes/sessionStorage';

export const getAccessTokenFromSessionStorage = () => {
    return sessionStorage.getItem(SessionStorage.ACCESS_TOKEN);
};
