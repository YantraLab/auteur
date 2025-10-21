# Auteur - Your AI-Powered Filmmaking Studio

![Auteur Logo](auteur-logo.svg)

**Auteur is a web-based, AI-powered studio that empowers filmmakers, content creators, and storytellers to move from a spark of an idea to a fully-realized production plan with unprecedented speed and creativity.**

It's a digital workspace that combines flexible idea management with the powerful generative capabilities of Google's Gemini API, transforming fragmented notes and images into professional scripts, visual guides, and production documents.

---

### ✨ Core Features

Auteur is designed to be an intuitive and powerful partner throughout the pre-production process.

*   **🧠 AI Script & Cinematography Generation:** At the heart of Auteur is its ability to synthesize your ideas. Combine notes from your Ideaboards, images from Moodboards, your specific cinematic style, project settings, and even your personal gear inventory. With a single click, Auteur generates a complete, professionally formatted script, a detailed visual style guide, and a practical cinematography plan with shot lists and specific gear recommendations.

*   **📋 Dynamic & Specialized Boards:** Your project workspace is a flexible grid of boards. You're not limited to just one type:
    *   **Ideaboard:** Quickly jot down text-based notes and concepts.
    *   **Moodboard & Storyboard:** Collect inspirational images, upload your own, and add captions.
    *   **Document Boards:** Utilize a suite of templates for professional filmmaking documents, including:
        *   Story Treatments
        *   Character Profiles
        *   Budget Breakdowns
        *   Shot Lists
        *   Equipment Checklists
        *   Crew Contact Lists
        *   ...and more!

*   **🤖 AI-Powered Storyboarding:** Don't just find images—create them. On any Storyboard, you can type a description of a scene or shot, and Auteur's integrated image generation AI will create a visual representation for you, helping you bring your vision to life instantly.

*   **📷 Smart Gear Management:** Log all your cameras, lenses, microphones, and other equipment in the Gear Manager. The AI uses this specific inventory to provide practical, actionable cinematography advice tailored to the tools you actually own.

*   **🎨 Interactive Visualizations:** For Character Profiles and Crew Contact Lists, Auteur offers a unique full-screen "Chroma View"—an interactive grid of stunning, holographic profile cards that bring your cast and crew to life in a visually engaging way.

*   **HELPDESK and FAQ:** Got a question? The built-in Help Desk provides a comprehensive FAQ and a specialized AI Chatbot trained to assist *only* with Auteur-related issues, ensuring you get the help you need without leaving the app.

---

### 🚀 Getting Started: A Quick Guide

1.  **Create a Project:** In the sidebar, click `+ New Project`. Your new workspace will appear. Give it a name by clicking the title at the top.
2.  **Add Your Ideas:**
    *   Use the default **Ideaboard** to write down story concepts, dialogue snippets, or random thoughts.
    *   Click `Add Board` to create a **Moodboard**. Upload images that capture the tone and feel of your project.
3.  **Define Your Style:** Open the **Project Settings**. Here you can set the technical specs (aspect ratio, resolution) and, most importantly, define the **Cinematic Style**. Use the presets or write your own detailed description.
4.  **Log Your Gear:** Click `Manage Gear` in the sidebar and add your filmmaking equipment. The more specific you are, the better the AI's recommendations will be.
5.  **Generate!** Once you have some ideas, a style, and your gear logged, click the big `Generate Script & Cinematography` button. Watch as Auteur creates new boards containing your script and production plan.

---

### 🛠️ Tech Stack

Auteur is built with a modern, performant, and reliable technology stack:

*   **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
*   **AI Engine:** [Google Gemini API](https://ai.google.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)

---

### 🔌 Plugin Architecture

Auteur is built on a flexible plugin architecture, allowing developers to easily create and add their own custom board types. All of the core boards (like Ideaboard and Moodboard) are built using this same system.

A plugin is a simple object that registers itself with the application and provides the necessary components for rendering. Here's the basic structure of a plugin definition:

```typescript
// plugins/my-plugin/index.ts
import { registerPlugin } from '../../pluginSystem/pluginRegistry';
import { MyPluginView } from './MyPluginView';
import { MyIcon } from '../../components/icons';

const myPlugin = {
    type: 'PLUGIN_MY_COOL_BOARD', // A unique identifier
    title: 'My Cool Board',         // Name in the UI
    description: 'A short description.',
    icon: MyIcon,                  // React component for the icon
    boardComponent: MyPluginView,    // React component for the board view
};

export function initializeMyPlugin() {
    registerPlugin(myPlugin);
}
```

To add your plugin to the app, simply import and call your initializer function in `plugins/index.ts`.

---

### ❤️ Contributing

We believe in the power of collaboration and welcome contributions from the community! Whether you're fixing a bug, proposing a new feature, or improving documentation, your help is valued.

**How to Contribute:**

1.  **Fork the repository** on GitHub.
2.  **Clone your fork:** `git clone https://github.com/YOUR-USERNAME/auteur.git`
3.  **Set up your environment:**
    *   In the root of the project, create a new file named `.env`.
    *   Inside the `.env` file, add the following line, replacing the placeholder with your actual API key:
        ```
        API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
        ```
    *   *Note: The `.env` file is included in `.gitignore` and should never be committed to the repository.*
4.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/my-awesome-feature`
5.  **Make your changes** and commit them with clear, descriptive messages.
6.  **Push to your branch:** `git push origin feature/my-awesome-feature`
7.  **Open a Pull Request** against the `main` branch of the original repository.

Please read our `CONTRIBUTING.md` for more detailed guidelines and our code of conduct.

---

### ⭐ Sponsor This Project

Auteur is a passion project dedicated to enhancing the creative process for filmmakers everywhere. If you find it useful or believe in its vision, please consider sponsoring its development.

Your sponsorship helps us cover API costs, dedicate more time to development, and build a sustainable future for the project.

**[➡️ Become a Sponsor on GitHub](https://github.com/sponsors/priyankt3i)**

---

### 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
