export interface Question {
  id: number;
  author: number;
  text: string;
  events: Comment[];
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  bookmarked: boolean;
  flagged: boolean;
  flags: number;
}

export interface Comment {
  id: number;
  text: string;
  time: string;
  liked: boolean;
  likes: number;
  flagged: boolean;
  flags: number;
}

export interface MongoDoc {
  data: {
    adks: Record<string, any>[];
  };
  save: () => Promise<any>;
  changeStream: any;
}
