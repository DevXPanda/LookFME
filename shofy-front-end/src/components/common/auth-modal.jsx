'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Link from "next/link";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "./error-msg";
import { useLoginUserMutation, useRegisterUserMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import GoogleSignUp from "../login-register/google-sign-up";

// login schema
const loginSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

// register schema
const registerSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const AuthModal = ({ isOpen, onClose, redirectTo }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
    reset: resetLogin,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Register form
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    reset: resetRegister,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  // Handle login
  const onLoginSubmit = (data) => {
    loginUser({
      email: data.email,
      password: data.password,
    }).then((result) => {
      if (result?.data?.status === "success") {
        notifySuccess("Login successfully");
        resetLogin();
        onClose();
        // Clear session storage to allow modal to show again if needed
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('authModalShown');
        }
        if (redirectTo && redirectTo !== '/') {
          router.push(redirectTo);
        } else {
          router.push("/");
        }
      } else {
        notifyError(
          result?.error?.data?.error || result?.data?.error || "Login failed"
        );
      }
    });
  };

  // Handle register
  const onRegisterSubmit = (data) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((result) => {
      if (result?.data?.status === "success") {
        notifySuccess(result?.data?.message || "Registration successful! You can now login.");
        resetRegister();
        setActiveTab('login');
        // Auto-login after successful registration
        setTimeout(() => {
          loginUser({
            email: data.email,
            password: data.password,
          }).then((loginResult) => {
            if (loginResult?.data?.status === "success") {
              notifySuccess("Login successfully");
              onClose();
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('authModalShown');
              }
              if (redirectTo && redirectTo !== '/') {
                router.push(redirectTo);
              } else {
                router.push("/");
              }
            }
          });
        }, 500);
      } else {
        notifyError(
          result?.error?.data?.error || result?.error?.message || "Registration failed"
        );
      }
    });
  };

  // Close modal if user is authenticated
  React.useEffect(() => {
    if (user?.name && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tp-auth-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tp-auth-modal-content" style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '40px'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #eee' }}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '15px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'login' ? '2px solid #F875AA' : 'none',
              color: activeTab === 'login' ? '#F875AA' : '#666',
              cursor: 'pointer',
              fontWeight: activeTab === 'login' ? 'bold' : 'normal'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '15px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'register' ? '2px solid #F875AA' : 'none',
              color: activeTab === 'register' ? '#F875AA' : '#666',
              cursor: 'pointer',
              fontWeight: activeTab === 'register' ? 'bold' : 'normal'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Login to LookFame</h3>
              <p style={{ color: '#666' }}>
                {"Don't have an account?"} {" "}
                <span
                  onClick={() => setActiveTab('register')}
                  style={{ color: '#F875AA', cursor: 'pointer' }}
                >
                  Create an account
                </span>
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <GoogleSignUp />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              <p>or Sign in with Email</p>
            </div>

            <form onSubmit={handleSubmitLogin(onLoginSubmit)}>
              <div className="tp-login-input-wrapper">
                <div className="tp-login-input-box">
                  <div className="tp-login-input">
                    <input
                      {...registerLogin("email", { required: `Email is required!` })}
                      name="email"
                      id="modal-email"
                      type="email"
                      placeholder="Lookfame@mail.com"
                    />
                  </div>
                  <div className="tp-login-input-title">
                    <label htmlFor="modal-email">Your Email</label>
                  </div>
                  <ErrorMsg msg={errorsLogin.email?.message} />
                </div>
                <div className="tp-login-input-box">
                  <div className="p-relative">
                    <div className="tp-login-input">
                      <input
                        {...registerLogin("password", { required: `Password is required!` })}
                        id="modal-password"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 character"
                      />
                    </div>
                    <div className="tp-login-input-eye">
                      <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <CloseEye /> : <OpenEye />}
                      </span>
                    </div>
                    <div className="tp-login-input-title">
                      <label htmlFor="modal-password">Password</label>
                    </div>
                  </div>
                  <ErrorMsg msg={errorsLogin.password?.message} />
                </div>
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Link href="/forgot" style={{ color: '#F875AA' }}>Forgot Password?</Link>
              </div>
              <div className="tp-login-bottom">
                <button type="submit" className="tp-login-btn w-100">
                  Login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Sign Up to LookFame</h3>
              <p style={{ color: '#666' }}>
                Already have an account?{" "}
                <span
                  onClick={() => setActiveTab('login')}
                  style={{ color: '#F875AA', cursor: 'pointer' }}
                >
                  Sign In
                </span>
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <GoogleSignUp />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              <p>or Sign up with Email</p>
            </div>

            <form onSubmit={handleSubmitRegister(onRegisterSubmit)}>
              <div className="tp-login-input-wrapper">
                <div className="tp-login-input-box">
                  <div className="tp-login-input">
                    <input
                      {...registerRegister("name", { required: `Name is required!` })}
                      name="name"
                      id="modal-name"
                      type="text"
                      placeholder="look fame"
                    />
                  </div>
                  <div className="tp-login-input-title">
                    <label htmlFor="modal-name">Your Name</label>
                  </div>
                  <ErrorMsg msg={errorsRegister.name?.message} />
                </div>
                <div className="tp-login-input-box">
                  <div className="tp-login-input">
                    <input
                      {...registerRegister("email", { required: `Email is required!` })}
                      name="email"
                      id="modal-register-email"
                      type="email"
                      placeholder="Lookfame@mail.com"
                    />
                  </div>
                  <div className="tp-login-input-title">
                    <label htmlFor="modal-register-email">Your Email</label>
                  </div>
                  <ErrorMsg msg={errorsRegister.email?.message} />
                </div>
                <div className="tp-login-input-box">
                  <div className="p-relative">
                    <div className="tp-login-input">
                      <input
                        {...registerRegister("password", { required: `Password is required!` })}
                        id="modal-register-password"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 character"
                      />
                    </div>
                    <div className="tp-login-input-eye">
                      <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <CloseEye /> : <OpenEye />}
                      </span>
                    </div>
                    <div className="tp-login-input-title">
                      <label htmlFor="modal-register-password">Password</label>
                    </div>
                  </div>
                  <ErrorMsg msg={errorsRegister.password?.message} />
                </div>
              </div>
              <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
                <div className="tp-login-remeber">
                  <input
                    {...registerRegister("remember", {
                      required: `Terms and Conditions is required!`,
                    })}
                    id="modal-remember"
                    name="remember"
                    type="checkbox"
                  />
                  <label htmlFor="modal-remember">
                    I accept the terms of the Service & <a href="#">Privacy Policy</a>.
                  </label>
                  <ErrorMsg msg={errorsRegister.remember?.message} />
                </div>
              </div>
              <div className="tp-login-bottom">
                <button type="submit" className="tp-login-btn w-100">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

