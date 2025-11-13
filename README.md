# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/aeff9ba2-9024-4041-8663-5ef161d61f15

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/aeff9ba2-9024-4041-8663-5ef161d61f15) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/aeff9ba2-9024-4041-8663-5ef161d61f15) and click on Share -> Publish.

## Configuring the API proxy for production deployments

The frontend talks to two backend services:

- The **configuration service** exposed under `http://123.176.35.22:8081/swagger-ui/index.html`.
- The **admin service** exposed under `http://123.176.35.22:8082/swagger-ui/index.html`.

In development the Vite dev server automatically proxies requests so the browser never contacts those origins directly.
For production deployments serve the built assets with the provided Express server (`npm run serve`). It exposes dedicated
proxy routes for each backend, adds CORS headers and forwards requests transparently.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8085` | Port the Express server listens on. |
| `STATIC_DIR` | `../dist` | Folder that contains the built frontend assets. |
| `CONFIG_PROXY_PREFIX` | `/config-api` | Route prefix exposed by the server for the configuration service. |
| `CONFIG_PROXY_TARGET` | `http://123.176.35.22:8081` | Target origin for configuration service requests. |
| `ADMIN_PROXY_PREFIX` | `/admin-api` | Route prefix exposed by the server for the admin service. |
| `ADMIN_PROXY_TARGET` | `http://123.176.35.22:8082` | Target origin for admin service requests. |
| `CORS_ALLOW_ORIGIN` | *(empty)* | Optional comma-separated list of allowed origins. If unset the server reflects the request origin. |
| `VITE_CONFIG_API_BASE_URL` | `/config-api` (dev) | Override to point the frontend at a different configuration API base URL. |
| `VITE_ADMIN_API_BASE_URL` | `/admin-api` (dev) | Override to point the frontend at a different admin API base URL. |

### Running the proxy in production

1. Build the frontend with `npm run build`.
2. Start the proxy with `PORT=8085 npm run serve` (set the `*_PROXY_TARGET` variables if you need different backend origins).
3. Point your browser to the server's origin (e.g. `http://your-host:8085`) and the app will transparently proxy API requests
   to the backend services without requiring backend-side CORS support.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
