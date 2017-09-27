import mongoose, { Schema } from 'mongoose';

const FolderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ancestors: [Schema.Types.ObjectId],
    parent: Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('Folder', FolderSchema)