import { SET_MESSAGE } from './actionsTypes'

export const setMessage = message => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}