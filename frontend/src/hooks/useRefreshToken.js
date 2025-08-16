import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth, auth } = useAuth();

    const refresh = async () => {
        console.log(auth)
       // if(auth?.name){
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        console.log("Retrying request")
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, user: response.data.user,
                roles: response.data.roles,accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
        //}
        /*else{
            console.log("Not authorised")
        }*/
    }
    return refresh;
};

export default useRefreshToken;