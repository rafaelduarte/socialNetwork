import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.png';
import DeleteUser from './DeleteUser';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
      redirectToSignin: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user.photo
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${user._id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-3">Profile</h2>
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center">
            <img
              className="img-thumbnail mb-3"
              src={photoUrl}
              alt={user.name}
              style={{ height: '400px', width: 'auto' }}
            />
          </div>
          <div className="col-md-6">
            <div className="lead mt-2 mb-5">
              <p><strong>{user.name}</strong></p>
              <p><em><a href={`mailto:${user.email}`}>{user.email}</a></em></p>
              <p className='fs-6'>{`Joined on ${new Date(user.created).toDateString()}.`}</p>
              <p>{user.about}</p>
            </div>

            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
              <div className="d-inline-block">
                <Link
                  className="btn btn-success me-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
