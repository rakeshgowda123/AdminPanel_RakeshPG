import mongoose from 'mongoose';

const listItemSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
    },
    uploadBatch: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ListItem = mongoose.model('ListItem', listItemSchema);

export default ListItem;