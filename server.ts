import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { db } from './server/db.js';
import { User, Resource, EventItem, TaskItem } from './server/types.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'student-hub-jwt-secret-key-prod-2026';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(express.json());

// Helper for generating JWT
function createToken(user: User): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication Middleware
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

// Optional Auth Middleware (to enrich data if logged in)
function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
      req.user = payload;
    } catch {
      // Ignore token failure for optional auth
    }
  }
  next();
}

// --- AUTH ROUTES ---

// Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, major, bio } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  if (db.findUserByEmail(cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  if (db.findUserByUsername(cleanUsername)) {
    return res.status(409).json({ error: 'This username is already taken. Please choose another.' });
  }

  const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-red-600',
  ];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    email: cleanEmail,
    password_hash: bcrypt.hashSync(password, 10),
    major: (major || 'Undeclared').trim(),
    bio: (bio || 'Student at Campus').trim(),
    avatar_color: randomColor,
    created_at: new Date().toISOString(),
  };

  db.createUser(newUser);

  const token = createToken(newUser);
  const { password_hash: _, ...safeUser } = newUser;

  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: safeUser,
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/username and password are required.' });
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  const user = db.findUserByEmail(cleanIdentifier) || db.findUserByUsername(cleanIdentifier);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please check your username/email and password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials. Please check your password.' });
  }

  const token = createToken(user);
  const { password_hash: _, ...safeUser } = user;

  return res.json({
    message: 'Login successful',
    token,
    user: safeUser,
  });
});

// Current User Me
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password_hash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Update Profile
app.patch('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { major, bio } = req.body;
  const updated = db.updateUser(req.user!.id, {
    ...(major !== undefined && { major: major.trim() }),
    ...(bio !== undefined && { bio: bio.trim() }),
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password_hash: _, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

// Public / Detailed User Profile
app.get('/api/users/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const postedEvents = db.getEvents().filter(e => e.posted_by === user.id);
  const userBookmarks = db.getBookmarks(user.id);
  const savedResources = db.getResources().filter(r => userBookmarks.some(b => b.resource_id === r.id));
  const userTasks = db.getTasks(user.id);

  const { password_hash: _, ...safeUser } = user;

  return res.json({
    user: safeUser,
    stats: {
      posted_events_count: postedEvents.length,
      saved_resources_count: savedResources.length,
      completed_tasks_count: userTasks.filter(t => t.completed).length,
      total_tasks_count: userTasks.length,
    },
    posted_events: postedEvents,
    saved_resources: savedResources,
  });
});

// --- RESOURCES ROUTES ---

// List & Filter Resources
app.get('/api/resources', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { q, category, type, sortBy } = req.query;
  const currentUserId = req.user?.id;

  let list = [...db.getResources()];

  if (category && category !== 'All') {
    list = list.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
  }

  if (type && type !== 'All') {
    list = list.filter(r => r.type.toLowerCase() === String(type).toLowerCase());
  }

  if (q && String(q).trim() !== '') {
    const query = String(q).toLowerCase().trim();
    list = list.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.author_name.toLowerCase().includes(query) ||
      r.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Sorting
  if (sortBy === 'popular') {
    list.sort((a, b) => (b.views + b.saved_count * 2) - (a.views + a.saved_count * 2));
  } else if (sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'saved') {
    list.sort((a, b) => b.saved_count - a.saved_count);
  } else {
    // Default: recent
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Attach is_saved flag for user
  const userBookmarks = currentUserId ? db.getBookmarks(currentUserId) : [];
  const bookmarkSet = new Set(userBookmarks.map(b => b.resource_id));

  const enriched = list.map(r => ({
    ...r,
    is_saved: bookmarkSet.has(r.id),
  }));

  return res.json(enriched);
});

// Get Single Resource
app.get('/api/resources/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const resource = db.getResourceById(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  db.incrementResourceViews(req.params.id);

  const isSaved = req.user ? db.isResourceBookmarked(req.user.id, resource.id) : false;

  return res.json({
    ...resource,
    views: resource.views + 1,
    is_saved: isSaved,
  });
});

// Create Resource
app.post('/api/resources', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, type, link, download_url, tags } = req.body;

  if (!title || !description || !category || !type || !link) {
    return res.status(400).json({ error: 'Please provide title, description, category, type, and URL link.' });
  }

  const currentUser = db.findUserById(req.user!.id);

  const cleanTags = Array.isArray(tags)
    ? tags.map(t => String(t).trim()).filter(Boolean)
    : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

  const newResource: Resource = {
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    type: type as Resource['type'],
    link: link.trim(),
    download_url: download_url ? download_url.trim() : undefined,
    tags: cleanTags.length > 0 ? cleanTags : ['Study Material'],
    author_name: currentUser?.username || 'Student Contributor',
    uploaded_by: req.user!.id,
    rating: 5.0,
    views: 1,
    saved_count: 0,
    created_at: new Date().toISOString(),
  };

  db.createResource(newResource);
  return res.status(201).json(newResource);
});

// Toggle Resource Bookmark
app.post('/api/resources/:id/bookmark', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const resource = db.getResourceById(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const result = db.toggleBookmark(req.user!.id, req.params.id);
  return res.json(result);
});

