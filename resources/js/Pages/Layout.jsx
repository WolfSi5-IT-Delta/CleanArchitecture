/* This example requires Tailwind CSS v2.0+ */
import React, {useEffect, useReducer} from 'react';
import Header from './Header.jsx';
import { UserContext, initialState, userReducer, resetState } from './reducer.jsx';
import { Notification, NotificationContext } from '../Components/Notification.jsx';

export default function Layout(children) {
  const [ state, dispatch ] = useReducer(userReducer, initialState, resetState);
  const { notification: { position, type, header, message }} = children.props;
  const { errors } = children.props;

  // load notify from backend (page prop notification)
  useEffect(() => {
    // load from session
    let payload = { position, type, header, message }
    // load from page errors
    if (Object.values(errors).length) {
      payload = {
        position,
        type: 'fail',
        header: 'Error',
        message: Object.values(errors)
      }
    }

    if (payload.message !== null) {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload
      });
      setTimeout(() => dispatch({type:'HIDE_NOTIFICATION'}), 3000);
    }
  }, [position, type, header, message, errors]);

  return (
    <>
      <UserContext.Provider value={{dispatch, state}}>
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
      </UserContext.Provider>
    </>
  );

}
