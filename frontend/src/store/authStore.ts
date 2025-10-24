import { User } from '@/lib/types'
import { getWithAuth, postWithoutAuth } from '@/services/httpService';
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface AuthState {
    user : User | null;
    token : string | null;
    loading : boolean;
    error : string | null;
    isAuthenticated : boolean;

    // Actions 
    setUser : (user : User, token : string) => void;
    clearError : () => void;
    logout : () => void;

    // API actions
    loginDoctor : (email : string, password: string) => Promise<void>;
    loginPatient : (email : string, password: string) => Promise<void>;
    registerDoctor : (data : any) => Promise<void>;
    registerPatient : (data : any) => Promise<void>;
    fetchProfile : () => Promise<User | null>;
    updateProfile : (data : any) => Promise <void>;
}


export const useAuthStore = create<AuthState>()(
    persist ((set,get) => ({
        user: null,
        token : null,
        loading: false,
        error : null,
        isAuthenticated : false,

        setUser : (user, token) => {
            set({
                user, token, isAuthenticated : true, error : null
            })
        },
        clearError : () => set({error : null}),

        logout : () => {
            localStorage.removeItem('token');
            set({
                user : null, token : null, isAuthenticated : false, error:null
            })
        },


        loginDoctor : async (email, password) => {
            set({loading : true, error : null})

            try {
                const response = await postWithoutAuth('/auth/doctor/login', {email, password})
                get().setUser(response.data.user, response.data.token)
            } catch (error) {
                set({error : error.message})
                throw error;
            }finally{
                set({loading : false})
            }
        },

        loginPatient : async (email, password) => {
            set({loading : true, error : null})

            try {
                const response = await postWithoutAuth('/auth/patient/login', {email, password})
                get().setUser(response.data.user, response.data.token)
            } catch (error) {
                set({error : error.message})
                throw error;
            }finally{
                set({loading : false})
            }
        },

        registerDoctor : async (data) => {
            set({loading : true, error : null})

            try {
                const response = await postWithoutAuth('/auth/doctor/register', {data})
                get().setUser(response.data.user, response.data.token)
            } catch (error) {
                set({error : error.message})
                throw error;
            }finally{
                set({loading : false})
            }
        },

        registerPatient : async (data) => {
            set({loading : true, error : null})

            try {
                const response = await postWithoutAuth('/auth/patient/register', {data})
                get().setUser(response.data.user, response.data.token)
            } catch (error) {
                set({error : error.message})
                throw error;
            }finally{
                set({loading : false})
            }
        },

        fetchProfile : async () : Promise <User | null> => {
            set({loading : true, error : null});

            try {
                const {user} = get()
                if (!user) throw new Error("No Usr Found!")
                const endPoint = user.type === 'doctor' ? 'doctor/me' : 'patient/me';
                
                const response = await getWithAuth(endPoint)
                set({user : {...user, ...response.data}})
            } catch (error) {
                
            }
        }
    }))
)