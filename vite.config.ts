import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base:"/kanban-board/",
  plugins: [react()],
  // server: {
  //   port: 5173,
  // },
});
