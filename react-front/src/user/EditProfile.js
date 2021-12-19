import { MDBSpinner } from 'mdb-react-ui-kit';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import DefaultProfile from '../images/avatar.png';

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      name: '',
      email: '',
      about: '',
      password: '',
      error: '',
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          password: '',
          error: '',
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({ error: 'File size should be less than 100 Kb' });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: 'Name is required' });
      return false;
    }
    if (email.length === 0) {
      this.setState({ error: 'Email is required' });
      return false;
    }
    if (!/.+@.+\..+/.test(email)) {
      this.setState({ error: 'Invalid email format' });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: 'Password must be at least 6 characters long' });
      return false;
    }
    if (password.length >= 1 && !/\d+/.test(password)) {
      this.setState({ error: 'Password must contain at least one number' });
      return false;
    }

    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    const fileSize = name === 'photo' ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickUpdate = (event) => {
    event.preventDefault();

    if (this.isValid()) {
      this.setState({ loading: true });

      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
      });
    }
  };

  signupForm = (name, email, about, password) => (
    <form>
      <div className="mb-3">
        <label className="form-label">Profile Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
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
        <label className="form-label">About Me</label>
        <textarea
          onChange={this.handleChange('about')}
          type="text"
          className="form-control"
          value={about}
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
      <button onClick={this.clickUpdate} className="btn btn-primary mt-3">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      about,
      password,
      error,
      redirectToProfile,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-3">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {loading ? (
          <div className="p-5 text-center bg-light">
            <MDBSpinner grow color="primary">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          </div>
        ) : (
          ''
        )}

        {loading ? (
          ''
        ) : (
          <img
            className="img-thumbnail mb-3"
            src={photoUrl}
            alt={name}
            style={{ height: '200px', width: 'auto' }}
          />
        )}

        {loading ? '' : this.signupForm(name, email, about, password)}
      </div>
    );
  }
}

export default EditProfile;
