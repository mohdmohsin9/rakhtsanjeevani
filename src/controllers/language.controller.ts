import { Request, Response } from "express";
import Language from "../models/language.models";

// get all languages
export const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Language.find().select(
      "language_name language_ref -_id"
    );

    res.status(200).json({
      success: true,
      message: "Languages fetched successfully",
      count: languages.length,
      data: languages
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// post language
export const postLanguage = async (req: Request, res: Response) => {
  try {
    const { language_name, language_ref } = req.body;
    const language = await Language.create({ language_name, language_ref });
    res.status(201).json({
      success: true,
      message: "Language created successfully",
      data: language
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
