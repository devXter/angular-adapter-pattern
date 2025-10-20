export interface TwitterUserDto {
  id_str: string;
  screen_name: string;
  name: string;
  profile_image_url_https: string;
  created_at: string;
  verified: boolean;
  followers_count: number;
  description?: number;
  // Email no disponible públicamente en Twitter
}
