# channelMeter-coding-test

## Running the application

To run the app please execute the following command:

```sh
npm run start:prod
```

The app will be running at `http://localhost:5000`. If you would like to change the default port, please rename `.env.example` file to `.env` and change the value of `PORT` variable.

```sh
mv .env.example .env
echo PORT = 4999 > .env
```
Logs will be stored in `logs` folder.

## Running in development mode

To run the app in development mode please execute the following command:

```sh
npm run start
```

## Running unit tests

To run unit tests please execute the following command:

```sh
npm run test
```

As a result of this command, test coverage should be displayed and a `coverage` folder should be created.
