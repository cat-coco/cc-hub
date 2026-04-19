export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  traceId?: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface AuthorBrief {
  id: number;
  name: string;
  initial: string;
  avatar?: string | null;
}

export interface CategoryVO {
  id: number;
  parentId?: number | null;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  articleCount: number;
}

export interface TagVO {
  id: number;
  name: string;
  slug: string;
  articleCount: number;
}

export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  author: AuthorBrief;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  publishedAt?: string | null;
  readMinutes: number;
}

export interface ArticleDetail {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  coverImage?: string | null;
  contentMd?: string | null;
  contentHtml?: string | null;
  author: AuthorBrief;
  category?: CategoryVO | null;
  tags: TagVO[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  publishedAt?: string | null;
  readMinutes: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
}

export interface ArticleCreateReq {
  title: string;
  slug?: string;
  summary?: string;
  coverImage?: string;
  contentMd: string;
  categoryId?: number | null;
  tags?: string[];
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'OFFLINE';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isFeatured?: boolean;
  isTop?: boolean;
}

export interface SnippetVO {
  id: number;
  title: string;
  description?: string | null;
  language: string;
  code: string;
  author: AuthorBrief;
  likeCount: number;
  copyCount: number;
  createdAt?: string | null;
}

export interface ShowcaseVO {
  id: number;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  techStack: string[];
  repoUrl?: string | null;
  demoUrl?: string | null;
  author: AuthorBrief;
  starCount: number;
}

export interface ToolVO {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  url?: string | null;
  category: string;
  tags: string[];
  version?: string | null;
  license?: string | null;
  stars?: string | null;
}

export interface CommentVO {
  id: number;
  parentId?: number | null;
  userId: number;
  userName: string;
  userInitial: string;
  userAvatar?: string | null;
  content: string;
  likeCount: number;
  createdAt?: string | null;
  replies: CommentVO[];
}

export interface UserVO {
  id: number;
  username: string;
  nickname?: string | null;
  avatar?: string | null;
  email?: string | null;
  bio?: string | null;
  roles: string[];
  profile: {
    followersCount: number;
    followingCount: number;
    articleCount: number;
    level: number;
    points: number;
  };
}

export interface LoginResp {
  token: string;
  ttl: number;
  user: UserVO;
}
