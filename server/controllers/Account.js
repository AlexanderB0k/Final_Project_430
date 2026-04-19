const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    res.render('login');
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const password = `${req.body.pass}`;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    Account.authenticate(username, password, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/maker' });
    });
}

const changePassword = async (req, res) => {
    const oldPassword = `${req.body.oldPassword}`;
    const newPassword = `${req.body.newPassword}`;
    const newPassword2 = `${req.body.newPassword2}`;

    if (!oldPassword || !newPassword || !newPassword2) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (newPassword !== newPassword2) {
        return res.status(400).json({ error: 'New passwords do not match' });
    }
    if (newPassword === oldPassword) {
        return res.status(400).json({ error: 'New password must be different from the old password' });
    }

    try {
        const accountId = req.session.account._id || req.session.account.id;
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        Account.authenticate(account.username, oldPassword, async (err, authenticatedAccount) => {
            if (err || !authenticatedAccount) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            try {
                const hash = await Account.generateHash(newPassword);

                // Update the account's password with the new hash and return the updated account
                //I looked at this documentation for findByIdAndUpdate: https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
                await Account.findByIdAndUpdate(
                    accountId,
                    { $set: { password: hash } },
                    { new: true }
                );

                return res.json({ message: 'Password changed successfully' });
            } catch (saveErr) {
                console.error(saveErr);
                return res.status(500).json({ error: 'An error occurred while changing the password' });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while changing the password' });
    }
};


const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const password = `${req.body.pass}`;
    const password2 = `${req.body.pass2}`;

    if (!username || !password || !password2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hash = await Account.generateHash(password);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(500).json({ error: 'An error occurred while creating the account' });

    }


}


// change the password of the user 

module.exports = {
    loginPage,
    logout,
    login,
    signup,
    changePassword,
};