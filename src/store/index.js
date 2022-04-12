import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const notes = (state = [], action)=> {
  if(action.type === 'SET_NOTES'){
    return action.notes;
  }
  if(action.type === 'DESTROY_NOTE'){
    return state.filter(note => note.id !== action.id);
  }
  if(action.type === 'ADD_NOTE'){
    return [...state, action.note];
  }
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};
const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(token){
      let response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
      response = await axios.get('/api/notes', {
        headers:{
          authorization: token
        }
      })
      dispatch({ type: 'SET_NOTES', notes: response.data})
    }
  }
}

const deleteNote = (id) =>{
  return async(dispatch)=> {
    await axios.delete(`/api/notes/${id}`)
    store.dispatch({
      type: 'DESTROY_NOTE',
      id
    })
  }
}

const addNote = (newNote) =>{
  return async(dispatch)=> {
    const note = (await axios.post('/api/notes/', newNote)).data
    dispatch({
      type: 'ADD_NOTE',
      note
    })
  }
}

const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { attemptLogin, signIn, logout, deleteNote, addNote };

export default store