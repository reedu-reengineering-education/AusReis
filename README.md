<div align="center">
  <h2 align="center">Next-App</h2>

  <p align="center">
     
    <br />
  </p>
</div>


## About The Project
This is a [Next.js](https://nextjs.org/) project, created by [re:edu](https://reedu.de/).

Features:

  * 🏎 Fast
### Built With
  * [Next.js](https://nextjs.org/)
  * [Typescript](https://www.typescriptlang.org/)
  * [TailwindCSS](https://tailwindcss.com/)

## Getting Started

Thgis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)


## Prerequisites

  Make sure the following tools are installed on your system:
  
  - [Node.js](https://nodejs.org/) (version 20.x or highr)

  - A [PostgreSQL](https://www.postgresql.org/) database
  
  - A package manager like [npm](https://www.npmjs.om/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
    

## Installation with npm
  1. Clone the reposity:

  ```bash 
  git clone https://github.com/reedu-reengineering-education/AusReis.git
  ```

  2. Based on the ```env.example``` file, create a ```.env``` file and configure it accordingly.

     
  3. Install npm packages
  ```bash
  npm install
  ```
  4. Start development DB
  ```bash
  docker compose up -d
  ```
  5. Migrate DB on first run
  ```bash
  npx prisma migrate dev
  ```

  6. Seed database with themes
  ```bash
  npx prisma db seed
  ```
  7. Run the App
  ```bash
  npm run dev
  ```

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (```git checkout -b feature/AmazingFeature```)
3. Commit your Changes (```git commit -m 'Add some AmazingFeature'```)
4. Push to the Branch (```git push origin feature/AmazingFeature```)
5. Open a Pull Request
## GitHub Actions
With GitHub Actions, we automatically build Docker images and push them to the GitHub package registry.

Docker images will be built on:

Pull Requests to ```main```
Pushes to ```main```
Releasing new versions under a ```v*.*.*``` tag
## Contact

re:edu GmbH - @reedu_de - kontakt@reedu.de
