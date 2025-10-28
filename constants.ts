import type { GearType, FrameRate, AspectRatio, Resolution, ProjectType, ProjectTemplate } from './types';
import { CameraIcon, RectangleStackIcon, FolderIcon, SparklesIcon } from './components/icons';

export const FRAME_RATES: FrameRate[] = ['24fps', '25fps', '30fps', '60fps', '120fps'];
export const ASPECT_RATIOS: AspectRatio[] = ['16:9', '4:3', '1.85:1', '2.39:1 (Scope)'];
export const RESOLUTIONS: Resolution[] = ['1080p (HD)', '4K (UHD)', '6K', '8K'];
export const PROJECT_TYPES: ProjectType[] = ['Short Video', 'Series'];

export const GEAR_CATEGORIES: GearType[] = ['Camera', 'Lens', 'Tripod', 'Gimbal', 'Filter', 'Microphone', 'Light', 'Flash'];

export const GEAR_SUGGESTIONS: Record<GearType, string[]> = {
    Camera: ['Sony A7S III', 'Blackmagic Pocket Cinema Camera 6K Pro', 'Canon EOS C70', 'ARRI ALEXA Mini LF', 'RED KOMODO 6K', 'iPhone 15 Pro'],
    Lens: ['Sigma 24-70mm f/2.8 DG DN Art', 'Sony FE 85mm f/1.8', 'Canon RF 50mm f/1.2L USM', 'Sirui 50mm T2.9 1.6x Anamorphic', 'Laowa 24mm f/14 Probe Lens'],
    Tripod: ['Manfrotto 504X', 'Sachtler Flowtech 75', 'Peak Design Travel Tripod', 'Benro Rhino'],
    Gimbal: ['DJI RS 3 Pro', 'Zhiyun Crane 3S', 'Moza AirCross 2'],
    Filter: ['Tiffen Black Pro-Mist 1/4', 'PolarPro PMVND Signature Edition II', 'Hoya Solas IRND 1.8'],
    Microphone: ['Sennheiser MKH 416', 'Rode VideoMic NTG', 'Shure SM7B', 'Tentacle Sync Track E'],
    Light: ['Aputure 600d Pro', 'Nanlite Forza 60B', 'Godox VL150', 'Astera Titan Tube'],
    Flash: ['Godox V1', 'Profoto A1X'],
};

export const PREDEFINED_STYLES: { name: string; prompt: string; }[] = [
    { name: 'Cinematic Thriller', prompt: 'A tense, suspenseful style with high-contrast, low-key lighting. Use of shadows, cool color palettes (blues and grays), and slow, deliberate camera movements to build tension. Inspired by David Fincher.' },
    { name: 'Wes Anderson Whimsy', prompt: 'Symmetrical compositions, flat space camera moves (pans, tilts, tracking shots), and a distinct, pastel-heavy color palette. Quirky, deadpan humor with meticulous production design.' },
    { name: 'Documentary (Ken Burns)', prompt: 'Classic documentary style using archival photos with slow pans and zooms (the "Ken Burns effect"), intimate interviews, and a calm, authoritative narration. Focus on historical and emotional storytelling.' },
    { name: 'Sci-Fi Noir', prompt: 'A blend of science fiction and film noir. High-contrast lighting, neon-lit cityscapes, rain-slicked streets, and a sense of futuristic melancholy. Inspired by Blade Runner.' },
    { name: 'Golden Hour Romance', prompt: 'Warm, soft, and romantic visuals. Extensive use of natural light during golden hour. Shallow depth of field, gentle camera movements, and a warm, saturated color palette. Inspired by Terrence Malick.' },
    { name: 'Action Blockbuster', prompt: 'Dynamic, fast-paced visuals with wide-angle lenses, quick cuts, and energetic camera movements (handheld, drone shots). Saturated colors, high production value, and epic-scale action sequences. Inspired by Michael Bay.' },
    { name: 'Mumblecore Indie', prompt: 'Naturalistic and improvisational. Handheld camera work, available lighting, and a focus on realistic dialogue and character interactions. Low-budget, authentic feel.' },
    { name: 'Vsauce Style', prompt: 'Curious, fast-paced, visual, and highly engaging. Often shot indoors with a mix of direct-to-camera presentation, quick cuts to graphics, stock footage, and physical demonstrations. Intellectual yet accessible tone.' },
];

