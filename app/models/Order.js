import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['upcoming', 'completed'],
      required: true,
    },
    destination: { type: String, required: true },
    origin: { type: String, required: true },
    last_travel_date: { type: Date, required: true },
    flights: { type: Boolean, default: false },
    hotel: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model('Order', OrderSchema);
export default Order;
