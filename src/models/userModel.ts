import { InferSchemaType, Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface UserProps {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
}

// Определение методов пользователя
interface UserDocument extends UserProps, Document {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Определение статических методов пользователя
interface UserModel extends Model<UserDocument> {
  // Добавьте здесь свои статические методы, если есть
}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
