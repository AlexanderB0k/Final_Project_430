const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlebar = (e, onAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#name').value;
    const age = e.target.querySelector('#age').value;

    if (!name || !age) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age }, onAdded);
    return false;

}

const handleForm = (props) => {
    return (
        <form id="form"
            onSubmit={(e) => handlebar(e, props.triggerReload)}
            name="form"
            action="/maker"
            method="POST"
            className="form"
        >
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" name="name" placeholder="Rating Name" />
            <label htmlFor="age">Age: </label>
            <input id="age" type="number" min="0" name="age" />
            <input className="makeSubmit" type="submit" value="Make Rating" />
        </form>
    );
}

const createList = (props) => {
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
    const nodes = items.map((ratings) => {      
        return (
            <div key={ratings.id} className="rating">
                <img src="/assets/img/domoface.jpeg" alt="rating face" className="ratingFace" />
                <h3 className="ratingName">Name: {ratings.name}</h3>
                <h3 className="ratingAge">Age: {ratings.age}</h3>
            </div>
        );
    });

    return (
        <div className="list">
            {nodes}
        </div>
    );
}

const App = () => {
    const [reload, setReload] = useState(false);

    return (
        <div>
            <div id="makeRating">
                {handleForm({ triggerReload: () => setReload(!reload) })}
            </div>
            <div id="ratings">
                {createList({ reloadRatings: reload })}
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;