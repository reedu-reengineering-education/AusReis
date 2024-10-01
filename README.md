<!-- <div align="center">
  <h2 align="center">Aus:Reis</h2>

  <p align="center">


  </p>
</div>

## About The Project

This is a [Next.js](https://nextjs.org/) project, created by [re:edu](https://reedu.de/).

Features:

- 🏎 Fast
- 🔐 Secure with [MinIO](https://min.io/)
- 📦 Easy setup with Docker // was kann die app machen soll hier stehen

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

- [Docker](https://www.docker.com/get-started/) //  in das dev setup

- [min.io](https://min.io/) // in das dproduction setup

- A package manager like [npm](https://www.npmjs.om/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

# Installation with npm

1. Clone the reposity: // in das dev setup

```bash
git clone https://github.com/reedu-reengineering-education/AusReis.git
```

2. Navigate to your development directory:

```bash
cd /your/dev/directory/AusReis // in das dev setup aber nur mit ausreis
```

3. Based on the `.env.example` file, create a `.env` file and configure it accordingly like [this](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables).  kopiere die .env.example und fülle die felder aus

```bash
cp .env.example .env
```

**MinIO setup for the `.env` file:**

- `MINIO_SECRET_KEY`: Required, enter your own secure password here.
- `MINIO_ENDPOINT`: By default `http://localhost:9000`
- `MINIO_ACCESS_KEY`: By default `admin`
- `MINIO_BUCKET`: By default `ausreis-bucket`
- `MINIO_REGION`: By default `us-east-1`

_Example for the `.env` file configuration:_

```bash
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET=ausreis-bucket
MINIO_REGION=us-east-1
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

4. Set environment variables:

Most environment variables can be left as they are. Only the `MINIO_SECRET_KEY` must be defined to ensure access to the MinIO server. All other variables are already provided with default values that should work in a local development environment:

- `MINIO_SECRET_KEY`: Required, enter your own secure password here.
- `MINIO_ENDPOINT`: By default `http://localhost:9000`
- `MINIO_ACCESS_KEY`: By default `admin`
- `MINIO_BUCKET`: By default `ausreis-bucket`
- `MINIO_REGION`: By default `us-east-1`

_Example for the `.env` file configuration:_

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

re:edu GmbH - @reedu_de - kontakt@reedu.de -->
<div align="center"> <h2 align="center">Aus:Reis</h2> <p align="center"> A flexible and fast solution for managing expenses and travel costs, either self-hosted or in the cloud. </p> <p align="center"> <strong>Open-Source</strong> · 100% JavaScript/TypeScript · <strong>Next.js</strong> </p> <img src="/background.svg" alt="Aus:Reis Logo" width="200"/> </div>

## About the Project

Aus:reis is an open-source application for managing expenses and travel costs that was developed entirely with [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io/). The app is fast, flexible and can be hosted both locally and in the cloud. It offers complete control over your own data and workflows. This project is created by [re:edu](https://reedu.de/).

**Features**:

- 📂 Expense and travel cost management with file storage

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Production Setup](#production-setup)
4. [MinIO Setup](#minio-setup)
5. [Contributing](#contributing)
6. [Contact](#contact)

---

## Getting Started

This section covers the steps for setting up both **development** and **production** environments.

### Prerequisites

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (version 20.x or higher)
- [Docker](https://www.docker.com/get-started/)
- [MinIO](https://min.io/)
- A package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

---

## Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/reedu-reengineering-education/AusReis.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd AusReis
   ```

3. **Create a `.env` file based on the example**:

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**:
   Set the following variables in your `.env` file (most are pre-configured for local development):

   ```bash
   MINIO_ENDPOINT=http://localhost:9000
   MINIO_ACCESS_KEY=admin
   MINIO_SECRET_KEY=your_secure_password
   MINIO_BUCKET=ausreis-bucket
   MINIO_REGION=us-east-1
   ```

5. **Install npm packages**:

   ```bash
   npm install
   ```

6. **Start the development database**:

   ```bash
   docker compose up -d
   ```

7. **Run Prisma migrations**:

   ```bash
   npx prisma migrate dev
   ```

8. **Start the application**:

   ```bash
   npm run dev
   ```

---

## Production Setup

1. **Configure environment variables for production**:
   Create a secure `.env` file with production-ready values:

   ```bash
   MINIO_ENDPOINT=https://your-production-minio-endpoint
   MINIO_ACCESS_KEY=your-production-access-key
   MINIO_SECRET_KEY=your-production-secret-key
   MINIO_BUCKET=production-bucket
   MINIO_REGION=us-east-1
   ```

2. **Build the application**:

   ```bash
   npm run build
   ```

3. **Start the production server**:

   ```bash
   npm run start
   ```

4. **Docker in production**:
   For a production-like Docker setup, run the following:

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Run Prisma migrations in production**:

   ```bash
   docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
   ```

---

## MinIO Setup

To use MinIO as an object storage system (either locally or in the cloud), follow these steps:

1. **Run MinIO locally via Docker**:

   ```bash
   docker run -p 9000:9000 -p 9001:9001 --name minio -d \
     -e "MINIO_ROOT_USER=admin" \
     -e "MINIO_ROOT_PASSWORD=password" \
     minio/minio server /data --console-address ":9001"
   ```

2. **Access the MinIO console**:

   Open the administration console at `http://localhost:9001` and log in with your credentials (`MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`).

3. **Create a bucket**:

   In the MinIO console, create a bucket, e.g., `ausreis-bucket`.

4. **Configure your application**:

   Update the environment variables in your `.env` file with the MinIO credentials.

5. **Install the MinIO SDK**:

   ```bash
   npm install minio
   ```

6. **Example MinIO integration**:

   ```ts
   import { Client } from "minio";

   const minioClient = new Client({
     endPoint: process.env.MINIO_ENDPOINT,
     accessKey: process.env.MINIO_ACCESS_KEY,
     secretKey: process.env.MINIO_SECRET_KEY,
     useSSL: false,
     port: 9000,
   });

   export const uploadFile = async (filePath: string, fileName: string) => {
     const bucket = process.env.MINIO_BUCKET || "";
     try {
       await minioClient.fPutObject(bucket, fileName, filePath);
       console.log("File uploaded successfully!");
     } catch (error) {
       console.error("Error uploading file:", error);
     }
   };
   ```

---

## Contributing

We welcome contributions! If you have a suggestion that would make this project better, please fork the repo and create a pull request. Don't forget to give the project a star! Thanks again!

### Steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Contact

re:edu GmbH - [@reedu_de](https://twitter.com/reedu_de) - kontakt@reedu.de
