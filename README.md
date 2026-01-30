# Contentful Repeater App (v1)

![Contentful App](https://img.shields.io/badge/Contentful-App-blue?style=for-the-badge&logo=contentful)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A professional, custom Contentful App that introduces a **Repeater Field** capability to your content model. 

This app allows editors to create, manage, and reorder lists of key-value pairs directly within the Contentful entry editor. It seamlessly integrates with the Contentful implementation using the Forma 36 design system to ensure a native look and feel.

---

## 🚀 Features

- **Dynamic Key-Value Management**: Add, edit, and delete items in a repeater list effortlessly.
- **Native Experience**: Built with `@contentful/f36-components` to match the Contentful UI perfectly.
- **Auto-Resizing**: The app automatically adjusts its height within the entry editor for a smooth user experience.
- **Customizable Labels**: Configure the label for the "Value" field via instance parameters (e.g., change "Value" to "URL" or "Description").
- **Robust Validation**: Ensures data integrity with clean state management.
- **Professional Logging**: Integrated structured logging for easier debugging and monitoring.

## 🛠 Tech Stack

- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI System**: [Contentful Forma 36](https://f36.contentful.com/)
- **State Management**: React Hooks & Contentful App SDK
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or later)
- A Contentful account and Space
- Contentful CLI installed (`npm install -g contentful-cli`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/app-contentful-repeater-v1.git
cd app-contentful-repeater-v1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000`. 

> **Note**: Because Contentful Apps run inside an iframe within the Contentful web app, opening `http://localhost:3000` directly in your browser will show a warning message. This is expected behavior.

---

## 🔌 Contentful Configuration

To use this app in Contentful, you need to create an App Definition and then install it into your space.

### Step 1: Create App Definition

1. Log in to Contentful.
2. Go to **Organization Settings** > **Apps** > **Create App**.
3. Give it a name (e.g., "Repeater Field").
4. In **App URL**, enter `http://localhost:3000` (for development) or your hosted URL (for production).
5. Under **Locations**, check **Entry Field** and select **JSON Object**.
6. (Optional) Add an **Instance Parameter**:
   - **ID**: `valueName`
   - **Name**: Value Field Label
   - **Type**: Text
   - **Default**: Value
   - **Description**: "Custom label for the value input field."

### Step 2: Install App

1. Click **Install** in the top right corner of your App Definition.
2. Select the space and environment where you want to use it.

### Step 3: Add to Content Model

1. Go to your **Content Model**.
2. Add a new **JSON Object** field.
3. In the **Appearance** tab, select your **Repeater Field App**.

---

## 🧪 Development

### Running Tests

We use Vitest for unit testing. The test suite covers rendering, interactions, and SDK integration.

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Project Structure

```
src/
├── components/       # Shared UI components (e.g., LocalhostWarning)
├── locations/        # Main App locations (e.g., Field entry point)
│   ├── Field.tsx     # The core Repeater Field logic
│   └── Field.test.tsx # Unit tests for the Field component
├── utils/            # Helper functions (e.g., logger)
├── App.tsx           # Main router for Contentful locations
└── index.tsx         # Application entry point
```

---

## 🚢 Deployment

To deploy this app to production, you can host the static build on Vercel, Netlify, or AWS S3.

1. Build the project:
   ```bash
   npm run build
   ```
   This generates a `dist` folder.

2. Upload the `dist` folder to your hosting provider.

3. Update your **Contentful App Definition** to point to the new production URL instead of `localhost`.

Alternatively, use the Contentful CLI to host:
```bash
npm run upload
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push -u origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Prem Pratick Kumar**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