export const BUDGET_TEMPLATE_STRUCTURE = [
    {
        category: 'Above the Line',
        items: [
            { name: 'Story Rights' },
            { name: 'Screenwriter' },
            { name: 'Producer' },
            { name: 'Director' },
            { name: 'Principal Cast' },
        ],
    },
    {
        category: 'Production',
        items: [
            { name: 'Production Staff' },
            { name: 'Camera Department' },
            { name: 'Grip & Electric' },
            { name: 'Sound Department' },
            { name: 'Production Design' },
            { name: 'Wardrobe Department' },
            { name: 'Hair & Makeup' },
            { name: 'Locations' },
            { name: 'Production Office' },
        ],
    },
    {
        category: 'Post-Production',
        items: [
            { name: 'Editor' },
            { name: 'Assistant Editor' },
            { name: 'Visual Effects (VFX)' },
            { name: 'Color Grading' },
            { name: 'Sound Design & Mixing' },
            { name: 'Music Composition' },
            { name: 'Titles & Graphics' },
        ],
    },
    {
        category: 'Other',
        items: [
            { name: 'Insurance' },
            { name: 'Legal Fees' },
            { name: 'Marketing & Distribution' },
            { name: 'Festival Fees' },
        ],
    },
];

export const SINGLETON_BOARD_TYPES: string[] = [
    'DOCUMENT_SCRIPT',
    'DOCUMENT_VISUAL_STYLE',
    'DOCUMENT_CINEMATOGRAPHY',
    'DOCUMENT_STORY_TREATMENT',
    'DOCUMENT_SHOT_LIST',
    'DOCUMENT_CHARACTER_PROFILE',
    'DOCUMENT_SCRIPT_BREAKDOWN',
    'DOCUMENT_CALL_SHEET',
    'DOCUMENT_BUDGET',
    'DOCUMENT_EQUIPMENT_CHECKLIST',
    'DOCUMENT_CREW_CONTACT_LIST',
    'DOCUMENT_CONTINUITY_LOG',
    'PLUGIN_LOGLINE_TESTER',
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
    {
        name: 'Blank Project',
        description: 'Start fresh with a single ideaboard and build your vision from the ground up.',
        icon: SparklesIcon,
        boards: [
            { type: 'IDEABOARD', title: 'Ideaboard', notes: [], x: 0, y: 0, w: 1, h: 2 },
        ],
    },
    {
        name: 'Short Film',
        description: 'A structured template for narrative filmmaking, from script to production planning.',
        icon: CameraIcon,
        boards: [
            { type: 'IDEABOARD', title: 'Brainstorming & Ideas', notes: [], x: 0, y: 0, w: 1, h: 2 },
            { type: 'DOCUMENT_STORY_TREATMENT', title: 'Story Treatment', content: '', x: 1, y: 0, w: 2, h: 3 },
            { type: 'DOCUMENT_CHARACTER_PROFILE', title: 'Character Profiles', content: '[]', x: 0, y: 2, w: 1, h: 3 },
            { type: 'DOCUMENT_SCRIPT', title: 'Script', content: '', x: 1, y: 3, w: 2, h: 4 },
        ],
    },
    {
        name: 'Documentary',
        description: 'Organize your research, interviews, and structure for non-fiction storytelling.',
        icon: RectangleStackIcon,
        boards: [
            { type: 'IDEABOARD', title: 'Research & Key Points', notes: [], x: 0, y: 0, w: 1, h: 3 },
            { type: 'DOCUMENT_STORY_TREATMENT', title: 'Narrative Outline', content: '', x: 1, y: 0, w: 2, h: 3 },
            { type: 'DOCUMENT_CREW_CONTACT_LIST', title: 'Interview Subjects', content: '[]', x: 0, y: 3, w: 1, h: 2 },
            { type: 'DOCUMENT_EQUIPMENT_CHECKLIST', title: 'Gear Checklist', content: '[]', x: 1, y: 3, w: 1, h: 2 },
        ],
    },
    {
        name: 'Web Series',
        description: 'Plan your episodic content with boards for series-level and episode-specific development.',
        icon: FolderIcon,
        boards: [
            { type: 'DOCUMENT_STORY_TREATMENT', title: 'Series Bible', content: '', x: 0, y: 0, w: 2, h: 3 },
            { type: 'DOCUMENT_CHARACTER_PROFILE', title: 'Main Characters', content: '[]', x: 0, y: 3, w: 1, h: 3 },
            { type: 'DOCUMENT_SCRIPT', title: 'Episode 1 Script', content: '', x: 1, y: 3, w: 2, h: 4 },
            { type: 'DOCUMENT_BUDGET', title: 'Series Budget', content: '', x: 2, y: 0, w: 1, h: 3 },
        ],
    }
];