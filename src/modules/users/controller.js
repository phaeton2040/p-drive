import User from './model';
import Folder from '../folders/model';

export const createUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400)
            .json({err: true, message: 'email and password are required'});
    }

    try {
        const newUser = await new User({email}).setPassword(password).save();
        const newFolder = await new Folder({name: 'Home', ancestors: [], parent: null, user: newUser._id}).save();

        return res.status(201).json({ user: newUser.toAuthJSON(), folder: newFolder });
    } catch(e) {
        return res.status(500)
            .json({ error: true, message: e.message });
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400)
            .json({error: true, message: 'email and password are required'});
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400)
            .json({
                error: true,
                message: 'User not found'
            })
    }

    if (user.validPassword(password)) {
        return res.status(200)
            .json({
                user: user.toAuthJSON()
            });
    } else {
        return res.status(401)
            .json({
                error: true,
                message: 'Wrong password'
            });
    }
};

export const getUserInfo = async (req, res) => {
    res.json({
        auth: 'success',
        user: req.user.getInfo()
    })
};