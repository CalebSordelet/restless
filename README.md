# RESTless

RESTless is a minimal, fast, and open-source tool for testing REST APIs. Built with React, TypeScript, Vite, and TailwindCSS, it provides a clean, bloat-free interface for developers to interact with APIs—no sign-up, no clutter, just the essentials.

---

## Features

- **Request Builder:**  
  Easily craft HTTP requests with customizable method, URL, headers, and body.  
  Supports GET, POST, PUT, DELETE, PATCH.

- **Request History:**  
  Automatically saves your requests and responses locally.  
  Quickly re-run or inspect previous requests.  
  Clear history with a single click.

- **Response Viewer:**  
  Displays status, headers, and body with pretty/raw toggle.  
  Copy raw headers or body to clipboard with one click.  
  Animated status indicator for new responses.

- **Theme Toggle:**  
  Switch between light and dark mode instantly.

- **Persistent Storage:**  
  Request history is saved in localStorage for convenience.

- **Responsive Design:**  
  Works great on desktop and mobile.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```sh
git clone https://github.com/CalebSordelet/restless.git
cd restless
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

---

## Project Structure

```
src/
  components/
    RequestBuilder.tsx
    RequestHistory.tsx
    ResponseViewer.tsx
    ThemeToggle.tsx
    colorUtils.ts
  App.tsx
  App.css
  index.css
  main.tsx
  vite-env.d.ts
Firebase.tsx
```

- **App.tsx:** Main layout and state management.
- **RequestBuilder.tsx:** Form for building and sending requests.
- **RequestHistory.tsx:** Displays and manages request history.
- **ResponseViewer.tsx:** Shows response details.
- **ThemeToggle.tsx:** Light/dark mode switch.
- **colorUtils.ts:** Utility for coloring status codes.

---

## Customization

- **Styling:**  
  Uses [TailwindCSS](https://tailwindcss.com/) for rapid UI development.
- **Animation:**  
  Powered by [Framer Motion](https://www.framer.com/motion/) for smooth transitions.

---

## Contributing

Pull requests and issues are welcome!  
See [GitHub](https://github.com/CalebSordelet/restless) for details.

---

## License

MIT

---

## Support

If you find RESTless useful, consider [buying me a beer](https://coff.ee/calebsordelet) 🍺

---

## Credits

Created by [Caleb Sordelet](https://github.com/CalebSordelet)

---

## Advanced ESLint Setup

For production, enable type-aware lint rules and React-specific plugins.  
See the [README template](https://github.com/vitejs/vite-plugin-react) for
