import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, User, Resource, EventItem, TaskItem, Bookmark } from './types.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_PASSWORD_HASH = bcrypt.hashSync('student123', 10);

const DEFAULT_USERS: User[] = [
  {
    id: 'user-demo-1',
    username: 'alex_chen',
    email: 'alex.chen@campus.edu',
    password_hash: INITIAL_PASSWORD_HASH,
    major: 'Computer Science & AI',
    bio: 'Junior CS student passionate about systems, distributed algorithms, and open source teaching tools.',
    avatar_color: 'from-blue-500 to-indigo-600',
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'user-demo-2',
    username: 'maya_patel',
    email: 'maya.patel@campus.edu',
    password_hash: INITIAL_PASSWORD_HASH,
    major: 'Data Science & Applied Math',
    bio: 'President of Data Club, tutor for Linear Algebra and Machine Learning.',
    avatar_color: 'from-purple-500 to-pink-600',
    created_at: '2026-09-05T12:30:00Z',
  },
  {
    id: 'user-demo-3',
    username: 'jordan_lee',
    email: 'jordan.lee@campus.edu',
    password_hash: INITIAL_PASSWORD_HASH,
    major: 'Mechanical Engineering',
    bio: 'Robotics Team Lead and enthusiast of CAD simulation and clean energy.',
    avatar_color: 'from-emerald-500 to-teal-600',
    created_at: '2026-09-12T14:15:00Z',
  }
];

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms Comprehensive Handbook',
    description: 'In-depth notes, Big-O cheat sheets, and visual diagrams covering Trees, Graphs, Dynamic Programming, and sorting algorithms.',
    category: 'Computer Science',
    type: 'PDF',
    link: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-notes/',
    download_url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-notes/',
    tags: ['Algorithms', 'Data Structures', 'C++', 'Java', 'Exam Prep'],
    author_name: 'MIT OpenCourseWare & Dept of EECS',
    uploaded_by: 'user-demo-1',
    rating: 4.9,
    views: 1240,
    saved_count: 342,
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'res-2',
    title: 'Full-Stack Modern Web Engineering: React & Node.js Guide',
    description: 'Production-ready starter templates, REST API design patterns, JWT authentication, and responsive UI layout masterclass.',
    category: 'Computer Science',
    type: 'Code',
    link: 'https://github.com',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'TailwindCSS'],
    author_name: 'Alex Chen',
    uploaded_by: 'user-demo-1',
    rating: 4.8,
    views: 890,
    saved_count: 215,
    created_at: '2026-10-05T11:20:00Z',
  },
  {
    id: 'res-3',
    title: 'Multivariable Calculus & Differential Equations Video Series',
    description: 'Curated 14-part video lecture series with step-by-step problem sets, Green’s Theorem, vector fields, and Laplace transforms.',
    category: 'Mathematics',
    type: 'Video',
    link: 'https://www.youtube.com',
    tags: ['Calculus', 'Differential Equations', 'Vector Calc', 'STEM Finals'],
    author_name: 'Prof. Leonard & Math Guild',
    uploaded_by: 'user-demo-2',
    rating: 5.0,
    views: 2100,
    saved_count: 520,
    created_at: '2026-09-28T09:15:00Z',
  },
  {
    id: 'res-4',
    title: 'Linear Algebra & Matrix Decompositions Cheatsheet',
    description: 'A 4-page laminated summary of Eigenvalues, SVD, Gram-Schmidt orthogonalization, and matrix factorization formulas.',
    category: 'Mathematics',
    type: 'Cheatsheet',
    link: 'https://stanford.edu',
    download_url: 'https://stanford.edu',
    tags: ['Linear Algebra', 'SVD', 'Matrices', 'Exam Quick Ref'],
    author_name: 'Maya Patel',
    uploaded_by: 'user-demo-2',
    rating: 4.7,
    views: 1450,
    saved_count: 410,
    created_at: '2026-10-10T16:00:00Z',
  },
  {
    id: 'res-5',
    title: 'Engineering Mechanics: Statics & Dynamics Problem Bank',
    description: 'Over 150 worked engineering problems covering equilibrium of rigid bodies, trusses, moments of inertia, and kinetics.',
    category: 'Engineering',
    type: 'PDF',
    link: 'https://openstax.org',
    tags: ['Statics', 'Dynamics', 'Physics', 'Mechanical'],
    author_name: 'Jordan Lee',
    uploaded_by: 'user-demo-3',
    rating: 4.6,
    views: 730,
    saved_count: 180,
    created_at: '2026-10-15T13:45:00Z',
  },
  {
    id: 'res-6',
    title: 'Microeconomics & Financial Accounting Essentials',
    description: 'Interactive articles and case studies exploring market equilibrium, balance sheets, DCF valuation, and macro indicators.',
    category: 'Business & Economics',
    type: 'Article',
    link: 'https://investopedia.com',
    tags: ['Economics', 'Finance', 'Accounting', 'Case Studies'],
    author_name: 'Campus Business Society',
    uploaded_by: 'user-demo-2',
    rating: 4.5,
    views: 620,
    saved_count: 145,
    created_at: '2026-10-20T10:30:00Z',
  },
  {
    id: 'res-7',
    title: 'UI/UX Design Systems & Accessibility (WCAG 2.2) Handbook',
    description: 'Design token structure, Figma design library tips, contrast ratios, and accessible component architectures.',
    category: 'Design & Arts',
    type: 'Article',
    link: 'https://w3.org/WAI',
    tags: ['UI/UX', 'Figma', 'Accessibility', 'Frontend'],
    author_name: 'Design Collective',
    uploaded_by: 'user-demo-1',
    rating: 4.9,
    views: 940,
    saved_count: 310,
    created_at: '2026-10-25T15:00:00Z',
  },
  {
    id: 'res-8',
    title: 'Academic Research & Literature Review Writing Toolkit',
    description: 'Guidelines on structuring academic papers, APA/IEEE citation formats, synthesis matrix templates, and peer-review preparation.',
    category: 'Humanities',
    type: 'PDF',
    link: 'https://owl.purdue.edu',
    tags: ['Research', 'Writing', 'Citations', 'Thesis'],
    author_name: 'Graduate Writing Center',
    uploaded_by: 'user-demo-3',
    rating: 4.7,
    views: 810,
    saved_count: 260,
    created_at: '2026-10-28T12:00:00Z',
  }
];

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'Campus Hackathon 2026: AI & Sustainability',
    description: '48-hour buildathon with $5,000 in prizes, free food, hardware labs, and industry mentors from leading tech companies. Form teams of 2-4.',
    category: 'Hackathon',
    day_name: 'Friday - Sunday',
    date: '2026-11-20',
    start_time: '18:00',
    end_time: '16:00',
    venue: 'Student Innovation Hub, East Wing & Virtual Discord',
    is_virtual: true,
    virtual_link: 'https://discord.gg/campushack',
    posted_by: 'user-demo-1',
    organizer_name: 'CS Student Society & ACM Chapter',
    attendees: ['user-demo-1', 'user-demo-2', 'user-demo-3'],
    max_capacity: 250,
    created_at: '2026-10-15T09:00:00Z',
  },
  {
    id: 'event-2',
    title: 'Hands-on Docker & Kubernetes Workshop for Students',
    description: 'Learn containerization from scratch. Build Dockerfiles, orchestrate multi-tier services, and deploy your course projects to the cloud.',
    category: 'Workshop',
    day_name: 'Wednesday',
    date: '2026-11-12',
    start_time: '16:00',
    end_time: '18:00',
    venue: 'Turing Computer Lab 304',
    is_virtual: false,
    posted_by: 'user-demo-1',
    organizer_name: 'DevOps Student Guild',
    attendees: ['user-demo-1', 'user-demo-2'],
    max_capacity: 45,
    created_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'event-3',
    title: 'Midterm Exam Cram & Study Group: Linear Algebra',
    description: 'Collaborative problem solving session for MATH 215. Bring your practice exam questions, notes, and snacks!',
    category: 'Study Group',
    day_name: 'Thursday',
    date: '2026-11-13',
    start_time: '18:30',
    end_time: '21:00',
    venue: 'Main Library 2nd Floor Group Study Room D',
    is_virtual: false,
    posted_by: 'user-demo-2',
    organizer_name: 'Maya Patel (Peer Tutor)',
    attendees: ['user-demo-2', 'user-demo-3'],
    max_capacity: 20,
    created_at: '2026-10-22T11:00:00Z',
  },
  {
    id: 'event-4',
    title: 'Guest Seminar: Quantum Computing Fundamentals & Career Paths',
    description: 'Distinguished lecture by Dr. Elena Vance on superconducting qubits, quantum supremacy benchmarks, and how undergraduates can enter the field.',
    category: 'Seminar',
    day_name: 'Tuesday',
    date: '2026-11-17',
    start_time: '15:00',
    end_time: '17:00',
    venue: 'Science Auditorium 101 & Zoom Livestream',
    is_virtual: true,
    virtual_link: 'https://zoom.us/j/9988776655',
    posted_by: 'user-demo-2',
    organizer_name: 'Physics & Computing Faculty',
    attendees: ['user-demo-1', 'user-demo-2'],
    max_capacity: 150,
    created_at: '2026-10-25T16:20:00Z',
  },
  {
    id: 'event-5',
    title: 'STEM Fall Career & Internship Networking Fair',
    description: 'Connect with over 40 hiring companies looking for software engineers, data analysts, hardware interns, and research assistants.',
    category: 'Career Fair',
    day_name: 'Monday',
    date: '2026-11-23',
    start_time: '11:00',
    end_time: '15:30',
    venue: 'Campus Recreation Center Main Court',
    is_virtual: false,
    posted_by: 'user-demo-3',
    organizer_name: 'University Career Center',
    attendees: ['user-demo-1', 'user-demo-3'],
    max_capacity: 500,
    created_at: '2026-10-29T10:00:00Z',
  },
  {
    id: 'event-6',
    title: 'Board Games & Boba Mixer for Engineering & Math Students',
    description: 'De-stress before finals week! Free milk tea, Catan, Ticket to Ride, Chess, and Super Smash Bros tournament.',
    category: 'Social',
    day_name: 'Friday',
    date: '2026-11-27',
    start_time: '19:00',
    end_time: '22:00',
    venue: 'Student Lounge Terrace',
    is_virtual: false,
    posted_by: 'user-demo-3',
    organizer_name: 'Student Life Council',
    attendees: ['user-demo-1', 'user-demo-2', 'user-demo-3'],
    max_capacity: 60,
    created_at: '2026-11-01T12:00:00Z',
  }
];

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    user_id: 'user-demo-1',
    title: 'Complete Problem Set 4 on Graph Algorithms (Dijkstra & Prim)',
    course_tag: 'CS 301',
    priority: 'high',
    completed: false,
    due_date: '2026-11-10',
    created_at: '2026-11-02T10:00:00Z',
  },
  {
    id: 'task-2',
    user_id: 'user-demo-1',
    title: 'Submit Literature Review Draft on Neural Architecture Search',
    course_tag: 'CS 485',
    priority: 'high',
    completed: false,
    due_date: '2026-11-14',
    created_at: '2026-11-03T14:00:00Z',
  },
  {
    id: 'task-3',
    user_id: 'user-demo-1',
    title: 'Review Chapter 6 notes on Multivariable Green\'s Theorem',
    course_tag: 'MATH 215',
    priority: 'medium',
    completed: true,
    due_date: '2026-11-08',
    created_at: '2026-11-01T09:00:00Z',
  },
  {
    id: 'task-4',
    user_id: 'user-demo-1',
    title: 'Register team roster for Campus Hackathon 2026',
    course_tag: 'Extracurricular',
    priority: 'medium',
    completed: false,
    due_date: '2026-11-15',
    created_at: '2026-11-04T16:00:00Z',
  },
  {
    id: 'task-5',
    user_id: 'user-demo-1',
    title: 'Print IEEE formatting guidelines for Technical Writing Lab',
    course_tag: 'ENGL 202',
    priority: 'low',
    completed: true,
    due_date: '2026-11-06',
    created_at: '2026-11-02T11:00:00Z',
  }
];

