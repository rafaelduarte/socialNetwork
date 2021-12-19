import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../auth';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      open: false,
    };
  }

  handleChange = (field) => (event) => {
    this.setState({ error: '' });
    this.setState({ [field]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();

    const { name, email, password } = this.state;
    const user = { name, email, password };

    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          error: '',
          name: '',
          email: '',
          password: '',
          open: true,
        });
    });
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          onChange={this.handleChange('name')}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
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
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-3">Sign Up</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <div
          className="alert alert-success"
          style={{ display: open ? '' : 'none' }}
        >
          New account is successfully created. Please <Link to='/signin'>Sign In</Link>.
        </div>

        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
