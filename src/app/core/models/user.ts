export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinedDate?: Date | null;
  source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter';
}
