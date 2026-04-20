/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('Message').classList.remove('hidden');
};

//This isn't working for some reason, but it should be similar to handleError
const handleSuccess = (message) => {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('Message2').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('Message').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

const hideError = () => {
    document.getElementById('Message').classList.add('hidden');
};

module.exports = {
    handleError,
    handleSuccess,
    sendPost,
    hideError,
};