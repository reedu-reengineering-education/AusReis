Thgis is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

## Getting Star
First run the development server:
# AusReis

This is a [Njs](https://nextjs.org/) projt.

## Prerequisites

Make sure the following tools are installed on your system:
Node.js](https://nodejs.org/) (version 20.x or highr)
- A package manager like [npm](https://www.npmjs.om/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

## Installation
Clone the reposity:

  ```bashgit clone https://github.com/reedu-reengineering-education/mapstories-2.0.git```
2. Install NPM packages
```npm install```
3. Start development DB
```docker compose up -d```
4. Migrate DB on first run
```npx prisma migrate dev```

5. Seed database with themes
```npx prisma db seed```
6. Run the App
```npm run dev```

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

Project Link: https://github.com/reedu-reengineering-education/next-13-tailwind-starter
