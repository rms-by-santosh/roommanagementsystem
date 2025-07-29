import { Sheet } from "../models/Sheet.js";

// Create a new sheet
export const createSheet = async (req, res, next) => {
  try {
    const { name, isCurrent } = req.body;
    if (await Sheet.findOne({ name })) return res.status(400).json({ message: "Sheet name already exists" });
    if (isCurrent) await Sheet.updateMany({}, { isCurrent: false });
    const sheet = await Sheet.create({ name, isCurrent: isCurrent || false });
    res.status(201).json({ message: "Sheet created", sheet });
  } catch (err) {
    next(err);
  }
};

// Get all sheets
export const getSheets = async (req, res, next) => {
  try {
    const sheets = await Sheet.find();
    res.json(sheets);
  } catch (err) {
    next(err);
  }
};

// Delete a sheet
export const deleteSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sheet = await Sheet.findByIdAndDelete(id);
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });
    res.json({ message: "Sheet deleted" });
  } catch (err) {
    next(err);
  }
};

// Set current sheet
export const setCurrentSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Sheet.updateMany({}, { isCurrent: false });
    const sheet = await Sheet.findByIdAndUpdate(id, { isCurrent: true }, { new: true });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });
    res.json({ message: "Current sheet set", sheet });
  } catch (err) {
    next(err);
  }
};

// Add entry to sheet (approval)
export const addEntryToCurrentSheet = async (entry) => {
  const sheet = await Sheet.findOne({ isCurrent: true });
  if (!sheet) throw new Error("No current sheet found");
  sheet.entries.push(entry);
  await sheet.save();
  return sheet;
};

// Get current sheet (for home display)
export const getCurrentSheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.findOne({ isCurrent: true });
    res.json(sheet);
  } catch (err) {
    next(err);
  }
};
