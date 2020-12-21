import Axios from 'axios';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { IUser } from '../types';

interface IState {
    authenticated: boolean;
    user: IUser | undefined;
}

interface Action {
    type: string;
    payload: any;
}

const StateContext = createContext<IState>({
    authenticated: false,
    user: undefined,
});

const DispatchContext = createContext(null);

const reducer = (state: IState, { type, payload }: Action): IState => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                authenticated: true,
                user: payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                authenticated: false,
                user: null,
            };
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {
        authenticated: false,
        user: null,
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await Axios.get('/auth/me');
                dispatch({ type: 'LOGIN', payload: data });
            } catch (error) {
                console.log(error);
            }
        };

        loadUser();
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
