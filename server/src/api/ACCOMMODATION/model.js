import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: Text, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

accommodationSchema.pre("save", async function (next) {
  const currentAuthor = this;
  console.log("this: ", this);

  if (currentAuthor.isModified("password")) {
    const plainPW = currentAuthor.password;

    const hash = await bcrypt.hash(plainPW, 11);
    currentAuthor.password = hash;
  }
  next();
});

accommodationSchema.methods.toJSON = function () {
  const authorDocument = this;
  console.log("this in methods.toJSON: ", this);
  const author = authorDocument.toObject();

  delete author.password;
  delete author.createdAt;
  delete author.updatedAt;
  delete author.__v;
  return author;
};

export default model("Accomodation", accommodationSchema);
