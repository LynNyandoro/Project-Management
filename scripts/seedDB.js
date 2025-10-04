const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Cleared existing data');

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    });

    await demoUser.save();
    console.log('Created demo user');

    // Create demo projects
    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      createdBy: demoUser._id,
      tasks: []
    });

    const project2 = new Project({
      name: 'Mobile App Development',
      description: 'Build a mobile application for iOS and Android platforms',
      createdBy: demoUser._id,
      tasks: []
    });

    await project1.save();
    await project2.save();
    console.log('Created demo projects');

    // Create tasks for project 1
    const task1 = new Task({
      title: 'Research competitor websites',
      description: 'Analyze design trends and user experience patterns from competitor sites',
      dueDate: new Date('2024-01-15'),
      status: 'Done',
      project: project1._id,
      createdBy: demoUser._id
    });

    const task2 = new Task({
      title: 'Create wireframes',
      description: 'Design low-fidelity wireframes for all main pages',
      dueDate: new Date('2024-01-20'),
      status: 'In Progress',
      project: project1._id,
      createdBy: demoUser._id
    });

    const task3 = new Task({
      title: 'Design mockups',
      description: 'Create high-fidelity design mockups in Figma',
      dueDate: new Date('2024-01-25'),
      status: 'To Do',
      project: project1._id,
      createdBy: demoUser._id
    });

    const task4 = new Task({
      title: 'Implement responsive design',
      description: 'Code the frontend with responsive CSS and modern frameworks',
      dueDate: new Date('2024-02-01'),
      status: 'To Do',
      project: project1._id,
      createdBy: demoUser._id
    });

    // Create tasks for project 2
    const task5 = new Task({
      title: 'Set up development environment',
      description: 'Install React Native, configure development tools and emulators',
      dueDate: new Date('2024-01-10'),
      status: 'Done',
      project: project2._id,
      createdBy: demoUser._id
    });

    const task6 = new Task({
      title: 'Design app architecture',
      description: 'Plan the app structure, components, and data flow',
      dueDate: new Date('2024-01-18'),
      status: 'In Progress',
      project: project2._id,
      createdBy: demoUser._id
    });

    const task7 = new Task({
      title: 'Implement user authentication',
      description: 'Add login/signup functionality with secure token management',
      dueDate: new Date('2024-01-30'),
      status: 'To Do',
      project: project2._id,
      createdBy: demoUser._id
    });

    const task8 = new Task({
      title: 'Create main app screens',
      description: 'Build the core UI screens and navigation flow',
      dueDate: new Date('2024-02-05'),
      status: 'To Do',
      project: project2._id,
      createdBy: demoUser._id
    });

    const task9 = new Task({
      title: 'Integrate backend API',
      description: 'Connect the mobile app to the backend REST API',
      dueDate: new Date('2024-02-10'),
      status: 'To Do',
      project: project2._id,
      createdBy: demoUser._id
    });

    // Save all tasks
    const tasks = [task1, task2, task3, task4, task5, task6, task7, task8, task9];
    await Task.insertMany(tasks);
    console.log('Created demo tasks');

    // Update projects with task references
    project1.tasks = [task1._id, task2._id, task3._id, task4._id];
    project2.tasks = [task5._id, task6._id, task7._id, task8._id, task9._id];
    
    await project1.save();
    await project2.save();
    console.log('Updated projects with task references');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo user credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    console.log('\nCreated 2 projects with 9 tasks total');

  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
seedDatabase();
