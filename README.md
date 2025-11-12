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

The frontend now reads its API base URL from the `VITE_API_BASE_URL` environment variable. When you run `npm run dev`, leaving the
variable unset will automatically target the upstream backend at `http://123.176.35.22:8082/api`, so local development does not
require the proxy. In production builds the app defaults back to `/api`, which keeps requests on the same origin as the Express
proxy.

When you deploy the static bundle, serve it with the provided Express proxy (`npm run serve`). The server forwards every request
under `/api` to your backend while adding the required CORS headers, so the browser never calls the backend directly.

> **Tip for local smoke-tests:** If you build the app and open it from `localhost` (for example by running the Express proxy on
> your laptop), the frontend now falls back to the upstream backend automatically so you can skip configuring the proxy while
> developing locally. Set `VITE_API_BASE_URL=/api` before building when you want to exercise the proxy behaviour.

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Dev: `http://123.176.35.22:8082/api` (when unset), Prod: `/api` (except on `localhost`) | Base URL used by the frontend. Set this if you need to override the default per-environment values. |
| `PROXY_TARGET` | `http://123.176.35.22:8082` | Origin of the backend API. |
| `PROXY_TARGET_PATH` | `/api` | Path prefix on the backend that should receive proxied requests. |
| `PROXY_PREFIX` | `/api` | Path prefix exposed by the Express proxy. |
| `PORT` | `4173` | Port the proxy listens on. |
| `CORS_ALLOW_ORIGIN` | *(empty)* | Optional explicit `Access-Control-Allow-Origin` header sent by the proxy. |

### Running the proxy in production

1. Build the frontend with `npm run build` (set `VITE_API_BASE_URL=/api` if the proxy is mounted at `/api`).
2. Start the proxy with `PORT=80 PROXY_TARGET=http://123.176.35.22:8082 npm run serve`.
3. Point your browser to the server's origin (e.g. `https://your-ec2-hostname`) and the app will transparently proxy API requests
   to the backend without requiring backend CORS support.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
