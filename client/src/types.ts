export interface IPost {
    identifier: string;
    title: string;
    slug: string;
    subName: string;
    user: IUser;
    url: string;
    body?: string;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
    voteScore: number;
    userVote?: number;
}

export interface IUser {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}