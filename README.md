#GIFit!

If you've ever seen a YouTube video and thought "Damn, I wish I had a GIF of that" then started researching how to make GIFs and got horribly discouraged THIS IS THE EXTENSION FOR YOU. Install GIFit! and inherit the power of the GIF gods.

![GIFit in action](https://raw.github.com/fauntleroy/GIFit/master/screenshot.jpg)

##Installing

Since GIFit hasn't yet been released to the Chrome Web Store, you'll need to install it manually. Here are some quick and easy steps for success:

1. [Download this repository](https://github.com/Fauntleroy/GIFit/archive/master.zip) and unzip it.
2. Navigate to [chrome://extensions/](chrome://extensions/) (or find it in Chrome's settings panel) and enable "developer mode" (it should be a small checkbox at the top right).
3. Click "Load unpacked extension..." and select the `GIFit/dist` folder.
4. Navigate to [YouTube](http://youtube.com). You should now see a "GIFit!" button in video toolbars.

If you have any problems with the extension, be sure to speak up and [file issues](https://github.com/Fauntleroy/GIFit/issues)!

##Contributing

Contributing to this project is EASY, provided that you love GIFs and aren't afraid of JS. I've elected to use [Gulp](http://gulpjs.com/), [Browserify](http://browserify.org/), and [LESS](http://lesscss.org/) for this project. To start developing, just run `gulp` and it'll run the default task (build/watch everything). Source files are in `src`, and the distributable extension files are in `dist`.

When fixing bugs/adding features please make NEW BRANCHES and submit pull reqs. Please follow the existing code style as well as you're able.