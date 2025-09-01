// server/routes/bills.js
const router = require("express").Router();
const Bill = require("../models/Bill");

// Add a bill
router.post("/add", async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.json({ ok: true, bill });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// List upcoming bills within N days (default 7)
router.get("/upcoming", async (req, res) => {
  try {
    const userid = req.query.userid;
    const days = Number(req.query.days || 7);
    if (!userid) return res.json([]);

    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);

    const bills = await Bill.find({
      userid,
      paid: false,
      dueDate: { $lte: until },
      $or: [{ snoozedUntil: null }, { snoozedUntil: { $lte: now } }],
    }).sort({ dueDate: 1 });

    res.json(bills);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Mark as paid
router.post("/mark-paid", async (req, res) => {
  try {
    const { id } = req.body;
    await Bill.findByIdAndUpdate(id, { paid: true, snoozedUntil: null });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Snooze (default 3 days)
router.post("/snooze", async (req, res) => {
  try {
    const { id, days = 3 } = req.body;
    const next = new Date();
    next.setDate(next.getDate() + Number(days));
    await Bill.findByIdAndUpdate(id, { snoozedUntil: next });
    res.json({ ok: true, snoozedUntil: next });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
