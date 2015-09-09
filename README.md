# Sobanko

![Sobanko](https://raw.githubusercontent.com/fatfisz/sobanko/master/big.png)

This is my entry for the [js13kGames competition](http://2015.js13kgames.com/).

The game is a little homage to Sokoban, one of my favourite games from the time I was about 2 years old.

The main difference is that the game is reversed - you now have to pull the boxes instead of pushing them.
This means that Sobanko, although similar to Sokoban, is quite a different game; some positions possible to obtain in one game are impossible in another.

[You can play the game here thanks to the GitHub Pages](http://fatfisz.github.io/sobanko/).

## Requirements

The project requires [Node.js](https://nodejs.org/) and npm (comes with Node.js) to be installed.

## Installing

Run `npm install` in the project directory to install all needed packages.

## Grunt commands

Each command generates some files in the `build` directory.
`index.html`, `bundle.css`, and `bundle.js` from that directory are needed for the game to run.

`grunt` or `grunt run-dev` will start watchers which will rebuild the development version of the project after changes.

`grunt build-dev` builds the development version of the project.

`grunt build-prod` builds the "production" version of the project - the resulting files were used for the entry.
