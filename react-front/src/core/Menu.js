import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated, signout } from '../auth';

const isActive = (history, path) =>
  history.location.pathname === path ? 'active' : '';

const Menu = ({ history }) => (
  <div className="bg-light shadow-2">
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link className={`nav-link ${isActive(history, '/')}`} to="/">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link className={`nav-link ${isActive(history, '/users')}`} to="/users">
          Users
        </Link>
      </li>

      {!isAuthenticated() && (
        <>
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive(history, '/signin')}`}
              to="/signin"
            >
              Sign In
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${isActive(history, '/signup')}`}
              to="/signup"
            >
              Sign Up
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className="nav-item">
            <button
              className="nav-link text-danger"
              onClick={() => signout(() => history.push('/'))}
            >
              Sign Out
            </button>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${isActive(
                history,
                `/user/${isAuthenticated().user._id}`
              )}`}
              to={`/user/${isAuthenticated().user._id}`}
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
