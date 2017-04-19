![GIFit build status](https://travis-ci.org/Fauntleroy/GIFit.svg?branch=master)

![GIFit Rudd Dancing](https://raw.github.com/fauntleroy/GIFit/master/gifit_rudd_dance.gif)

Making a GIF can be intimidating. With GIFit, it isn't so intimidating anymore. Just install GIFit and you can make GIFs out of pieces of any YouTube video. Inherit the power of the GIF gods!

![GIFit in action](https://raw.github.com/fauntleroy/GIFit/master/screenshot.jpg)

## Installing

### Chrome Web Store (Easy Mode)

You can install the latest production version of GIFit! from the [Chrome Web Store](https://chrome.google.com/webstore/detail/gifit/khoojcphcmgcplkpckkjpdlloooifgec).

### Compile GIFit from Source (Hard Mode)

Here are some quick and easy steps for compilation success:

1. [Download](https://github.com/Fauntleroy/GIFit/archive/master.zip) or clone this repository and unzip it.
2. Navigate to [chrome://extensions/](chrome://extensions/) (or find it in Chrome's settings panel) and enable "developer mode" (it should be a small checkbox at the top right).
3. Click "Load unpacked extension..." and select the `GIFit/dist` folder.
4. Navigate to [YouTube](http://youtube.com). You should now see a "GIFit!" button in video toolbars.

If you have any problems with the extension, be sure to speak up and [file issues](https://github.com/Fauntleroy/GIFit/issues)!

## Contributing

Contributing to this project is EASY, provided that you love GIFs and aren't afraid of JS. I've elected to use [React](http://facebook.github.io/react/), [Gulp](http://gulpjs.com/), [Browserify](http://browserify.org/), and [LESS](http://lesscss.org/) for this project.

I use [npm scripts](https://docs.npmjs.com/misc/scripts) for various dev utilities, such as building, watching, and testing. You will need to use [npm run-script](https://docs.npmjs.com/cli/run-script) to run these:

- `npm run-script build`: Compiles the contents of the `src/` directory and saves the result to `dist/`.
- `npm run-script dev`: Runs the build task, then rebuilds if any of the source files change.
- `npm run-script test`: Runs tests in a remote vm via [SauceLabs](https://saucelabs.com/). You will need to have a SauceLabs account and [properly configure zuul](https://github.com/defunctzombie/zuul/wiki/Cloud-testing) in order to use this command.
- `npm run-script test:browser`: Runs tests on a local server, accessible by a browser.

When fixing bugs/adding features please make **NEW BRANCHES** and submit pull reqs. Please follow the existing code style as well as you're able. Make sure the tests are passing, and if you add any new features, you add tests for them.