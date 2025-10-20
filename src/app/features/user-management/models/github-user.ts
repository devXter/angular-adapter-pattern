export interface GithubUserDto {
  id: number;
  login: string;
  avatar_url: string;
  email: string | null;
  created_at: string;
  name: string | null;
}
