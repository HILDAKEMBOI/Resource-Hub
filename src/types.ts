export interface User {
  id: string;
  username: string;
  email: string;
  major: string;
  bio: string;
  avatar_color: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'PDF' | 'Video' | 'Code' | 'Article' | 'Cheatsheet';
  link: string;
  download_url?: string;
  tags: string[];
  author_name: string;
  uploaded_by: string;
  rating: number;
  views: number;
  saved_count: number;
  created_at: string;
  is_saved?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'Workshop' | 'Study Group' | 'Hackathon' | 'Seminar' | 'Career Fair' | 'Social';
  day_name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  is_virtual: boolean;
  virtual_link?: string;
  posted_by: string;
  organizer_name: string;
  attendees: string[];
  attendees_count?: number;
  is_attending?: boolean;
  max_capacity?: number;
  created_at: string;
}

export interface TaskItem {
  id: string;
  user_id: string;
  title: string;
  course_tag: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  due_date: string;
  created_at: string;
}

export interface PlatformStats {
  total_resources: number;
  total_events: number;
  total_students: number;
  total_saves: number;
  total_views: number;
  categories: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
