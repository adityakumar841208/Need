# Need - A Next.js Project

This is a **Next.js** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## ✨ Features

- ⚡ Built with **Next.js** and **TypeScript**
- 🎨 UI components using **ShadCN** with **light and dark mode** support
- 📦 State management with **Redux Toolkit**
- 🛠 Optimized with **Tailwind CSS** for styling
- 🌍 Server-side rendering (SSR) and static site generation (SSG) for better performance
- ☁️ Easily deployable on **Vercel**

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** installed. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/need.git
   cd need
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 📁 Project Structure

```
need/
├── components/      # Reusable UI components (ShadCN UI)
├── hooks/          # Custom hooks
├── store/          # Redux store and slices
├── app/            # Next.js App Router structure
│   ├── layout.tsx  # Root layout
│   ├── page.tsx    # Homepage
│   ├── api/        # Backend API routes (if needed)
├── styles/         # Global styles and Tailwind config
├── public/         # Static assets
├── next.config.js  # Next.js configuration
├── tailwind.config.js # Tailwind CSS config
└── tsconfig.json   # TypeScript configuration
```

## 🎨 Theme Toggle (Light & Dark Mode)

This project supports **light and dark mode** using `next-themes` and **ShadCN UI**. The mode toggle can be found in the UI components.

## 📚 Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [ShadCN UI](https://ui.shadcn.com/) - Custom UI components for Next.js projects.
- [Redux Toolkit](https://redux-toolkit.js.org/) - Efficient state management for React apps.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.

---

💡 **Contributions and feedback are welcome!** Feel free to open issues or pull requests to improve this project.
