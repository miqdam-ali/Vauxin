# Vauxin

**Vauxin** is a high-performance full-stack task management platform built with Next.js, featuring secure authentication, dynamic user profiles set up, and smooth CRUD workflows.

## 🚀 Key Features

* **Authentication:** Secure user registration, login / signup and deletion of account.
* **Profiles:** Dynamic user profile setups allowing personalized settings, and avatars
* **Workflows:** Smooth, ultra-fast CRUD operations for real-time task creation, updates and completion tracking.
* **Performance:** Fast page transitions and optimal server-side rendering powered by Next.js.
* **Secure:** Secured by SSR and CSR along with middleware

## 🛠️ Architecture & Tech Stack

* **Framework:** Next.js (App Router) / React
* **Authentication:** NextAuth.js / Supbase
* **Database & ORM:** Supbase / Supabase Postgree SQL
* **Styling:** Tailwind CSS  for polished, minimalist components
* **Deployment:** Optimized for Vercel

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
* Node.js (v18.x or higher)
* npm / yarn / pnpm

### Installation & Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd vauxin
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Your Environment Variables:**
   A `.env.example` file is included in the root directory. Duplicate this file, rename it to `.env.local`, and supply your own database credentials and API secrets:
  
4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to access your local instance of Vauxin.

## 📄 License

Distributed under the MIT License. See 

`LICENSE` for more information.
