const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

// This file handles the login and signup forms, as well as the forgot password form.
const handleLogin = async (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
};


// The login window component
const LoginWindow = (props) => {
    return (
        <form
            id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />

            <button
                type="button"
                className="secondaryButton"
                onClick={() => props.showChangePassword()}
            >
                Change Password
            </button>
        </form>
    );
};

// The signup window component

const SignupWindow = (props) => {
    return (
        <form
            id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">Confirm Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

//handle Passowrd forgot form submission
const handlePasswordForgot = async (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#username').value;
    const oldPassword = e.target.querySelector('#oldPassword').value;
    const newPassword = e.target.querySelector('#newPassword').value;
    const newPassword2 = e.target.querySelector('#newPassword2').value;

    if (!username || !oldPassword || !newPassword || !newPassword2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPassword !== newPassword2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    if (newPassword === oldPassword) {
        helper.handleError('New password must be different from the old password!');
        return false;
    }

    helper.sendPost(
        e.target.action,
        {
            username,
            oldPassword,
            newPassword,
            newPassword2,
        },
        () => helper.handleSuccess('Password changed successfully!')
    );

    return false;
};

const ForgotPasswordForm = (props) => {
    return (
        <form
            id="forgotPasswordForm"
            onSubmit={handlePasswordForgot}
            name="forgotPasswordForm"
            action="/forgotPassword"
            method="POST"
            className="form"
        >
            <label htmlFor="username">Username: </label>
            <input
                id="username"
                type="text"
                name="username"
                placeholder="Username"
            />

            <label htmlFor="oldPassword">Current Password: </label>
            <input
                id="oldPassword"
                type="password"
                name="oldPassword"
                placeholder="Current Password"
            />

            <label htmlFor="newPassword">New Password: </label>
            <input
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="New Password"
            />

            <label htmlFor="newPassword2">Confirm New Password: </label>
            <input
                id="newPassword2"
                type="password"
                name="newPassword2"
                placeholder="Confirm New Password"
            />

            <input className="makeSubmit" type="submit" value="Change Password" />
        </form>
    );
};


const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    //Renders the login form, and passes a function to show the forgot password form when the user clicks the "Change Password" button.
    const renderLogin = () => {
        root.render(
            <LoginWindow
                showChangePassword={() =>
                    root.render(
                        <ForgotPasswordForm goBack={renderLogin} />
                    )
                }
            />
        );
    };

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        renderLogin();
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    renderLogin();
};
window.onload = init;