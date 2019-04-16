import { 
        SET_POSTS, 
        ADD_COMMENT, 
        CREATING_POST, 
        POST_CREATED 
    } from './actionsTypes'
import { setMessage } from './message'
import axios from 'axios'

export const addPost = post => {
    return (dispatch, getState) => {
        dispatch(creatingPost())
        axios({
            url: 'uploadImage',
            baseURL: 'https://us-central1-lambe-833d4.cloudfunctions.net',
            method: 'post',
            data: {
                image: post.image.base64
            }
        })  
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado!'
                }))
            })
            .then(resp => {
                post.image = resp.data.imageUrl
                axios.post(`/posts.json?auth=${getState().user.token}`, { ...post })
                    .catch(err => {
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro ao fazer a postagem'
                        }))
                    })
                    .then(res => {
                        dispatch(fetchPosts())
                        dispatch(postCreated())
                    })
            })
        
    }
}

export const addComment = payload => {
   return (dispatch, getState) => {
       axios.get(`/posts/${payload.postId}.json`)
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um problema na hora de receber o Id da postagem'
                }))
            })
            .then(res => {
                const comments = res.data.comments || []
                comments.push(payload.comment)
                axios.patch(`/posts/${payload.postId}.json?auth=${getState().user.token}`, { comments })
                .catch(err => {
                    dispatch(setMessage({
                        title: 'Erro',
                        text: 'Ocorreu um problema na hora de adicionar o comentário no banco de dados!'
                    }))
                })
                .then(res => {
                    dispatch(fetchPosts())
                })
            })
   }
}

export const setPosts = posts => {
    return {
        type: SET_POSTS,
        payload: posts
    }
}

export const fetchPosts = () => {
    return dispatch => {
        axios.get('/posts.json')
            .catch(err => {
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um problema na hora de obter os posts!'
                }))
            })
            .then( res => {
                const rawPosts = res.data
                const posts = []
                for (let key in rawPosts) {
                    posts.push({
                        ...rawPosts[key],
                        id: key
                    })
                }

                dispatch(setPosts(posts.reverse()))
            })
    }
}

export const creatingPost = () => {
    return {
        type: CREATING_POST
    }
}

export const postCreated = () => {
    return {
        type: POST_CREATED
    }
}
