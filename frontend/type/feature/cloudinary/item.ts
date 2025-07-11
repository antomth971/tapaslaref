export interface CloudinaryMediaItem {
  url: string;
  public_id: string;
  format: string;
  resource_type: 'image' | 'video';
  duration?: number | null;
}