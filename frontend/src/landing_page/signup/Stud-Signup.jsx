import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Stud_SignUp = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    username: '',
  });

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: 'bottom-left',
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: 'bottom-right',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:3002/signup',
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
      handleError("Signup failed. Please try again.");
    }

    setInputValue({
      email: '',
      password: '',
      username: '',
    });
  };

  return (
    <div className="container mt-5">
      <Row>
        {/* Register Section */}
        <Col md={6}>
          <h2 className="fw-bold text-center mb-4" style={{ color: '#001f3f' }}>Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formRegisterName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="username"
                value={username}
                onChange={handleOnChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={handleOnChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={handleOnChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label={<>I agree to the AI Voice Detector <a href="#" style={{ color: '#3b82f6' }}>user agreement</a></>}
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                type="submit"
                style={{ backgroundColor: '#3b82f6', border: 'none', padding: '8px 20px' }}
              >
                Create an Account
              </Button>
            </div>
          </Form>
        </Col>

        {/* Login Section */}
        <Col md={6}>
          <h2 className="fw-bold text-center mb-0" style={{ color: '#001f3f' }}>Log in</h2>
          <p className="text-center mb-4" style={{ fontWeight: '500' }}>If You Already Have an Account</p>
          <Form>
            <Form.Group className="mb-3" controlId="formLoginEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formLoginPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>

            <div className="mb-3 text-end">
              <a href="#" style={{ color: '#3b82f6', fontSize: '14px' }}>Forgot password?</a>
            </div>

            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                type="submit"
                style={{ backgroundColor: '#3b82f6', border: 'none', padding: '8px 32px' }}
              >
                Log in
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Stud_SignUp;
