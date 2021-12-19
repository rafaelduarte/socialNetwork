import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '.';

const PrivateRoute = ({ component: Component, ...rest }) => (
  // props means components passed down to this private route component
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
