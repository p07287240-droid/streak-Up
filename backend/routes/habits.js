const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { title, ownerId } = req.body;

    const habit = await Habit.create({
      title,
      owner: ownerId,
    });

    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const habits = await Habit.find({
      owner: req.query.ownerId,
    });

    res.json(habits);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/check-in", async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        error: "Habit not found",
      });
    }

    const today = new Date().toDateString();

    const last = habit.lastCheckIn
      ? new Date(habit.lastCheckIn).toDateString()
      : null;

    if (last === today) {
      return res.status(409).json({
        error: "Already checked in today",
      });
    }

    habit.streak += 1;
    habit.lastCheckIn = new Date();

    await habit.save();

    res.json(habit);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;