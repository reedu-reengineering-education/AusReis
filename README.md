<!-- <div align="center"> <h2 align="center">Aus:Reis</h2> <p align="center"> A flexible and fast solution for managing expenses and travel costs, either self-hosted or in the cloud. </p> <p align="center"> <strong>Open-Source</strong> · 100% JavaScript/TypeScript · <strong>Next.js</strong> </p> </div>

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

re:edu GmbH - [@reedu_de](https://twitter.com/reedu_de) - kontakt@reedu.de -->
<div align="center">
  <img src="public/logo_for_github.svg" alt="AusReis Logo" width="200"/>
  <h1 align="center">AusReis</h1>
  <p align="center">
    Eine flexible und schnelle Lösung zur Verwaltung von Ausgaben und Reisekosten, selbst gehostet oder in der Cloud.
  </p>
  <p align="center">
    <strong>Open-Source</strong> · 100% JavaScript/TypeScript · <strong>Next.js</strong>
  </p>
</div>

## Über das Projekt

AusReis ist eine Open-Source-Anwendung zur Verwaltung von Ausgaben und Reisekosten, die vollständig mit [Next.js](https://nextjs.org/) und [Prisma](https://www.prisma.io/) entwickelt wurde. Die App ist schnell, flexibel und kann sowohl lokal als auch in der Cloud gehostet werden. Sie bietet vollständige Kontrolle über Ihre eigenen Daten und Arbeitsabläufe. Dieses Projekt wurde von [re:edu](https://reedu.de/) erstellt.

## Funktionen

- 📂 Verwaltung von Ausgaben und Reisekosten mit Dateispeicherung
- 🔐 Sicheres Authentifizierungssystem mit NextAuth.js
- 📧 Integriertes E-Mail-System für Benachrichtigungen
- 🗄️ Robuste Datenbankunterstützung mit PostgreSQL
- 🖼️ Datei-Upload und -Verwaltung mit MinIO
- 📱 Responsive Benutzeroberfläche mit Tailwind CSS
<!-- - 🌓 Unterstützung für helles und dunkles Design -->

## Verwendete Technologien

- [Next.js](https://nextjs.org/) - React Framework
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Datenbank
- [NextAuth.js](https://next-auth.js.org/) - Authentifizierung
- [MinIO](https://min.io/) - Objektspeicher
- [Tailwind CSS](https://tailwindcss.com/) - CSS-Framework
- [TypeScript](https://www.typescriptlang.org/) - Programmiersprache
- [Docker](https://www.docker.com/) - Containerisierung
- [Mailhog](https://github.com/mailhog/MailHog) - E-Mail-Testserver
- [Nodemailer](https://nodemailer.com/) - E-Mail-Versand für Node.js
- [Axios](https://axios-http.com/) - HTTP-Client für API-Anfragen

## Inhaltsverzeichnis

1. [Erste Schritte](#erste-schritte)
2. [Entwicklungsumgebung einrichten](#entwicklungsumgebung-einrichten)
3. [Produktionsumgebung einrichten](#produktionsumgebung-einrichten)
4. [MinIO-Einrichtung](#minio-einrichtung)
5. [E-Mail-Konfiguration](#e-mail-konfiguration)
6. [HTTP-Anfragen mit Axios](#http-anfragen-mit-axios)
7. [Testen](#testen)
8. [Projektstruktur](#projektstruktur)
9. [Beitragen](#beitragen)
10. [Sicherheit](#sicherheit)
11. [Lizenz](#lizenz)
12. [Kontakt](#kontakt)
13. [Roadmap](#roadmap)

## Erste Schritte

Diese Anleitung führt Sie durch die Einrichtung sowohl der Entwicklungs- als auch der Produktionsumgebung.

### Voraussetzungen

Stellen Sie sicher, dass Sie folgende Tools installiert haben:

- [Node.js](https://nodejs.org/) (Version 20.x oder höher)
- [Docker](https://www.docker.com/get-started/)
- [npm](https://www.npmjs.com/) (wird mit Node.js installiert)

## Entwicklungsumgebung einrichten

1. **Klonen Sie das Repository:**

   ```bash
   git clone https://github.com/reedu-reengineering-education/AusReis.git
   cd AusReis
   ```

2. **Erstellen Sie eine `.env`-Datei basierend auf dem Beispiel:**

   ```bash
   cp .env.example .env
   ```

3. **Konfigurieren Sie die Umgebungsvariablen:**
   Bearbeiten Sie die `.env`-Datei und setzen Sie die erforderlichen Werte.

4. **Installieren Sie die npm-Pakete:**

   ```bash
   npm install
   ```

5. **Starten Sie die Entwicklungsdatenbank und andere Dienste:**

   ```bash
   docker-compose up -d
   ```

   Dies startet PostgreSQL, MinIO und Mailhog für Ihre Entwicklungsumgebung.

6. **Führen Sie die Prisma-Migrationen aus:**

   ```bash
   npx prisma migrate dev
   ```

7. **Starten Sie die Anwendung:**

   ```bash
   npm run dev
   ```

## Produktionsumgebung einrichten

1. **Konfigurieren Sie die Umgebungsvariablen für die Produktion:**
   Erstellen Sie eine sichere `.env`-Datei mit produktionsbereiten Werten.

2. **Bauen Sie die Anwendung:**

   ```bash
   npm run build
   ```

3. **Starten Sie den Produktionsserver:**

   ```bash
   npm run start
   ```

4. **Docker in der Produktion:**
   Für eine produktionsähnliche Docker-Einrichtung führen Sie Folgendes aus:

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Führen Sie Prisma-Migrationen in der Produktion aus:**

   ```bash
   docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
   ```

## MinIO-Einrichtung

MinIO wird als Objektspeichersystem verwendet. Es bietet eine S3-kompatible API für die Dateispeicherung.

1. **MinIO läuft bereits im Docker-Compose-Setup.**

2. **Zugriff auf die MinIO-Konsole:**
   Öffnen Sie die Administrationskonsole unter `http://localhost:9001` und melden Sie sich mit Ihren Zugangsdaten an.

3. **Bucket erstellen:**
   Erstellen Sie in der MinIO-Konsole einen Bucket, z.B. `ausreis-bucket`.

4. **Anwendung konfigurieren:**
   Aktualisieren Sie die Umgebungsvariablen in Ihrer `.env`-Datei mit den MinIO-Zugangsdaten.

## E-Mail-Konfiguration

AusReis verwendet Nodemailer für den E-Mail-Versand und Mailhog als SMTP-Testserver für die Entwicklungsumgebung.

### Entwicklungsumgebung

In der Entwicklungsumgebung wird Mailhog verwendet, um E-Mails zu testen, ohne sie tatsächlich zu versenden.

1. Mailhog läuft bereits im Docker-Compose-Setup.
2. Zugriff auf die Mailhog-Weboberfläche: Öffnen Sie `http://localhost:8025` in Ihrem Browser.
3. Alle in der Entwicklungsumgebung gesendeten E-Mails werden von Mailhog abgefangen und können in der Weboberfläche eingesehen werden.

### Produktionsumgebung

Für die Produktionsumgebung konfigurieren Sie Nodemailer mit Ihrem tatsächlichen SMTP-Server:

1. Aktualisieren Sie die folgenden Umgebungsvariablen in Ihrer `.env`-Datei:

   ```
   EMAIL_SERVER_HOST=Ihr_SMTP_Server
   EMAIL_SERVER_PORT=Ihr_SMTP_Port
   EMAIL_SERVER_USER=Ihr_SMTP_Benutzername
   EMAIL_SERVER_PASSWORD=Ihr_SMTP_Passwort
   ```

2. Stellen Sie sicher, dass Sie in Ihrer Anwendungslogik Nodemailer mit diesen Umgebungsvariablen konfigurieren.

## HTTP-Anfragen mit Axios

AusReis verwendet Axios für HTTP-Anfragen. Axios ist ein beliebter, auf Promises basierender HTTP-Client für den Browser und Node.js.

### Beispiel für die Verwendung von Axios:

```typescript
import axios from "axios";

// GET-Anfrage
async function fetchData() {
  try {
    const response = await axios.get("/api/data");
    console.log(response.data);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

// POST-Anfrage
async function sendData(data) {
  try {
    const response = await axios.post("/api/submit", data);
    console.log("Antwort:", response.data);
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
  }
}
```

Axios bietet eine einfache und konsistente API für das Senden von HTTP-Anfragen. Es unterstützt automatische Transformationen für JSON-Daten, Interceptors für Anfragen und Antworten, und bietet eine gute Fehlerbehandlung.

## Testen

Um die Tests auszuführen, verwenden Sie den folgenden Befehl:

```bash
npm run test
```

## Projektstruktur

- `/pages`: Next.js-Seiten und API-Routen
- `/components`: Wiederverwendbare React-Komponenten
- `/prisma`: Prisma-Schema und Migrationen
- `/public`: Statische Assets
- `/styles`: Globale Styles und Tailwind-Konfiguration
- `/lib`: Hilfsfunktionen und Dienstprogramme

## Beitragen

Wir begrüßen Beiträge! Wenn Sie einen Vorschlag haben, der dieses Projekt verbessern würde, forken Sie bitte das Repo und erstellen Sie einen Pull Request. Vergessen Sie nicht, dem Projekt einen Stern zu geben! Vielen Dank!

### Schritte:

1. Forken Sie das Projekt
2. Erstellen Sie Ihren Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie den Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## Sicherheit

AusReis nimmt die Sicherheit Ihrer Daten ernst. Wir verwenden:

- Sichere Authentifizierung mit NextAuth.js
- Verschlüsselte Datenbankverbindungen
- Sichere Dateispeicherung mit MinIO
- Regelmäßige Sicherheitsupdates für alle Abhängigkeiten

Wenn Sie eine Sicherheitslücke entdecken, erstellen Sie bitte ein Issue oder kontaktieren Sie uns direkt.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen finden Sie in der `LICENSE`-Datei.

## Kontakt

re:edu GmbH - [@reedu_de](https://twitter.com/reedu_de) - kontakt@reedu.de

Projektlink: [https://github.com/reedu-reengineering-education/AusReis](https://github.com/reedu-reengineering-education/AusReis)

## Roadmap

- [ ] Implementierung von Berichterstellung und Analysen
- [ ] Integration mit gängigen Buchhaltungssoftware-Lösungen
- [ ] Mehrsprachige Unterstützung
- [ ] Mobile App-Entwicklung
- [ ] Erweiterung der API für Drittanbieter-Integrationen

Haben Sie Ideen für neue Funktionen? Lassen Sie es uns wissen, indem Sie ein Issue erstellen!
