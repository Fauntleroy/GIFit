![GIFit Rudd Dancing](https://raw.github.com/fauntleroy/GIFit/master/gifit_rudd_dance.gif)

Making a GIF can be intimidating. With GIFit, it isn't so intimidating anymore. Just install GIFit and you can make GIFs out of pieces of any YouTube video. Inherit the power of the GIF gods!

![GIFit in action](https://raw.github.com/fauntleroy/GIFit/master/screenshot.jpg)

##Installing

###Chrome Web Store (Easy Mode)

You can install the latest production version of GIFit! from the [Chrome Web Store](https://chrome.google.com/webstore/detail/gifit/khoojcphcmgcplkpckkjpdlloooifgec).

###Compile GIFit from Source (Hard Mode)

Here are some quick and easy steps for compilation success:

1. [Download](https://github.com/Fauntleroy/GIFit/archive/master.zip) or clone this repository and unzip it.
2. Navigate to [chrome://extensions/](chrome://extensions/) (or find it in Chrome's settings panel) and enable "developer mode" (it should be a small checkbox at the top right).
3. Click "Load unpacked extension..." and select the `GIFit/dist` folder.
4. Navigate to [YouTube](http://youtube.com). You should now see a "GIFit!" button in video toolbars.

If you have any problems with the extension, be sure to speak up and [file issues](https://github.com/Fauntleroy/GIFit/issues)!

##Contributing

Contributing to this project is EASY, provided that you love GIFs and aren't afraid of JS. I've elected to use [Gulp](http://gulpjs.com/), [Browserify](http://browserify.org/), and [LESS](http://lesscss.org/) for this project. To start developing, just run `gulp` and it'll run the default task (build/watch everything). Source files are in `src`, and the distributable extension files are in `dist`.

When fixing bugs/adding features please make **NEW BRANCHES** and submit pull reqs. Please follow the existing code style as well as you're able.