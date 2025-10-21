export type NoteType = 'text' | 'image';

export interface BaseNote {
  id: string;
  type: NoteType;
}

export interface TextNote extends BaseNote {
  type: 'text';
  content: string;
}

export interface ImageNote extends BaseNote {
  type: 'image';
  imageUrl: string; // base64 data URL
  caption: string;
}

export type Note = TextNote | ImageNote;
