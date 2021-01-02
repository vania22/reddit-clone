export interface IPost {
    identifier: string;
    title: string;
    slug: string;
    subName: string;
    sub?: ISub;
    user: IUser;
    url: string;
    body?: string;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
    comments?: IComment[];
    voteScore: number;
    userVote?: number;
}

export interface IComment {
    body: string;
    identifier: string;
    username: string;
    createdAt: string;
    updatedAt: string;
    userVote?: number;
    voteScore: number;
}

export interface IUser {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface ISub {
    name: string;
    title?: string;
    description?: string;
    posts: IPost[];
    imageUrl: string;
    bannerUrl?: string;
    createdAt: string;
    updatedAt: string;
    user: IUser;
    postCount?: string;
}
