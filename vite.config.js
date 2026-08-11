import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const dbFilePath = path.resolve(process.cwd(), 'public', 'db.json')

function localDbPlugin() {
  return {
    name: 'local-db-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/db') {
          if (req.method === 'GET') {
            if (fs.existsSync(dbFilePath)) {
              try {
                const data = fs.readFileSync(dbFilePath, 'utf8')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(data)
              } catch (e) {
                res.writeHead(500)
                res.end(JSON.stringify({ error: 'Failed to read database' }))
              }
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ status: 'no_db' }))
            }
            return
          }
          
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                JSON.parse(body)
                fs.writeFileSync(dbFilePath, body, 'utf8')
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              } catch (e) {
                res.writeHead(400)
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localDbPlugin()],
  server: {
    port: 5174,
    strictPort: true
  }
})
