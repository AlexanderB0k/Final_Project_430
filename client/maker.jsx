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
            action="/foodPlace"
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
                <div>
                <h3>Star Rating: {rating.starRating} </h3>
                <img id="ratingStar" src="/assets/img/star.jpg" alt="star" />
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

        <h1>Is this RIT food spot good???</h1>
        
        <label htmlFor="photo">Photo: </label>
            <input id="photo" type="file" name="photo" accept="image/*" />

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
                <h3>Rating: {foodPlace.rating}</h3>
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
    const [reloadFoodPlace, setReloadFoodPlace] = useState(false);

    return (
        <div>
            <div id="makeRating">
                <HandleForm triggerReload={() => setReload(!reload)} />
            </div>            
            
            <div id="makeFoodPlace">
                <FoodPlaceForm triggerReload={() => setReloadFoodPlace(!reloadFoodPlace)} />
            </div>

            <div id="ratings">
                <CreateList reloadRatings={reload} />
            </div>

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