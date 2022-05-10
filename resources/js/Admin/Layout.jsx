import React, {useState, useContext, useEffect, useReducer} from 'react';
import Header from './Header.jsx';
import {AdminContext, initialState, adminReducer, resetState} from './reducer.jsx';
import { Notification, showNotify } from '../Components/Notification.jsx';

export default function Layout(children) {
  const [ state, dispatch ] = useReducer(adminReducer, initialState, resetState);

  const { notification: { position, type, header, message }} = children.props;

  // load notify from backend (page prop notification)
  useEffect(() => {
    if (message !== null) {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          position, type, header, message
        }
      });
      setTimeout(() => dispatch({type:'HIDE_NOTIFICATION'}), 3000);
    }
  }, [position, type, header, message]);

  return (
    <>
      <AdminContext.Provider value={{dispatch, state}}>
        <Header>
          {children}
        </Header>

        {state.notification.show && (
          <Notification
            position={state.notification.position}
            type={state.notification.type}
            header={state.notification.header}
            message={state.notification.message}
          />
        )}
      </AdminContext.Provider>
    </>
  );
}
