# Whitelabel Platform Snippet

Sample partner whitelabel configuration for Express + Node.js + EJS platform

## Implementation

-   This project supports multi-partner usage simultaneously. This means that the server determines which partner domain it should render on each request from the client, and can support any number of partner domains.
-   The whitelabel partner configuration is located in `partner.config.js`. Adding values to this object will add them as valid partner options on app load.
-   You can toggle between `core` and `partner` states by changing the `IS_CORE_APP` `.env` variable. If running in development mode, the server will default to the first partner in the configuration file.
-   This project is designed to run out-of-the-box on Heroku.

## Running Locally

#### 1. Setup

-   Ensure everything is pulled down from the working branch
-   Ensure `.env` file is present in the working directory
-   Make sure you have at least Node 12.0. `node --version`

#### 2. Install Dependencies

-   Run `npm install` and ensure `node_modules` builds with no errors
-   Clean the `build` build folder by running `npm run clean`

#### 3. Run in Specified Environment

-   The site is built to automatically handle environmental vars and code-watching depending on the specified environment. The available environment start commands are:

    -   `npm run development`
    -   `npm run qa`
    -   `npm run staging`
    -   `npm run production`

-   The `development` environment is optimized for faster development by running a separate development server and removing bundle hashing

#### 4. Time to Develop! 🤓

-   The default running port for the server is 1337
-   The default running port for the app is 3000

## Best Practices

-   Place environmental vars, such as API keys, server info, and other resuable values into the specfic `.env` files, and reference the values in code with `process.env.{VALUE}`

## Deployment

Make sure to bump the version number of the codebase in `package.json` on each production deployment

The `qa`, `staging`, and `production` run commands, as well as the generic `build` and `start` commands for Heroku, run several build processes on release.

1. `.js` and `.css` assets are minified and a chunkhash added to each file name
2. Images, video, and other static assets are copied to the `dist` folder
3. The new asset filenames are appended to the base CDN url and inserted into the EJS templates
4. The build is deployed! 😁

## Code Quality

This project is set up with an automatic system to `lint` and `format` files on **_every commit_**. The packages `husky` and `lint-staged` both tie into `git-hooks` and run arbitrary shell commands against a list of `staged files`.

It will fail if eslint encounters any errors. That can be very annoying, but there is a universe of IDE tools available to show you undefined variables or a missing closing bracket in real time -- making line number hunting a thing of the past.

See [documentation](https://www.npmjs.com/package/lint-staged) for lint-staged.
