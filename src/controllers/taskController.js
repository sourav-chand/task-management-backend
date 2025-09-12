const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const task = new Task({ user: req.user, title, description });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// exports.updateTask = async (req, res) => {
//   const { title, description, completed } = req.body;
//   console.log(req.body);  
//   try {
//     const task = await Task.findOne({ _id: req.params.id, user: req.user });
//     if (!task) return res.status(404).json({ message: 'Task not found' });

//     if (title !== undefined) task.title = title;
//     if (description !== undefined) task.description = description;
//     if (completed !== undefined) task.completed = completed;

//     await task.save();
//     res.json(task);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };
exports.updateTask = async (req, res) => {
  const { title, description, completed } = req.body;
  console.log("Update request body:", req.body);
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id || req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send('Server error');
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
