import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { authenticate, signin } from '../auth';

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      redirectToReferer: false,
      loading: false,
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ error: '' });
    this.setState({ [field]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const { email, password } = this.state;
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) this.setState({ error: data.error, loading: false });
      else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  signinForm = (email, password) => (
    <form>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          onChange={this.handleChange('email')}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          onChange={this.handleChange('password')}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button
        onClick={this.clickSubmit}
        className="btn btn-primary mt-3"
      >
        Submit
      </button>
    </form>
  );

  render() {
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) return <Redirect to="/" />;

    return (
      <div className="container">
        <h2 className="mt-5 mb-3">Sign In</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {loading ? (
          <div className="p-5 text-center bg-light">
            <h2 className="mb-3">Loading...</h2>
          </div>
        ) : (
          ''
        )}

        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;
