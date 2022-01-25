import { model, Schema } from 'mongoose'

const todoSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

export default model('Todo', todoSchema)