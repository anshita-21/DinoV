import { Video } from '../types/video';

interface CategoryData {
    categories: Array<{
        category: {
            slug: string;
            name: string;
            iconUrl: string;
        };
        contents: Array<{
            title: string;
            mediaUrl: string;
            mediaType: string;
            thumbnailUrl: string;
            slug: string;
        }>;
    }>;
}

export function transformVideos(data: CategoryData): Video[] {
    const videos: Video[] = [];
    let idCounter = 1;

    data.categories.forEach(category => {
        category.contents.forEach(content => {
            videos.push({
                id: idCounter++,
                title: content.title,
                thumbnail: content.thumbnailUrl,
                thumbnailUrl: content.thumbnailUrl,
                duration: 0, 
                category: category.category.name,
                videoUrl: content.mediaUrl,
                mediaUrl: content.mediaUrl,
                mediaType: content.mediaType,
                slug: content.slug,
            });
        });
    });
        return videos;
    }