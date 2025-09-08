import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the markdown directory path
const MARKDOWN_DIR = path.join(process.cwd(), 'fixtures');

console.log('MARKDOWN_DIR:', MARKDOWN_DIR);

export function getAllMarkdownFiles() {
    let posts: Post[] = [];

    // Verify the directory exists
    if (!fs.existsSync(MARKDOWN_DIR)) { 
        console.error('Markdown directory not found:', MARKDOWN_DIR);
        return posts;
    }

    // Read all category folders
    const categories = fs.readdirSync(MARKDOWN_DIR);
    console.log('Found categories:', categories);

    categories.forEach((category) => {
        const categoryPath = path.join(MARKDOWN_DIR, category);
        console.log('Processing category:', categoryPath);

        if (fs.statSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath);
            console.log(`Found files in ${category}:`, files);

            files.forEach((filename) => {
                // Only process .md and .mdx files
                if (!filename.match(/\.(md|mdx)$/)) {
                    console.log('Skipping non-markdown file:', filename);
                    return;
                }
                
                const filePath = path.join(categoryPath, filename);
                console.log('Processing file:', filePath);

                const fileContents = fs.readFileSync(filePath, 'utf8');
                const { data, content } = matter(fileContents);

                posts.push({
                    ...data, // Metadata from frontmatter
                    content, // Markdown content
                    slug: filename.replace(/\.(md|mdx)$/, ''),
                    category,
                });
            });
        }
    });

    console.log('Found posts:', posts.map(p => `${p.category}/${p.slug}`));
    return posts;
}

// Add TypeScript interface for Post
interface Post {
    content: string;
    slug: string;
    category: string;
    title?: string;
    date?: string;
    [key: string]: any; // For other frontmatter fields
}