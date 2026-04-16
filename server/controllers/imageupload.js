const File = require('../models/imageupload.js');

// A simple handler for rendering the upload page
const uploadPage = (req, res) => {
    res.render('upload');
};

const uploadFile = async (req, res) => {
    if (!req.files || !req.files.sampleFile) {
        return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { sampleFile } = req.files;


    try {
        const newFile = new File(sampleFile);
        const doc = await newFile.save();
        return res.status(201).json({
            message: 'File stored successfully!',
            fileId: doc._id,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: 'Something went wrong uploading file!',
        });
    }
};

const retrieveFile = async (req, res) => {
    /* First ensure that the user gave us an _id. Remember that req.query
       is populated by bodyParser if there are query parameters with the
       request.
  
       If they don't send us an _id, we can't look up the file so we will
       send them an error instead.
    */
    if (!req.query._id) {
        return res.status(400).json({ error: 'Missing file id!' });
    }

    /* If we have a file id from the user, we can attempt to find the file.
       One of three things can happen. 1) There is an error contacting the
       database (which will send us to the catch statement). 2) The database
       responds but finds no file with that id. 3) The database finds the file.
    */
    let doc;
    try {
        // First we attempt to find the file by the _id sent by the user.
        doc = await File.findOne({ _id: req.query._id }).exec();
    } catch (err) {
        // If we have an error contacting the database, let the user know something happened.
        console.log(err);
        return res.status(400).json({ error: 'Something went wrong retrieving file!' });
    }

    // Below the catch, we know our request has been successful.

    /* If the database sends us a result but it is empty, that means that
       there is no file with that _id in the database. In that case, we
       can send a 404 to the user and say that resource doesn't exist.
    */
    if (!doc) {
        return res.status(404).json({ error: 'File not found!' });
    }

    /* If we have made it this far in the try statement, we have not hit
       an error AND our doc object contains a file. If that is the case,
       we want to set a few headers to let the browser know some info about
       the file we are sending it.
    */
    res.set({
        // Content-Type tells the browser what type of file it is (png, mp3, zip, etc)
        'Content-Type': doc.mimetype,

        // Content-Length tells it how many bytes long it is.
        'Content-Length': doc.size,

        'Content-Disposition': `filename="${doc.name}"`, /* `attachment; filename="${doc.name}"` */
    });

    /* Finally once we have set the headers, we can write the actual image data to
       the response and send it back to the user. With the above headers set, the
       browser will know how to properly interpret the data (which is just binary).
    */
    return res.send(doc.data);
};

module.exports = {
    uploadPage,
    uploadFile,
    retrieveFile,
};