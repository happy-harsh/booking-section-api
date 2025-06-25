import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  travellers: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true },
      age: { type: Number, required: true },
      passport: { type: String, required: true },
    },
  ],
});

const User = models.User || model('User', UserSchema);
export default User;
