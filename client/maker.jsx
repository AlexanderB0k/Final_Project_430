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
        onAdded
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

//Create your profile
const handleProfile = (props) => {
    e.preventDefault();
    helper.hideError();

    const displayName = e.target.querySelector('#displayName').value;
    const 


    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;

}

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
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    const profile = createRoot(document.getElementById('Profile'));

    profile.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    root.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    root.render(<App />);
};

window.onload = init;