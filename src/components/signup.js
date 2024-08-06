import React, { Component } from 'react';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileImage: null
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    this.setState({ profileImage: event.target.files[0] });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password, profileImage } = this.state;

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Sign Up successful');
        window.location.reload();
      } else {
        const message = await response.text();
        alert(`Sign Up failed: ${message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Profile Image</label>
          <input
            type="file"
            className="form-control"
            onChange={this.handleFileChange}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </form>
    );
  }
}
