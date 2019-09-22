# tile-flipper

The software side of a puzzle game

## Developing

Use yarn.

Run `yarn` to install dependencies.

To run in development mode, you'll need to run a development server and open an electron window:

```
yarn dev & yarn electron .
```

In general, it's probably best to have a terminal for each process.

## Packaging

```
yarn build # run webpack
yarn package # run electron-packager
```