// --- EVENTS ROUTES ---

// List Events
app.get('/api/events', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { q, category, timeframe } = req.query;
  const currentUserId = req.user?.id;

  let list = [...db.getEvents()];

  if (category && category !== 'All') {
    list = list.filter(e => e.category.toLowerCase() === String(category).toLowerCase());
  }

  if (q && String(q).trim() !== '') {
    const query = String(q).toLowerCase().trim();
    list = list.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.venue.toLowerCase().includes(query) ||
      e.organizer_name.toLowerCase().includes(query)
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  if (timeframe === 'upcoming') {
    list = list.filter(e => e.date >= todayStr);
  } else if (timeframe === 'today') {
    list = list.filter(e => e.date === todayStr);
  }

  // Sort chronologically by date and start_time
  list.sort((a, b) => `${a.date} ${a.start_time}`.localeCompare(`${b.date} ${b.start_time}`));

  const enriched = list.map(event => ({
    ...event,
    is_attending: currentUserId ? (event.attendees || []).includes(currentUserId) : false,
    attendees_count: (event.attendees || []).length,
  }));

  return res.json(enriched);
});

// Create Event
app.post('/api/events', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    description,
    category,
    date,
    start_time,
    end_time,
    venue,
    is_virtual,
    virtual_link,
    max_capacity,
  } = req.body;

  if (!title || !description || !category || !date || !start_time || !end_time || !venue) {
    return res.status(400).json({ error: 'All primary event fields (title, description, category, date, start/end time, venue) are required.' });
  }

  const currentUser = db.findUserById(req.user!.id);

  // Compute day name from date string
  const dateObj = new Date(date + 'T00:00:00');
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = isNaN(dateObj.getTime()) ? 'Event Day' : dayNames[dateObj.getDay()];

  const newEvent: EventItem = {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: description.trim(),
    category: category as EventItem['category'],
    day_name: dayName,
    date,
    start_time: start_time.trim(),
    end_time: end_time.trim(),
    venue: venue.trim(),
    is_virtual: Boolean(is_virtual),
    virtual_link: virtual_link ? virtual_link.trim() : undefined,
    posted_by: req.user!.id,
    organizer_name: currentUser ? `${currentUser.username} (${currentUser.major})` : 'Student Organizer',
    attendees: [req.user!.id], // auto RSVP organizer
    max_capacity: max_capacity ? parseInt(max_capacity) : 100,
    created_at: new Date().toISOString(),
  };

  db.createEvent(newEvent);
  return res.status(201).json({
    ...newEvent,
    is_attending: true,
    attendees_count: newEvent.attendees.length,
  });
});

// Toggle RSVP
app.post('/api/events/:id/rsvp', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = db.toggleEventRSVP(req.params.id, req.user!.id);
    return res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error processing RSVP';
    return res.status(404).json({ error: message });
  }
});

// --- TASKS ROUTES ---

// Get user tasks
app.get('/api/tasks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const tasks = db.getTasks(req.user!.id);
  // Sort: incomplete first, then by due date
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return (a.due_date || '').localeCompare(b.due_date || '');
  });
  return res.json(tasks);
});

// Create task
app.post('/api/tasks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, course_tag, priority, due_date } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const today = new Date().toISOString().split('T')[0];

  const newTask: TaskItem = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: req.user!.id,
    title: title.trim(),
    course_tag: (course_tag || 'General').trim(),
    priority: (priority as TaskItem['priority']) || 'medium',
    completed: false,
    due_date: due_date || today,
    created_at: new Date().toISOString(),
  };

  db.createTask(newTask);
  return res.status(201).json(newTask);
});

// Update task (toggle complete, rename, change due date)
app.patch('/api/tasks/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { completed, title, course_tag, priority, due_date } = req.body;

  const updated = db.updateTask(req.params.id, req.user!.id, {
    ...(completed !== undefined && { completed: Boolean(completed) }),
    ...(title !== undefined && { title: title.trim() }),
    ...(course_tag !== undefined && { course_tag: course_tag.trim() }),
    ...(priority !== undefined && { priority }),
    ...(due_date !== undefined && { due_date }),
  });

  if (!updated) {
    return res.status(404).json({ error: 'Task not found or unauthorized' });
  }

  return res.json(updated);
});

// Delete task
app.delete('/api/tasks/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteTask(req.params.id, req.user!.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found or unauthorized' });
  }
  return res.json({ success: true, message: 'Task deleted successfully' });
});

// --- PLATFORM STATS ---
app.get('/api/stats', (_req: Request, res: Response) => {
  const resources = db.getResources();
  const events = db.getEvents();
  const users = db.getUsers();

  const totalSaves = resources.reduce((acc, r) => acc + (r.saved_count || 0), 0);
  const totalViews = resources.reduce((acc, r) => acc + (r.views || 0), 0);

  return res.json({
    total_resources: resources.length,
    total_events: events.length,
    total_students: users.length,
    total_saves: totalSaves,
    total_views: totalViews,
    categories: ['Computer Science', 'Mathematics', 'Engineering', 'Business & Economics', 'Design & Arts', 'Humanities'],
  });
});

// --- VITE MIDDLEWARE / STATIC ASSETS SETUP ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Resource Hub server running at http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
