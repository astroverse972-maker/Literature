export type LiteratureType = 'Poem' | 'Essay' | 'Short Story';

export interface Literature {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  type: LiteratureType;
  content: string;
  excerpt?: string;
  published_date: string;
}

export type LiteratureDTO = Omit<Literature, 'id' | 'created_at' | 'updated_at'>;

export interface Comment {
    id: string;
    created_at: string;
    literature_id: string;
    author_name: string;
    content: string;
}

export type CommentDTO = Omit<Comment, 'id' | 'created_at' | 'literature_id'> & { literature_id: string };