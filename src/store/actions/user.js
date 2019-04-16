import { 
    USER_LOGGED_IN, 
    USER_LOGGED_OUT, 
    USER_LOADED, 
    LOADING_USER 
} from './actionsTypes'
import { setMessage } from './message'
import axios from 'axios'

const authBaseUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
const API_KEY = 'AIzaSyBAizb9U4B19jt9jdUpYJd9dSL_6A-CO-o'

export const userLogged = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export const logout = () => {
    return {
        type: USER_LOGGED_OUT
    }
}

export const createUser = user => {
    return dispatch => {
        dispatch(loadingUser())
        axios.post(`${authBaseUrl}/signupNewUser?key=${API_KEY}`,{
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado!'
                }))
            })
            .then(res => {
                if (res.data.localId) {
                    axios.put(`/users/${res.data.localId}.json`, {
                        name: user.name
                    })
                        .catch(err => {
                            dispatch(setMessage({
                                title: 'Erro',
                                text: 'Ocorreu um erro na criação do usuário!'
                            }))
                        })
                        .then(() => {
                            dispatch(login(user))
                        })
                }
            })
    }
}

export const loadingUser = () => {
    return {
        type: LOADING_USER
    }
}

export const userLoaded = () => {
    return {
        type: USER_LOADED
    }
}

export const login = user => {
    return dispatch => {
        dispatch(loadingUser())
        axios.post(`${authBaseUrl}/verifyPassword?key=${API_KEY}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado!'
                }))
            })
            .then(res => {
                if (res.data.localId) {
                    user.token = res.data.idToken
                    axios.get(`/users/${res.data.localId}.json`)
                    .catch(err => {
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro inesperado!'
                        }))
                    })
                    .then(res => {
                        delete user.password
                        user.name = res.data.name
                        dispatch(userLogged(user))
                        dispatch(userLoaded())
                    })
                }
            })
    }
}