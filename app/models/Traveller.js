import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const TravellerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    passport: { type: String, required: true },
  },
  { timestamps: true }
);

const Traveller = models.Traveller || model('Traveller', TravellerSchema);
export default Traveller;
