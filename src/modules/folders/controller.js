import Folder from './model';
import { gfs } from '../../config/grid-fs-config';


export const createFolder = async (req, res) => {
    const { name } = req.body;
    const ancestors = req.body.ancestors ? req.body.ancestors.split(',') : [];
    const parent = ancestors ? ancestors[ancestors.length - 1] : null;

    const newFolder = new Folder({ name, ancestors, parent, user: req.user.id });

    try {
        return res.status(201).json({ folder: await newFolder.save() });
    } catch(e) {
        return res.status(500)
            .json({ error: true, message: e.message });
    }
};

export const getAllFolders = async (req, res) => {
    try {
        return res.status(200).json({
            folders: await Folder.find({})
        });
    } catch(e) {
        return res.status(500)
            .json({ error: true, message: e.message });
    }
};

export const getFolder = async (req, res) => {
    const { id } = req.params;

    if (!id)
        return res.status(400)
            .json({ error: true, message: 'No folder id specified' });

    try {
        const folder = await Folder.findOne({ _id: id, user: req.user.id });
        const childFolders = await Folder.find({ parent: id });
        const childFiles = await gfs.files.find({
            metadata: {
                user: req.user.id,
                folder: id
            }
        }).toArray();

        return res.status(200).json({
            error: false,
            folder: folder,
            children: {
                folders: childFolders,
                files: childFiles
            }
        });

    } catch(e) {
        return res.status(404)
            .json({ error: true, message: e });
    }
};

export const getFolderByPath = async (req, res) => {
    const ancestors = req.query.path.split('/');

    try {
        const ancestorsIds = await Folder.find({name: ancestors}, {_id: 1})
            .then(results => results.map(a => a._id));
        const parent = ancestorsIds[ancestorsIds.length - 1].toString();

        const folder = await Folder.findOne({ _id: parent });
        const childFolders = await Folder.find({
            user: req.user.id,
            parent
        });
        const childFiles = await gfs.files.find({
            metadata: {
                user: req.user.id,
                folder: parent
            }
        }).toArray();

        return res.status(200).json({
            error: false,
            folder: folder,
            children: {
                folders: childFolders,
                files: childFiles
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(404)
            .json({ error: true, message: 'Folder not found' });
    }
};

export const editFolder = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!id)
        return res.status(400)
            .json({ error: true, message: 'No folder id specified' });

    try {
        const folder = Folder.update({ _id: id, user: req.user.id }, { $set: {
            name
        }});

        return res.status(200).json({
            folder: await folder
        });

    } catch(e) {
        return res.status(404)
            .json({ error: true, message: 'Folder not found' });
    }
};

export const removeFolder = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: true, message: 'No folder id specified' });
    }

    Folder.findOne({ _id: id, user: req.user.id })
        .remove()
        .then(() => {
            res.status(200).json({ error: false });
        })
        .catch(e => {
            res.status(500).json({ error: true, message: e.message });
        });
}