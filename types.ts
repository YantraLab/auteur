// FIX: Add a type-only import for React to resolve the "Cannot find namespace 'React'" error.
import type React from 'react';
import type { NoteType, TextNote, ImageNote, Note } from './notes';
export * from './notes';

// FIX: Add type definition for lottie-player custom element.
// This global declaration makes the type available in all JSX files, resolving errors when using the custom element.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        background?: string;
        speed?: string;
        autoplay?: boolean;
        loop?: boolean;
        controls?: boolean;
      }, HTMLElement>;
    }
  }
}

export type GearType = 'Camera' | 'Lens' | 'Tripod' | 'Gimbal' | 'Filter' | 'Microphone' | 'Light' | 'Flash';

export interface GearItem {
  id: string;
  name: string;
  type: GearType;
}

export interface Gear {
  items: GearItem[];
}

export type FrameRate = '24fps' | '25fps' | '30fps' | '60fps' | '120fps';
export type AspectRatio = '16:9' | '4:3' | '1.85:1' | '2.39:1 (Scope)';
export type Resolution = '1080p (HD)' | '4K (UHD)' | '6K' | '8K';
export type ProjectType = 'Short Video' | 'Series';

export interface ProjectSettings {
  frameRate: FrameRate;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  style: string;
  projectType: ProjectType;
}

// --- USER TYPES ---
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  color: string; // hex color for cursors, borders, etc.
}

// --- NOTIFICATION TYPES ---
export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}


// --- BOARD TYPES ---

// BoardType is now a flexible string to allow for custom plugin types.
export type BoardType = string;
  
// DocumentType is now a flexible string.
export type DocumentType = string;

// The Board interface is now a single, flexible structure.
// Plugins are responsible for managing their specific data within these optional fields.
export interface Board {
  id: string;
  title: string;
  type: BoardType;
  notes?: Note[]; // Primarily used by note-based boards like Ideaboard, Moodboard
  content?: string; // Used by document boards, can be markdown, JSON, or any string data
  documentType?: DocumentType; // Kept for potential categorization or legacy reasons
  
  // New layout properties
  x: number; // grid column start
  y: number; // grid row start
  w: number; // width in grid columns
  h: number; // height in grid units
  
  // New collaboration properties
  focusedUserId?: string | null;
}

// --- PROJECT TEMPLATE TYPES ---

// A board definition for a template. ID is optional as it will be generated on creation.
export type TemplateBoard = Omit<Board, 'id' | 'focusedUserId'>;

export interface ProjectTemplate {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  boards: TemplateBoard[];
}


export interface Project {
  id:string;
  name: string;
  boards: Board[];
  settings: ProjectSettings;
  activeUserIds: string[]; // IDs of users currently "in" this project
}