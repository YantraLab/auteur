import type { GearType, FrameRate, AspectRatio, Resolution, ProjectType } from './types';

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
