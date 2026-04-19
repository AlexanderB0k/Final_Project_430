const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleRating = async (e, onAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#name').value;
    const originFood = e.target.querySelector('#originFood').value;
    const starRating = e.target.querySelector('#starRating').value;
    const photoFile = e.target.querySelector('#photo').files[0];

    if (!name || !originFood || !starRating || !photoFile) {
        helper.handleError('All fields are required!');
        return false;
    }

    const uploadData = new FormData();
    uploadData.append('sampleFile', photoFile);

    const uploadResponse = await fetch('/upload', {
        method: 'POST',
        body: uploadData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
        helper.handleError(uploadResult.error);
        return false;
    }

    helper.sendPost(
        e.target.action,
        {
            name,
            originFood,
            starRating,
            photo: uploadResult.fileId,
        },
        onAdded,
        helper.handleSuccess('Rating added successfully!')
    );

    return false;
};

const HandleForm = (props) => {
    return (
        <form
            id="form"
            onSubmit={(e) => handleRating(e, props.triggerReload)}
            name="form"
            action="/maker"
            method="POST"
            className="form"
        >
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" name="name" placeholder="Food Name" />

            <label htmlFor="originFood">Origin of the Food: </label>
            <input
                id="originFood"
                type="text"
                name="originFood"
                placeholder="Restaurant or Country"
            />

            <label htmlFor="starRating">Star Rating: </label>
            <input
                id="starRating"
                type="number"
                min="0"
                max="5"
                name="starRating"
                placeholder="0 to 5"
            />

            <label htmlFor="photo">Photo: </label>
            <input id="photo" type="file" name="photo" accept="image/*" />

            <input className="makeSubmit" type="submit" value="Make Rating" />
        </form>
    );
};

const CreateList = (props) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const loadFromServer = async () => {
            const response = await fetch('/getRatings');
            const result = await response.json();
            setItems(result.ratings);
        };

        loadFromServer();
    }, [props.reloadRatings]);

    if (items.length === 0) {
        return (
            <div className="list">
                <h3 className="emptyRating">No Ratings Yet!</h3>
            </div>
        );
    }

    const nodes = items.map((rating) => {
        return (
            <div key={rating._id} className="rating">
                <img
                    src={`/retrieve?_id=${rating.photo}`}
                    alt={rating.name}
                    className="ratingFace"
                />
                <h3>Name: {rating.name}</h3>
                <h3>Origin: {rating.originFood}</h3>
                <h3>Star Rating: {rating.starRating}</h3>
            </div>
        );
    });

    return (
        <div className="list">
            {nodes}
        </div>
    );
};

const handlePasswordChange = async (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPassword = e.target.querySelector('#oldPassword').value;
    const newPassword = e.target.querySelector('#newPassword').value;
    const newPassword2 = e.target.querySelector('#newPassword2').value;

    if (!oldPassword || !newPassword || !newPassword2) {
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
            oldPassword,
            newPassword,
            newPassword2,
        },
        onAdded(),
        () => helper.handleSuccess('Password changed successfully!')
    );

    return false;
};

const ChangePasswordForm = () => {
    return (
        <form
            id="changePasswordForm"
            onSubmit={handlePasswordChange}
            name="changePasswordForm"
            action="/changePassword"
            method="POST"
            className="form"
        >
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

//Create a profile for this user
const handleProfile = async (e, onAdded) => {
    e.preventDefault();
    helper.hideError();

    const displayName = e.target.querySelector('#displayName').value;
    const age = e.target.querySelector('#age').value;
    const description = e.target.querySelector('#description').value;
    const photoProfile = e.target.querySelector('#photoProfile').files[0];

    if (!displayName || !age || !description || !photoProfile) {
        helper.handleError('All fields are required!');
        return false;
    }

    const uploadData = new FormData();
    uploadData.append('sampleFile', photoProfile);

    const uploadResponse = await fetch('/upload', { method: 'POST', body: uploadData });

    if (!uploadResponse.ok) {
        helper.handleError('Failed to upload photo!');
        return false;
    }

    const uploadResult = await uploadResponse.json();

    helper.sendPost(
        e.target.action,
        { displayName, age, description, photo: uploadResult.fileId },
        onAdded,
        () => helper.handleSuccess('Profile created successfully!')
    );
    return false;
};

const ProfileForm = (props) => {
    const [preview, setPreview] = React.useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <form
            id="profileForm"
            onSubmit={(e) => handleProfile(e, props.triggerReload)}
            name="profileForm"
            action="/profile"
            method="POST"
            className="profile-form"
        >
            <div className="profile-form__photo-header">
                <div
                    className={`profile-form__avatar ${preview ? 'profile-form__avatar--filled' : ''}`}
                    onClick={() => document.getElementById('photoProfile').click()}
                >
                    {preview
                        ? <img src={preview} alt="preview" className="profile-form__avatar-img" />
                        : <span className="profile-form__avatar-placeholder">Upload</span>
                    }
                </div>
                <p className="profile-form__photo-hint">Click to upload a photo</p>
            </div>

            <div className="profile-form__fields">
                <div className="profile-form__field">
                    <label htmlFor="displayName" className="profile-form__label">Display name</label>
                    <input id="displayName" type="text" name="displayName" placeholder="How should we call you?" className="profile-form__input" />
                </div>
                <div className="profile-form__field">
                    <label htmlFor="age" className="profile-form__label">Age</label>
                    <input id="age" type="number" name="age" placeholder="Your age" className="profile-form__input" />
                </div>
                <div className="profile-form__field">
                    <label htmlFor="description" className="profile-form__label">About you</label>
                    <textarea id="description" name="description" placeholder="Tell us a bit about yourself..." rows={3} className="profile-form__textarea" />
                </div>

                <input id="photoProfile" type="file" name="photoProfile" accept="image/*" onChange={handlePhotoChange} className="profile-form__file-input" />

                <input type="submit" value="Create profile" className="profile-form__submit" />
            </div>
        </form>
    );
};

const ProfileList = (props) => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const load = async () => {
            const response = await fetch('/getProfiles');
            const result = await response.json();
            setProfiles(result.profiles);
        };
        load();
    }, [props.reloadProfiles]);

    if (profiles.length === 0) {
        return <div className="list"><h3>No Profile Yet!</h3></div>;
    }

    return (
        <div className="list">
            {profiles.map((profile) => (
                <div key={profile._id} className="profile">
                    <img src={`/retrieve?_id=${profile.photo}`} alt={profile.displayName} className="profilePhoto" />
                    <h3>Name: {profile.displayName}</h3>
                    <h3>Age: {profile.age}</h3>
                    <h3>About: {profile.description}</h3>
                </div>
            ))}
        </div>
    );
};

const App = () => {
    const [reload, setReload] = useState(false);

    return (
        <div>
            <div id="makeRating">
                <HandleForm triggerReload={() => setReload(!reload)} />
            </div>
            <div id="ratings">
                <CreateList reloadRatings={reload} />
            </div>

            <div id="changePassword">
                <ChangePasswordForm />
            </div>

            <div id="createProfile">
                <ProfileForm triggerReload={() => setReload(!reload)} />
            </div>

            <div id="profileList">
                <ProfileList reloadProfiles={reload} />
            </div>
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;