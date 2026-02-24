import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the task'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the task'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],// "enum" means it must be one of the exact words.
        default: 'To Do'
    },

    priority: {
        type:String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },

},
    { timestamps: true
}
);
export default mongoose.model('Task', taskSchema);