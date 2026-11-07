export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  major: string;
  bio: string;
  avatar_color: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "Computer Science", "Mathematics", "Engineering", "Business & Economics", "Design & Arts", "Humanities"
  type: 'PDF' | 'Video' | 'Code' | 'Article' | 'Cheatsheet';
  link: string;
  download_url?: string;
  tags: string[];
  author_name: string;
  uploaded_by: string; // user id
  rating: number;
  views: number;
  saved_count: number;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'Workshop' | 'Study Group' | 'Hackathon' | 'Seminar' | 'Career Fair' | 'Social';
  day_name: string; // "Friday", "Monday", etc.
  date: string; // "YYYY-MM-DD"
  start_time: string; // "14:00"
  end_time: string; // "16:30"
  venue: string;
  is_virtual: boolean;
  virtual_link?: string;
  posted_by: string; // user id
  organizer_name: string;
  attendees: string[]; // array of user ids
  max_capacity?: number;
  created_at: string;
}

export interface TaskItem {
  id: string;
  user_id: string;
  title: string;
  course_tag: string; // e.g. "CS101", "MATH240"
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date: string; // "YYYY-MM-DD"
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

export interface DatabaseSchema {
  users: User[];
  resources: Resource[];
  events: EventItem[];
  tasks: TaskItem[];
  bookmarks: Bookmark[];
}
