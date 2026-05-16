const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const admin = await User.create({ username: 'Admin User', email: 'admin@taskforge.pro', password: 'password123', role: 'Admin' });
    const lead = await User.create({ username: 'Marcus Rossi', email: 'marcus@taskforge.pro', password: 'password123', role: 'Admin' });
    const dev1 = await User.create({ username: 'Sarah Jenkins', email: 'sarah@taskforge.pro', password: 'password123', role: 'Member' });
    const dev2 = await User.create({ username: 'Michael Chen', email: 'michael@taskforge.pro', password: 'password123', role: 'Member' });
    const qa = await User.create({ username: 'Elena Gilbert', email: 'elena@taskforge.pro', password: 'password123', role: 'Member' });

    const projects = [
      { name: 'Platform Migration', description: 'Migrate legacy infrastructure to AWS cloud-native architecture.', members: [admin._id, lead._id, dev1._id], createdBy: admin._id, status: 'Active' },
      { name: 'Analytics Engine', description: 'Real-time data processing layer for customer behavior tracking.', members: [admin._id, dev2._id], createdBy: admin._id, status: 'In Progress' },
      { name: 'API Gateway', description: 'Unified entry point for microservices with built-in auth and rate limiting.', members: [lead._id, dev1._id, dev2._id], createdBy: lead._id, status: 'Active' },
      { name: 'Design System', description: 'Centralized UI component library for all internal and external products.', members: [admin._id, dev1._id], createdBy: admin._id, status: 'In Progress' },
      { name: 'QA Automation', description: 'End-to-end testing suite for continuous integration pipeline.', members: [qa._id, lead._id], createdBy: admin._id, status: 'Active' },
      { name: 'Mobile App v2', description: 'Redesigning the mobile experience with React Native.', members: [dev1._id, dev2._id], createdBy: admin._id, status: 'Active' },
      { name: 'Customer Portal', description: 'Self-service dashboard for enterprise customers.', members: [admin._id, qa._id], createdBy: admin._id, status: 'Active' },
      { name: 'Security Audit', description: 'Comprehensive vulnerability assessment and penetration testing.', members: [lead._id, admin._id], createdBy: lead._id, status: 'Active' }
    ];

    const createdProjects = await Project.insertMany(projects);
    const [pMigration, pAnalytics, pGateway, pDesign, pQA, pMobile, pPortal, pSecurity] = createdProjects;

    const tasks = [
      // Platform Migration
      { title: 'CloudFormation Templates', status: 'done', priority: 'High', project: pMigration._id, assignee: lead._id, dueDate: new Date('2026-06-01') },
      { title: 'Database Sharding Logic', status: 'in-progress', priority: 'High', project: pMigration._id, assignee: dev1._id, dueDate: new Date('2026-06-15') },
      { title: 'Legacy Data Cleanup', status: 'todo', priority: 'Medium', project: pMigration._id, assignee: dev1._id, dueDate: new Date('2026-07-01') },

      // Analytics Engine
      { title: 'Kafka Cluster Setup', status: 'done', priority: 'High', project: pAnalytics._id, assignee: dev2._id, dueDate: new Date('2026-05-20') },
      { title: 'Stream Processor Implementation', status: 'blocked', priority: 'Medium', project: pAnalytics._id, assignee: dev2._id, dueDate: new Date('2026-06-05') },

      // API Gateway
      { title: 'Rate Limiting Middleware', status: 'done', priority: 'Medium', project: pGateway._id, assignee: dev1._id, dueDate: new Date('2026-05-15') },
      { title: 'OpenAPI Documentation', status: 'review', priority: 'Low', project: pGateway._id, assignee: dev2._id, dueDate: new Date('2026-05-30') },

      // Design System
      { title: 'Atomic Components Audit', status: 'done', priority: 'Medium', project: pDesign._id, assignee: dev1._id, dueDate: new Date('2026-05-10') },
      { title: 'Typography System', status: 'in-progress', priority: 'High', project: pDesign._id, assignee: admin._id, dueDate: new Date('2026-05-25') },

      // QA Automation
      { title: 'Playwright Configuration', status: 'done', priority: 'High', project: pQA._id, assignee: qa._id, dueDate: new Date('2026-05-01') },
      { title: 'Regression Test Suite', status: 'in-progress', priority: 'Medium', project: pQA._id, assignee: qa._id, dueDate: new Date('2026-06-10') },

      // Security Audit
      { title: 'Penetration Testing', status: 'todo', priority: 'High', project: pSecurity._id, assignee: lead._id, dueDate: new Date('2026-06-20') },
      { title: 'IAM Policy Review', status: 'done', priority: 'High', project: pSecurity._id, assignee: admin._id, dueDate: new Date('2026-05-05') }
    ];

    await Task.insertMany(tasks);
    console.log('Database Seeded with Realistic Enterprise Data Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDB();
