<div align="center">
  <h2 align="center">Aus:Reis</h2>

  <p align="center">
     
    
  </p>
</div>

## About The Project

This is a [Next.js](https://nextjs.org/) project, created by [re:edu](https://reedu.de/).

Features:

- 🏎 Fast
- 🔐 Secure with [MinIO](https://min.io/)
- 📦 Easy setup with Docker

### Built With

- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [PrismaIO](https://www.prisma.io/)
- [Axios](https://axios-http.com/)
- [MinIO](https://min.io/)
- [Docker](https://www.docker.com/)

## Getting Started

Thgis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

### Prerequisites

Make sure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (version 20.x or highr)

- [Docker](https://www.docker.com/get-started/)

- [min.io](https://min.io/)

- A package manager like [npm](https://www.npmjs.om/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

# Installation with npm

1. Clone the reposity:

```bash
git clone https://github.com/reedu-reengineering-education/AusReis.git
```

2. Navigate to your development directory:

```bash
cd /your/dev/directory/AusReis
```

3. Based on the `.env.example` file, create a `.env` file and configure it accordingly like [this](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).

```bash
cp .env.example .env
```

4. Install npm packages

```bash
npm install
```

5. Start development DB

```bash
docker compose up -d
```

6. Migrate DB on first run

```bash
npx prisma migrate dev
```

7. Run the App

```bash
npm run dev
```

# MinIO Setup

To use MinIO as a local or cloud object storage system, follow these steps:

1. Install MinIO Use Docker to run MinIO locally:

```bash
docker run -p 9000:9000 -p 9001:9001 --name minio -d \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password" \
  minio/minio server /data --console-address ":9001"
```

This starts MinIO on ports `9000` for API access and `9001` for the administration console.

**Note: _Replace `admin` and `password` with secure values_.**

2. Access to the MinIO console:

Open the administration console at `http://localhost:9001` and log in with the specified access data (`MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`).

3. Create bucket:

Create a new bucket in the administration console, e.g. `ausreis-bucket`.

4. Configuration of the environment variables:

Add the following variables to the `.env` file:

```bash
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET=ausreis-bucket
MINIO_REGION=us-east-1
```

5. MinIO SDK-Integration:

Install the MinIO Node.js SDK:

```bash
npm install minio
```

### More information

If you want to learn more about setting up MinIO in a Next.js project, check out the following resources:

- [MinIO Setup Guide](https://docs.min.io/docs/minio-quickstart-guide.html)
- [MinIO in Node.js-Projekten integrieren](https://docs.min.io/docs/javascript-client-quickstart-guide.html)
- [Next.js API-Routen Dokumentation](https://nextjs.org/docs/api-routes/introduction)
- [Building a file storage with Next.js, PostgreSQL, and Minio S3](https://blog.alexefimenko.com/posts/file-storage-nextjs-postgres-s3)

These links provide more details and examples of how MinIO can be used in a Next.js project.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## GitHub Actions

With GitHub Actions, we automatically build Docker images and push them to the GitHub package registry.

Docker images will be built on:

Pull Requests to `main`
Pushes to `main`
Releasing new versions under a `v*.*.*` tag

## Contact

re:edu GmbH - @reedu_de - kontakt@reedu.de
