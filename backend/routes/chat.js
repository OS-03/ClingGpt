import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/opeanai.js";

const router = express.Router();

//test
router.route("/test").post(async (rea, res) => {
  try {
    const thread = new Thread({
      threadId: "123",
      title: "Testing New Thread",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "FAILED TO SAVE IN DB" });
  }
});

//get all threads
router.route("/thread").get(async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); //sort in descending order
    res.send(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "FAILED TO Fetch Threads" });
  }
});

//get based on thread id
router
  .route("/thread/:threadId")
  .get(async (req, res) => {
    const { threadId } = req.params;
    try {
      const thread = await Thread.findOne({ threadId });
      if (!thread) {
        res.status(404).json({ message: "Thread not found" });
      }
      res.json(thread.messages);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "FAILED TO Fetch chats" });
    }
  })
  .delete(async (req, res) => {
    const { threadId } = req.params;
    try {
      const threadDeleted = await Thread.findOneAndDelete({ threadId });
      if (!threadDeleted) {
        res.status(404).json({ message: "Thread not found" });
      }
      res.status(200).json({ success: "Thread deleted Successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "FAILED TO delete chats" });
    }
  });

router.route("/chat").post(async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    res.status(400).send({ message: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const assisantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assisantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({reply:assisantReply});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something Went Wrong" });
  }
});

export default router;
