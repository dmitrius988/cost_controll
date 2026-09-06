# Cost Control - Shared Expense Tracker

## 1. Project Overview
A bilingual (English/Russian) web application designed to track shared expenses between two or more people. The app features a dark-themed, functional UI, and can be compiled into an Android APK. It provides insights into spending habits, attributing every expense to the user who entered it.

## 2. Recommended Tech Stack
To achieve a seamless web app that easily ports to a mobile APK, the following stack is recommended:
* **Frontend Framework**: **React** (via Vite) - Fast, component-based, and highly supported.
* **Styling**: **Tailwind CSS** - Makes building a beautiful, responsive, and default **Dark Mode** UI incredibly fast.
* **Backend & Database**: **Supabase** - An open-source Firebase alternative. It provides a PostgreSQL database, real-time subscriptions, and built-in Authentication.
* **Internationalization (i18n)**: **react-i18next** - For seamless switching between English and Russian.
* **Mobile Porting**: **Capacitor (by Ionic)** - A cross-platform native runtime that makes it trivial to take a React web app and bundle it into an **Android APK**.
* **Charts/Analytics**: **Recharts** or **Chart.js** - For visual analytics (trends, pie charts).

## 3. Core Features
* **Authentication**: Simple email/password or magic link login for you and your brother.
* **Dashboard**: 
  * Quick overview of the current month's spending.
  * Recent transactions list (showing *who* paid, amount, and category).
* **Add Expense**:
  * Fields: Amount (e.g., in UZS), Category (Groceries, Rent, Transport, etc.), Note, Date.
  * Automatically tags the logged-in user as the payer.
* **Analytics**:
  * **Spend Trends**: Line chart showing expenses over time (higher/lower).
  * **Top Categories**: Pie chart of where the money is going.
  * **User Split**: Bar chart showing who is spending the most.
* **Settings**:
  * Language Toggle (EN/RU).
  * (Optional) Currency defaults.

## 4. Database Schema (Supabase / PostgreSQL)
A simple schema to get started:

**Table: `profiles`**
* `id` (uuid, references auth.users)
* `full_name` (text)
* `avatar_url` (text)

**Table: `expenses`**
* `id` (uuid, primary key)
* `amount` (numeric)
* `currency` (text, default 'UZS')
* `category` (text)
* `description` (text)
* `created_by` (uuid, references profiles.id) - *Tracks who added it*
* `date` (date, default today)
* `created_at` (timestamp)

## 5. Development Roadmap

### Phase 1: Setup & Scaffolding
- [ ] Initialize React Vite project.
- [ ] Set up Tailwind CSS with Dark Mode as default.
- [ ] Configure `react-i18next` with initial `en` and `ru` translation JSON files.
- [ ] Initialize Supabase project and connect it to the React app.

### Phase 2: Backend & Authentication
- [ ] Create Supabase database tables (`profiles`, `expenses`).
- [ ] Set up Row Level Security (RLS) policies so only you and your brother can read/write data.
- [ ] Build Login/Signup UI.
- [ ] Implement Authentication flow.

### Phase 3: Core Application UI
- [ ] Build the layout (Navbar/Bottom Tab bar for mobile feel).
- [ ] Build the **Dashboard** to fetch and display the latest expenses from Supabase.
- [ ] Build the **Add Expense** form/modal.
- [ ] Ensure all UI text is wired to the i18n translation files.

### Phase 4: Analytics & Visuals
- [ ] Integrate a charting library (Recharts).
- [ ] Build the **Analytics Tab**.
- [ ] Implement data aggregation (summing up expenses by category, by person, and by month).
- [ ] Render charts comparing spending.

### Phase 5: Android Build (APK)
- [ ] Install and configure Capacitor in the React project.
- [ ] Add the Android platform (`npx cap add android`).
- [ ] Sync the web build to the Android project (`npx cap sync`).
- [ ] Open in Android Studio to build and generate the signed/unsigned `.apk` file.

### Phase 6: Testing & Refinement
- [ ] Test on a physical Android device.
- [ ] Refine UI/UX (button sizes for touch, dark mode contrast).
- [ ] Finalize Russian translations.

## 6. Next Steps to Begin
To kick this off, we should start with **Phase 1**. 
Once you review and approve this roadmap, I will run the commands to scaffold the React project, configure Tailwind, and set up the folder structure right here in `c:\cost_controll`.
