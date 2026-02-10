export interface Video {
  title: string;
  mediaUrl: string;
  mediaType: 'YOUTUBE';
  thumbnailUrl: string;
  slug: string;
  duration?: number; // Duration in seconds
}

export interface Category {
  slug: string;
  name: string;
  iconUrl: string;
}

export interface CategoryData {
  category: Category;
  contents: Video[];
}

