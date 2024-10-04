<div align="center"> <h2 align="center">Aus:Reis</h2> <p align="center"> A flexible and fast solution for managing expenses and travel costs, either self-hosted or in the cloud. </p> <p align="center"> <strong>Open-Source</strong> · 100% JavaScript/TypeScript · <strong>Next.js</strong> </p> </div>

![image](public/logo_for_github.svg)

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
   S3_ENDPOINT=http://localhost:9000
   S3_ACCESS_KEY=admin
   S3_SECRET_KEY=your_secure_password
   S3_BUCKET=ausreis-bucket
   S3_REGION=us-east-1
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
