import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote, addNote } from './store';

class Notes extends Component {
  constructor(){
    super();
    this.state = {
      text: '',
    }
  }
  render(){
    const { notes, auth, addNote } = this.props;
    const { text } = this.state;
    const Change = (ev) =>{
      this.setState({
        [ev.target.name]: ev.target.value
      })
    }
    return (
      <div>
        <Link to='/home'>Home</Link>
        <form onSubmit={(ev)=>{
          ev.preventDefault();
          const note = {...this.state, userId: auth.id };
          addNote(note)
          this.setState({
            text: ''
          })
        }}>
          <input name = 'text' value = { text } onChange = { Change }/>
          <button>Add Note</button>
        </form>
  
        <div>
          {notes.map((note, idx) =>{
            return (
              <div key = {note.id}>
                <h3>Note {idx + 1}
                <button onClick={deleteNote(note.id)}>Delete Note </button>
                </h3> 
                {note.txt}
              </div>
            )
          })}
        </div>
      </div>
    );
  }
};

const mapState = state => state;
const mapDispatch = (dispatch)=> {
  return {
    deleteNote: (id)=> {
      return dispatch(deleteNote(id))
    },
    addNote: (note, history)=> {
      return dispatch(addNote(note))
    }
  }
}

export default connect(mapState, mapDispatch)(Notes);
