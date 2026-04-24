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
            <h1>Is this food good?</h1>
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
                <div id="displayRating">
                    <h3>Star Rating: {rating.starRating}</h3>
                    <img className="ratingStar" src="/assets/img/starImage.png" alt="star" />
                </div>
            </div>
        );
    });

    return (
        <div className="list">
            {nodes}
        </div>
    );
};

const handleFoodPlace = async (e, onAdded) => {
    e.preventDefault();
    helper.hideError();

    const displayName = e.target.querySelector('#displayName').value;
    const description = e.target.querySelector('#description').value;
    const rating = e.target.querySelector('#rating').value;
    const photoFile = e.target.querySelector('#photo').files[0];

    if (!displayName || !description || !rating || !photoFile) {
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
            displayName,
            description,
            rating,
            photo: uploadResult.fileId,
        },
        onAdded,
        helper.handleSuccess('Food place added successfully!')
    );

    return false;
};

const FoodPlaceForm = (props) => {
    return (
        <form
            id="foodPlaceForm"
            onSubmit={(e) => handleFoodPlace(e, props.triggerReload)}
            name="foodPlaceForm"
            action="/foodPlace"
            method="POST"
            className="form"
        >
            <h1 className=''>Is this RIT food spot good???</h1>

            <label htmlFor="displayName">Name: </label>
            <input
                id="displayName"
                type="text"
                name="displayName"
                placeholder="Food Place Name"
            />

            <label htmlFor="description">Description: </label>
            <input
                id="description"
                type="text"
                name="description"
                placeholder="Restaurant or food description"
            />

            <label htmlFor="rating">Rating: </label>
            <input
                id="rating"
                type="number"
                min="0"
                max="5"
                name="rating"
                placeholder="0 to 5"
            />

            <label htmlFor="photo">Photo: </label>
            <input id="photo" type="file" name="photo" accept="image/*" />

            <input className="makeSubmit" type="submit" value="Add Food Place" />
        </form>
    );
};

const FoodPlaceList = (props) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const loadFromServer = async () => {
            const response = await fetch('/getFoodPlace');
            const result = await response.json();
            setItems(result.foodPlace);
        };

        loadFromServer();
    }, [props.reloadFoodPlace]);

    if (items.length === 0) {
        return (
            <div className="list">
                <h3 className="emptyRating">No Food Places Yet!</h3>
            </div>
        );
    }

    const nodes = items.map((foodPlace) => {
        return (
            <div key={foodPlace._id} className="foodplace">
                <img
                    src={`/retrieve?_id=${foodPlace.photo}`}
                    alt={foodPlace.displayName}
                    className="foodFace"
                />
                <h3>Name: {foodPlace.displayName}</h3>
                <h3>Description: {foodPlace.description}</h3>

                <div id="displayRating">
                    <h3>Rating: {foodPlace.rating}</h3>
                    <img className="ratingStar" src="/assets/img/starImage.png" alt="star" />
                </div>
            </div>
        );
    });

    return (
        <div className="list">
            {nodes}
        </div>
    );
};

const AdSpaceHorizontal = () => {
    <div class="Adspace-Horizontal">
        <img className="adSpaceHorizontal" src="/assets/img/adSpace.jpg" alt="ad" />
    </div>
}

const AdSpaceVertical = () => {
    <div class="Adspace-Vertical">
        <img className="adSpaceVertical" src="/assets/img/adSpace.jpg" alt="ad" />
    </div>
}

const handleProfile = async (e, onAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#profileName').value;
    const age = e.target.querySelector('#profileAge').value;
    const info = e.target.querySelector('#profileInfo').value;

    if (!name || !info || !age) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(
        e.target.action,
        {
            name,
            info,
            age
        },
        () => {
            helper.handleSuccess('Updated the Profile');
            onAdded();
        }
    );

    return false;
};


const ProfileForm = (props) => {
    return (
        <form
            id="profileForm"
            onSubmit={(e) => handleProfile(e, props.onSuccess)}
            name="profileForm"
            action="/saveProfile"
            method="POST"
            className="form"
        >
            <h1 className='titleForm'>Create your own Profile</h1>

            <label htmlFor="name">Name: </label>
            <input id="profileName" type="text" name="name" />

            <label htmlFor="age">Age: </label>
            <input id="profileAge" type="number" name="age" min="0" />

            <label htmlFor="info">Info: </label>
            <input id="profileInfo" type="text" name="info" rows="3" />

            <input type="submit" value="Save Profile" />

        </form>
    );
};


const ProfileDisplay = (props) => {
    const [profile, setProfile] = useState(null);

    const loadProfile = async () => {
        const response = await fetch('/getProfile');
        const data = await response.json();
        setProfile(data.profile);
    };

    useEffect(() => {
        loadProfile();
    }, [props.reload]);

    if (!profile) {
        return (
            <div className="profileCardempty">
                <h2 className='profileHeader'>No Profile Yet</h2>
                <p className='profileAge'>No Age</p>
                <p className='profileBody'>No info</p>
            </div>
        );
    }

    return (
        <div className="profileCard">
            <div className='ProfileContent'>
                <div className='ProfilePic'>
                    <img className="ProfileImage" src="/assets/img/blankProfile.png" alt="star" />
                </div>

                <div className='ProfileItems'>
                    <h2 className='profileHeader'>{profile.name}</h2>
                    <p className='profileAge'>Age: {profile.age}</p>
                    <p className='profileBody'>{profile.info}</p>

                </div>
            </div>

        </div>
    );
};
const App = () => {
    const [reload, setReload] = useState(false);
    const [reloadFoodPlace, setReloadFoodPlace] = useState(false);
    const [reloadProfile, setReloadProfile] = useState(false);

    return (
        <div>
            <div>
                <ProfileForm onSuccess={() => setReloadProfile(!reloadProfile)} />

                <ProfileDisplay reload={reloadProfile} />
            </div>
            <div id="makeRating">
                <HandleForm triggerReload={() => setReload(!reload)} />
            </div>

            <div id="makeFoodPlace">
                <FoodPlaceForm triggerReload={() => setReloadFoodPlace(!reloadFoodPlace)} />
            </div>

            <h1>Rating list</h1>
            <div id="ratings">
                <CreateList reloadRatings={reload} />
            </div>

            <h1>Food List </h1>
            <div id="foodPlaces">
                <FoodPlaceList reloadFoodPlace={reloadFoodPlace} />
            </div>

        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;