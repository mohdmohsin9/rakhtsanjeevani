import mongoose, { Schema, Document } from "mongoose";

export interface ILanguage extends Document {
  language_name: string;
  language_ref: string;
}

const languageSchema: Schema = new Schema(
  {
    language_name: {
      type: String,
      required: true,
      trim: true
    },
    language_ref: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ILanguage>("Language", languageSchema);