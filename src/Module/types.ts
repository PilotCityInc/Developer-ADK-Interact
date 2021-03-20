import { ObjectId } from 'bson';

export interface Question {
  _id: ObjectId;
  author: number;
  text: string;
  comments: Comment[];
  likes: number;
  dislikes: number;
  flags: number;
}

export interface Comment {
  _id: ObjectId;
  text: string;
  time: string;
  likes: number;
  flags: number;
}

export interface MongoDoc {
  data: {
    [x: string]: any;
  };
  update: (shouldMarkAsComplete?:any) => Promise<any>;
  changeStream: any;
}
