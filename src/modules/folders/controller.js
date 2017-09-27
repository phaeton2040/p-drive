import Folder from './model';


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
        const folder = Folder.findOne({ _id: id });

        return res.status(200).json({
            error: false,
            contact: await folder
        });

    } catch(e) {
        return res.status(404)
            .json({ error: true, message: 'Folder not found' });
    }
};

export const getFolderByPath = async(req, res) => {
    const ancestors = req.params.path.split('/');
    const ancestorsIds = await Folder.find({name: ancestors}, {_id: 1})
        .then(results => results.map(a => a._id));
    console.log(ancestorsIds);
    const folders = await Folder.find({
        ancestors: ancestorsIds,
        parent: ancestorsIds[ancestorsIds.length - 1]
    });

    try {
        return res.status(200).json({ folders });
    } catch (e) {
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
        const folder = Folder.update({ _id: id }, { $set: {
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

    if (!id)
        return res.status(400).json({ error: true, message: 'No folder id specified' });

    Folder.findOne({ _id: id })
        .remove()
        .then(() => {
            res.status(200).json({ error: false });
        })
        .catch(e => {
            res.status(500).json({ error: true, message: e.message });
        });
}