const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    user_id: 'user-demo-1',
    resource_id: 'res-1',
    created_at: '2026-10-02T09:00:00Z',
  },
  {
    id: 'bm-2',
    user_id: 'user-demo-1',
    resource_id: 'res-3',
    created_at: '2026-10-04T14:20:00Z',
  },
  {
    id: 'bm-3',
    user_id: 'user-demo-1',
    resource_id: 'res-4',
    created_at: '2026-10-12T10:15:00Z',
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all arrays exist
        return {
          users: parsed.users || DEFAULT_USERS,
          resources: parsed.resources || DEFAULT_RESOURCES,
          events: parsed.events || DEFAULT_EVENTS,
          tasks: parsed.tasks || DEFAULT_TASKS,
          bookmarks: parsed.bookmarks || DEFAULT_BOOKMARKS,
        };
      }
    } catch (err) {
      console.error('Error loading database, seeding defaults:', err);
    }

    const initial: DatabaseSchema = {
      users: DEFAULT_USERS,
      resources: DEFAULT_RESOURCES,
      events: DEFAULT_EVENTS,
      tasks: DEFAULT_TASKS,
      bookmarks: DEFAULT_BOOKMARKS,
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- Users ---
  getUsers(): User[] {
    return this.data.users;
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  // --- Resources ---
  getResources(): Resource[] {
    return this.data.resources;
  }

  getResourceById(id: string): Resource | undefined {
    return this.data.resources.find(r => r.id === id);
  }

  createResource(resource: Resource): Resource {
    this.data.resources.unshift(resource);
    this.persist();
    return resource;
  }

  incrementResourceViews(id: string): void {
    const res = this.getResourceById(id);
    if (res) {
      res.views = (res.views || 0) + 1;
      this.persist();
    }
  }

  // --- Bookmarks ---
  getBookmarks(userId: string): Bookmark[] {
    return this.data.bookmarks.filter(b => b.user_id === userId);
  }

  isResourceBookmarked(userId: string, resourceId: string): boolean {
    return this.data.bookmarks.some(b => b.user_id === userId && b.resource_id === resourceId);
  }

  toggleBookmark(userId: string, resourceId: string): { bookmarked: boolean; saved_count: number } {
    const existingIndex = this.data.bookmarks.findIndex(
      b => b.user_id === userId && b.resource_id === resourceId
    );
    const resource = this.getResourceById(resourceId);

    let bookmarked = false;
    if (existingIndex >= 0) {
      this.data.bookmarks.splice(existingIndex, 1);
      if (resource && resource.saved_count > 0) {
        resource.saved_count -= 1;
      }
      bookmarked = false;
    } else {
      this.data.bookmarks.push({
        id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        resource_id: resourceId,
        created_at: new Date().toISOString(),
      });
      if (resource) {
        resource.saved_count = (resource.saved_count || 0) + 1;
      }
      bookmarked = true;
    }
    this.persist();
    return { bookmarked, saved_count: resource?.saved_count || 0 };
  }

  // --- Events ---
  getEvents(): EventItem[] {
    return this.data.events;
  }

  getEventById(id: string): EventItem | undefined {
    return this.data.events.find(e => e.id === id);
  }

  createEvent(event: EventItem): EventItem {
    this.data.events.unshift(event);
    this.persist();
    return event;
  }

  toggleEventRSVP(eventId: string, userId: string): { attending: boolean; attendee_count: number } {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found');

    if (!Array.isArray(event.attendees)) {
      event.attendees = [];
    }

    const index = event.attendees.indexOf(userId);
    let attending = false;
    if (index >= 0) {
      event.attendees.splice(index, 1);
      attending = false;
    } else {
      event.attendees.push(userId);
      attending = true;
    }

    this.persist();
    return { attending, attendee_count: event.attendees.length };
  }

  // --- Tasks ---
  getTasks(userId: string): TaskItem[] {
    return this.data.tasks.filter(t => t.user_id === userId);
  }

  createTask(task: TaskItem): TaskItem {
    this.data.tasks.unshift(task);
    this.persist();
    return task;
  }

  updateTask(id: string, userId: string, updates: Partial<TaskItem>): TaskItem | null {
    const task = this.data.tasks.find(t => t.id === id && t.user_id === userId);
    if (!task) return null;
    Object.assign(task, updates);
    this.persist();
    return task;
  }

  deleteTask(id: string, userId: string): boolean {
    const index = this.data.tasks.findIndex(t => t.id === id && t.user_id === userId);
    if (index === -1) return false;
    this.data.tasks.splice(index, 1);
    this.persist();
    return true;
  }
}

export const db = new Database();
