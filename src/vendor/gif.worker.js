(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  /*
    GIFEncoder.js
  
    Authors
    Kevin Weiner (original Java version - kweiner@fmsware.com)
    Thibault Imbert (AS3 version - bytearray.org)
    Johan Nordberg (JS version - code@johan-nordberg.com)
  */
  
  var NeuQuant = require('./TypedNeuQuant.js');
  var LZWEncoder = require('./LZWEncoder.js');
  
  function ByteArray() {
    this.page = -1;
    this.pages = [];
    this.newPage();
  }
  
  ByteArray.pageSize = 4096;
  ByteArray.charMap = {};
  
  for (var i = 0; i < 256; i++)
    ByteArray.charMap[i] = String.fromCharCode(i);
  
  ByteArray.prototype.newPage = function() {
    this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
    this.cursor = 0;
  };
  
  ByteArray.prototype.getData = function() {
    var rv = '';
    for (var p = 0; p < this.pages.length; p++) {
      for (var i = 0; i < ByteArray.pageSize; i++) {
        rv += ByteArray.charMap[this.pages[p][i]];
      }
    }
    return rv;
  };
  
  ByteArray.prototype.writeByte = function(val) {
    if (this.cursor >= ByteArray.pageSize) this.newPage();
    this.pages[this.page][this.cursor++] = val;
  };
  
  ByteArray.prototype.writeUTFBytes = function(string) {
    for (var l = string.length, i = 0; i < l; i++)
      this.writeByte(string.charCodeAt(i));
  };
  
  ByteArray.prototype.writeBytes = function(array, offset, length) {
    for (var l = length || array.length, i = offset || 0; i < l; i++)
      this.writeByte(array[i]);
  };
  
  function GIFEncoder(width, height) {
    // image size
    this.width = ~~width;
    this.height = ~~height;
  
    // transparent color if given
    this.transparent = null;
  
    // transparent index in color table
    this.transIndex = 0;
  
    // -1 = no repeat, 0 = forever. anything else is repeat count
    this.repeat = -1;
  
    // frame delay (hundredths)
    this.delay = 0;
  
    this.image = null; // current frame
    this.pixels = null; // BGR byte array from frame
    this.indexedPixels = null; // converted frame indexed to palette
    this.colorDepth = null; // number of bit planes
    this.colorTab = null; // RGB palette
    this.neuQuant = null; // NeuQuant instance that was used to generate this.colorTab.
    this.usedEntry = new Array(); // active palette entries
    this.palSize = 7; // color table size (bits-1)
    this.dispose = -1; // disposal code (-1 = use default)
    this.firstFrame = true;
    this.sample = 10; // default sample interval for quantizer
    this.dither = false; // default dithering
    this.globalPalette = false;
  
    this.out = new ByteArray();
  }
  
  /*
    Sets the delay time between each frame, or changes it for subsequent frames
    (applies to last frame added)
  */
  GIFEncoder.prototype.setDelay = function(milliseconds) {
    this.delay = Math.round(milliseconds / 10);
  };
  
  /*
    Sets frame rate in frames per second.
  */
  GIFEncoder.prototype.setFrameRate = function(fps) {
    this.delay = Math.round(100 / fps);
  };
  
  /*
    Sets the GIF frame disposal code for the last added frame and any
    subsequent frames.
  
    Default is 0 if no transparent color has been set, otherwise 2.
  */
  GIFEncoder.prototype.setDispose = function(disposalCode) {
    if (disposalCode >= 0) this.dispose = disposalCode;
  };
  
  /*
    Sets the number of times the set of GIF frames should be played.
  
    -1 = play once
    0 = repeat indefinitely
  
    Default is -1
  
    Must be invoked before the first image is added
  */
  
  GIFEncoder.prototype.setRepeat = function(repeat) {
    this.repeat = repeat;
  };
  
  /*
    Sets the transparent color for the last added frame and any subsequent
    frames. Since all colors are subject to modification in the quantization
    process, the color in the final palette for each frame closest to the given
    color becomes the transparent color for that frame. May be set to null to
    indicate no transparent color.
  */
  GIFEncoder.prototype.setTransparent = function(color) {
    this.transparent = color;
  };
  
  /*
    Adds next GIF frame. The frame is not written immediately, but is
    actually deferred until the next frame is received so that timing
    data can be inserted.  Invoking finish() flushes all frames.
  */
  GIFEncoder.prototype.addFrame = function(imageData) {
    this.image = imageData;
  
    this.colorTab = this.globalPalette && this.globalPalette.slice ? this.globalPalette : null;
  
    this.getImagePixels(); // convert to correct format if necessary
    this.analyzePixels(); // build color table & map pixels
  
    if (this.globalPalette === true) this.globalPalette = this.colorTab;
  
    if (this.firstFrame) {
      this.writeLSD(); // logical screen descriptior
      this.writePalette(); // global color table
      if (this.repeat >= 0) {
        // use NS app extension to indicate reps
        this.writeNetscapeExt();
      }
    }
  
    this.writeGraphicCtrlExt(); // write graphic control extension
    this.writeImageDesc(); // image descriptor
    if (!this.firstFrame && !this.globalPalette) this.writePalette(); // local color table
    this.writePixels(); // encode and write pixel data
  
    this.firstFrame = false;
  };
  
  /*
    Adds final trailer to the GIF stream, if you don't call the finish method
    the GIF stream will not be valid.
  */
  GIFEncoder.prototype.finish = function() {
    this.out.writeByte(0x3b); // gif trailer
  };
  
  /*
    Sets quality of color quantization (conversion of images to the maximum 256
    colors allowed by the GIF specification). Lower values (minimum = 1)
    produce better colors, but slow processing significantly. 10 is the
    default, and produces good color mapping at reasonable speeds. Values
    greater than 20 do not yield significant improvements in speed.
  */
  GIFEncoder.prototype.setQuality = function(quality) {
    if (quality < 1) quality = 1;
    this.sample = quality;
  };
  
  /*
    Sets dithering method. Available are:
    - FALSE no dithering
    - TRUE or FloydSteinberg
    - FalseFloydSteinberg
    - Stucki
    - Atkinson
    You can add '-serpentine' to use serpentine scanning
  */
  GIFEncoder.prototype.setDither = function(dither) {
    if (dither === true) dither = 'FloydSteinberg';
    this.dither = dither;
  };
  
  /*
    Sets global palette for all frames.
    You can provide TRUE to create global palette from first picture.
    Or an array of r,g,b,r,g,b,...
  */
  GIFEncoder.prototype.setGlobalPalette = function(palette) {
    this.globalPalette = palette;
  };
  
  /*
    Returns global palette used for all frames.
    If setGlobalPalette(true) was used, then this function will return
    calculated palette after the first frame is added.
  */
  GIFEncoder.prototype.getGlobalPalette = function() {
    return (this.globalPalette && this.globalPalette.slice && this.globalPalette.slice(0)) || this.globalPalette;
  };
  
  /*
    Writes GIF file header
  */
  GIFEncoder.prototype.writeHeader = function() {
    this.out.writeUTFBytes("GIF89a");
  };
  
  /*
    Analyzes current frame colors and creates color map.
  */
  GIFEncoder.prototype.analyzePixels = function() {
    if (!this.colorTab) {
      this.neuQuant = new NeuQuant(this.pixels, this.sample);
      this.neuQuant.buildColormap(); // create reduced palette
      this.colorTab = this.neuQuant.getColormap();
    }
  
    // map image pixels to new palette
    if (this.dither) {
      this.ditherPixels(this.dither.replace('-serpentine', ''), this.dither.match(/-serpentine/) !== null);
    } else {
      this.indexPixels();
    }
  
    this.pixels = null;
    this.colorDepth = 8;
    this.palSize = 7;
  
    // get closest match to transparent color if specified
    if (this.transparent !== null) {
      this.transIndex = this.findClosest(this.transparent, true);
    }
  };
  
  /*
    Index pixels, without dithering
  */
  GIFEncoder.prototype.indexPixels = function(imgq) {
    var nPix = this.pixels.length / 3;
    this.indexedPixels = new Uint8Array(nPix);
    var k = 0;
    for (var j = 0; j < nPix; j++) {
      var index = this.findClosestRGB(
        this.pixels[k++] & 0xff,
        this.pixels[k++] & 0xff,
        this.pixels[k++] & 0xff
      );
      this.usedEntry[index] = true;
      this.indexedPixels[j] = index;
    }
  };
  
  /*
    Taken from http://jsbin.com/iXofIji/2/edit by PAEz
  */
  GIFEncoder.prototype.ditherPixels = function(kernel, serpentine) {
    var kernels = {
      FalseFloydSteinberg: [
        [3 / 8, 1, 0],
        [3 / 8, 0, 1],
        [2 / 8, 1, 1]
      ],
      FloydSteinberg: [
        [7 / 16, 1, 0],
        [3 / 16, -1, 1],
        [5 / 16, 0, 1],
        [1 / 16, 1, 1]
      ],
      Stucki: [
        [8 / 42, 1, 0],
        [4 / 42, 2, 0],
        [2 / 42, -2, 1],
        [4 / 42, -1, 1],
        [8 / 42, 0, 1],
        [4 / 42, 1, 1],
        [2 / 42, 2, 1],
        [1 / 42, -2, 2],
        [2 / 42, -1, 2],
        [4 / 42, 0, 2],
        [2 / 42, 1, 2],
        [1 / 42, 2, 2]
      ],
      Atkinson: [
        [1 / 8, 1, 0],
        [1 / 8, 2, 0],
        [1 / 8, -1, 1],
        [1 / 8, 0, 1],
        [1 / 8, 1, 1],
        [1 / 8, 0, 2]
      ]
    };
  
    if (!kernel || !kernels[kernel]) {
      throw 'Unknown dithering kernel: ' + kernel;
    }
  
    var ds = kernels[kernel];
    var index = 0,
      height = this.height,
      width = this.width,
      data = this.pixels;
    var direction = serpentine ? -1 : 1;
  
    this.indexedPixels = new Uint8Array(this.pixels.length / 3);
  
    for (var y = 0; y < height; y++) {
  
      if (serpentine) direction = direction * -1;
  
      for (var x = (direction == 1 ? 0 : width - 1), xend = (direction == 1 ? width : 0); x !== xend; x += direction) {
  
        index = (y * width) + x;
        // Get original colour
        var idx = index * 3;
        var r1 = data[idx];
        var g1 = data[idx + 1];
        var b1 = data[idx + 2];
  
        // Get converted colour
        idx = this.findClosestRGB(r1, g1, b1);
        this.usedEntry[idx] = true;
        this.indexedPixels[index] = idx;
        idx *= 3;
        var r2 = this.colorTab[idx];
        var g2 = this.colorTab[idx + 1];
        var b2 = this.colorTab[idx + 2];
  
        var er = r1 - r2;
        var eg = g1 - g2;
        var eb = b1 - b2;
  
        for (var i = (direction == 1 ? 0: ds.length - 1), end = (direction == 1 ? ds.length : 0); i !== end; i += direction) {
          var x1 = ds[i][1]; // *direction;  //  Should this by timesd by direction?..to make the kernel go in the opposite direction....got no idea....
          var y1 = ds[i][2];
          if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
            var d = ds[i][0];
            idx = index + x1 + (y1 * width);
            idx *= 3;
  
            data[idx] = Math.max(0, Math.min(255, data[idx] + er * d));
            data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + eg * d));
            data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + eb * d));
          }
        }
      }
    }
  };
  
  /*
    Returns index of palette color closest to c
  */
  GIFEncoder.prototype.findClosest = function(c, used) {
    return this.findClosestRGB((c & 0xFF0000) >> 16, (c & 0x00FF00) >> 8, (c & 0x0000FF), used);
  };
  
  GIFEncoder.prototype.findClosestRGB = function(r, g, b, used) {
    if (this.colorTab === null) return -1;
  
    if (this.neuQuant && !used) {
      return this.neuQuant.lookupRGB(r, g, b);
    }
  
    var c = b | (g << 8) | (r << 16);
  
    var minpos = 0;
    var dmin = 256 * 256 * 256;
    var len = this.colorTab.length;
  
    for (var i = 0, index = 0; i < len; index++) {
      var dr = r - (this.colorTab[i++] & 0xff);
      var dg = g - (this.colorTab[i++] & 0xff);
      var db = b - (this.colorTab[i++] & 0xff);
      var d = dr * dr + dg * dg + db * db;
      if ((!used || this.usedEntry[index]) && (d < dmin)) {
        dmin = d;
        minpos = index;
      }
    }
  
    return minpos;
  };
  
  /*
    Extracts image pixels into byte array pixels
    (removes alphachannel from canvas imagedata)
  */
  GIFEncoder.prototype.getImagePixels = function() {
    var w = this.width;
    var h = this.height;
    this.pixels = new Uint8Array(w * h * 3);
  
    var data = this.image;
    var srcPos = 0;
    var count = 0;
  
    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        this.pixels[count++] = data[srcPos++];
        this.pixels[count++] = data[srcPos++];
        this.pixels[count++] = data[srcPos++];
        srcPos++;
      }
    }
  };
  
  /*
    Writes Graphic Control Extension
  */
  GIFEncoder.prototype.writeGraphicCtrlExt = function() {
    this.out.writeByte(0x21); // extension introducer
    this.out.writeByte(0xf9); // GCE label
    this.out.writeByte(4); // data block size
  
    var transp, disp;
    if (this.transparent === null) {
      transp = 0;
      disp = 0; // dispose = no action
    } else {
      transp = 1;
      disp = 2; // force clear if using transparent color
    }
  
    if (this.dispose >= 0) {
      disp = this.dispose & 7; // user override
    }
    disp <<= 2;
  
    // packed fields
    this.out.writeByte(
      0 | // 1:3 reserved
      disp | // 4:6 disposal
      0 | // 7 user input - 0 = none
      transp // 8 transparency flag
    );
  
    this.writeShort(this.delay); // delay x 1/100 sec
    this.out.writeByte(this.transIndex); // transparent color index
    this.out.writeByte(0); // block terminator
  };
  
  /*
    Writes Image Descriptor
  */
  GIFEncoder.prototype.writeImageDesc = function() {
    this.out.writeByte(0x2c); // image separator
    this.writeShort(0); // image position x,y = 0,0
    this.writeShort(0);
    this.writeShort(this.width); // image size
    this.writeShort(this.height);
  
    // packed fields
    if (this.firstFrame || this.globalPalette) {
      // no LCT - GCT is used for first (or only) frame
      this.out.writeByte(0);
    } else {
      // specify normal LCT
      this.out.writeByte(
        0x80 | // 1 local color table 1=yes
        0 | // 2 interlace - 0=no
        0 | // 3 sorted - 0=no
        0 | // 4-5 reserved
        this.palSize // 6-8 size of color table
      );
    }
  };
  
  /*
    Writes Logical Screen Descriptor
  */
  GIFEncoder.prototype.writeLSD = function() {
    // logical screen size
    this.writeShort(this.width);
    this.writeShort(this.height);
  
    // packed fields
    this.out.writeByte(
      0x80 | // 1 : global color table flag = 1 (gct used)
      0x70 | // 2-4 : color resolution = 7
      0x00 | // 5 : gct sort flag = 0
      this.palSize // 6-8 : gct size
    );
  
    this.out.writeByte(0); // background color index
    this.out.writeByte(0); // pixel aspect ratio - assume 1:1
  };
  
  /*
    Writes Netscape application extension to define repeat count.
  */
  GIFEncoder.prototype.writeNetscapeExt = function() {
    this.out.writeByte(0x21); // extension introducer
    this.out.writeByte(0xff); // app extension label
    this.out.writeByte(11); // block size
    this.out.writeUTFBytes('NETSCAPE2.0'); // app id + auth code
    this.out.writeByte(3); // sub-block size
    this.out.writeByte(1); // loop sub-block id
    this.writeShort(this.repeat); // loop count (extra iterations, 0=repeat forever)
    this.out.writeByte(0); // block terminator
  };
  
  /*
    Writes color table
  */
  GIFEncoder.prototype.writePalette = function() {
    this.out.writeBytes(this.colorTab);
    var n = (3 * 256) - this.colorTab.length;
    for (var i = 0; i < n; i++)
      this.out.writeByte(0);
  };
  
  GIFEncoder.prototype.writeShort = function(pValue) {
    this.out.writeByte(pValue & 0xFF);
    this.out.writeByte((pValue >> 8) & 0xFF);
  };
  
  /*
    Encodes and writes pixel data
  */
  GIFEncoder.prototype.writePixels = function() {
    var enc = new LZWEncoder(this.width, this.height, this.indexedPixels, this.colorDepth);
    enc.encode(this.out);
  };
  
  /*
    Retrieves the GIF stream
  */
  GIFEncoder.prototype.stream = function() {
    return this.out;
  };
  
  module.exports = GIFEncoder;
  
  },{"./LZWEncoder.js":2,"./TypedNeuQuant.js":3}],2:[function(require,module,exports){
  /*
    LZWEncoder.js
  
    Authors
    Kevin Weiner (original Java version - kweiner@fmsware.com)
    Thibault Imbert (AS3 version - bytearray.org)
    Johan Nordberg (JS version - code@johan-nordberg.com)
  
    Acknowledgements
    GIFCOMPR.C - GIF Image compression routines
    Lempel-Ziv compression based on 'compress'. GIF modifications by
    David Rowley (mgardi@watdcsu.waterloo.edu)
    GIF Image compression - modified 'compress'
    Based on: compress.c - File compression ala IEEE Computer, June 1984.
    By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
    Jim McKie (decvax!mcvax!jim)
    Steve Davies (decvax!vax135!petsd!peora!srd)
    Ken Turkowski (decvax!decwrl!turtlevax!ken)
    James A. Woods (decvax!ihnp4!ames!jaw)
    Joe Orost (decvax!vax135!petsd!joe)
  */
  
  var EOF = -1;
  var BITS = 12;
  var HSIZE = 5003; // 80% occupancy
  var masks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
               0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
               0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];
  
  function LZWEncoder(width, height, pixels, colorDepth) {
    var initCodeSize = Math.max(2, colorDepth);
  
    var accum = new Uint8Array(256);
    var htab = new Int32Array(HSIZE);
    var codetab = new Int32Array(HSIZE);
  
    var cur_accum, cur_bits = 0;
    var a_count;
    var free_ent = 0; // first unused entry
    var maxcode;
  
    // block compression parameters -- after all codes are used up,
    // and compression rate changes, start over.
    var clear_flg = false;
  
    // Algorithm: use open addressing double hashing (no chaining) on the
    // prefix code / next character combination. We do a variant of Knuth's
    // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
    // secondary probe. Here, the modular division first probe is gives way
    // to a faster exclusive-or manipulation. Also do block compression with
    // an adaptive reset, whereby the code table is cleared when the compression
    // ratio decreases, but after the table fills. The variable-length output
    // codes are re-sized at this point, and a special CLEAR code is generated
    // for the decompressor. Late addition: construct the table according to
    // file size for noticeable speed improvement on small files. Please direct
    // questions about this implementation to ames!jaw.
    var g_init_bits, ClearCode, EOFCode;
  
    // Add a character to the end of the current packet, and if it is 254
    // characters, flush the packet to disk.
    function char_out(c, outs) {
      accum[a_count++] = c;
      if (a_count >= 254) flush_char(outs);
    }
  
    // Clear out the hash table
    // table clear for block compress
    function cl_block(outs) {
      cl_hash(HSIZE);
      free_ent = ClearCode + 2;
      clear_flg = true;
      output(ClearCode, outs);
    }
  
    // Reset code table
    function cl_hash(hsize) {
      for (var i = 0; i < hsize; ++i) htab[i] = -1;
    }
  
    function compress(init_bits, outs) {
      var fcode, c, i, ent, disp, hsize_reg, hshift;
  
      // Set up the globals: g_init_bits - initial number of bits
      g_init_bits = init_bits;
  
      // Set up the necessary values
      clear_flg = false;
      n_bits = g_init_bits;
      maxcode = MAXCODE(n_bits);
  
      ClearCode = 1 << (init_bits - 1);
      EOFCode = ClearCode + 1;
      free_ent = ClearCode + 2;
  
      a_count = 0; // clear packet
  
      ent = nextPixel();
  
      hshift = 0;
      for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
      hshift = 8 - hshift; // set hash code range bound
      hsize_reg = HSIZE;
      cl_hash(hsize_reg); // clear hash table
  
      output(ClearCode, outs);
  
      outer_loop: while ((c = nextPixel()) != EOF) {
        fcode = (c << BITS) + ent;
        i = (c << hshift) ^ ent; // xor hashing
        if (htab[i] === fcode) {
          ent = codetab[i];
          continue;
        } else if (htab[i] >= 0) { // non-empty slot
          disp = hsize_reg - i; // secondary hash (after G. Knott)
          if (i === 0) disp = 1;
          do {
            if ((i -= disp) < 0) i += hsize_reg;
            if (htab[i] === fcode) {
              ent = codetab[i];
              continue outer_loop;
            }
          } while (htab[i] >= 0);
        }
        output(ent, outs);
        ent = c;
        if (free_ent < 1 << BITS) {
          codetab[i] = free_ent++; // code -> hashtable
          htab[i] = fcode;
        } else {
          cl_block(outs);
        }
      }
  
      // Put out the final code.
      output(ent, outs);
      output(EOFCode, outs);
    }
  
    function encode(outs) {
      outs.writeByte(initCodeSize); // write "initial code size" byte
      remaining = width * height; // reset navigation variables
      curPixel = 0;
      compress(initCodeSize + 1, outs); // compress and write the pixel data
      outs.writeByte(0); // write block terminator
    }
  
    // Flush the packet to disk, and reset the accumulator
    function flush_char(outs) {
      if (a_count > 0) {
        outs.writeByte(a_count);
        outs.writeBytes(accum, 0, a_count);
        a_count = 0;
      }
    }
  
    function MAXCODE(n_bits) {
      return (1 << n_bits) - 1;
    }
  
    // Return the next pixel from the image
    function nextPixel() {
      if (remaining === 0) return EOF;
      --remaining;
      var pix = pixels[curPixel++];
      return pix & 0xff;
    }
  
    function output(code, outs) {
      cur_accum &= masks[cur_bits];
  
      if (cur_bits > 0) cur_accum |= (code << cur_bits);
      else cur_accum = code;
  
      cur_bits += n_bits;
  
      while (cur_bits >= 8) {
        char_out((cur_accum & 0xff), outs);
        cur_accum >>= 8;
        cur_bits -= 8;
      }
  
      // If the next entry is going to be too big for the code size,
      // then increase it, if possible.
      if (free_ent > maxcode || clear_flg) {
        if (clear_flg) {
          maxcode = MAXCODE(n_bits = g_init_bits);
          clear_flg = false;
        } else {
          ++n_bits;
          if (n_bits == BITS) maxcode = 1 << BITS;
          else maxcode = MAXCODE(n_bits);
        }
      }
  
      if (code == EOFCode) {
        // At EOF, write the rest of the buffer.
        while (cur_bits > 0) {
          char_out((cur_accum & 0xff), outs);
          cur_accum >>= 8;
          cur_bits -= 8;
        }
        flush_char(outs);
      }
    }
  
    this.encode = encode;
  }
  
  module.exports = LZWEncoder;
  
  },{}],3:[function(require,module,exports){
  /* NeuQuant Neural-Net Quantization Algorithm
   * ------------------------------------------
   *
   * Copyright (c) 1994 Anthony Dekker
   *
   * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994.
   * See "Kohonen neural networks for optimal colour quantization"
   * in "Network: Computation in Neural Systems" Vol. 5 (1994) pp 351-367.
   * for a discussion of the algorithm.
   * See also  http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
   *
   * Any party obtaining a copy of these files from the author, directly or
   * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
   * world-wide, paid up, royalty-free, nonexclusive right and license to deal
   * in this software and documentation files (the "Software"), including without
   * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
   * and/or sell copies of the Software, and to permit persons who receive
   * copies from any such party to do so, with the only requirement being
   * that this copyright notice remain intact.
   *
   * (JavaScript port 2012 by Johan Nordberg)
   */
  
  var ncycles = 100; // number of learning cycles
  var netsize = 256; // number of colors used
  var maxnetpos = netsize - 1;
  
  // defs for freq and bias
  var netbiasshift = 4; // bias for colour values
  var intbiasshift = 16; // bias for fractions
  var intbias = (1 << intbiasshift);
  var gammashift = 10;
  var gamma = (1 << gammashift);
  var betashift = 10;
  var beta = (intbias >> betashift); /* beta = 1/1024 */
  var betagamma = (intbias << (gammashift - betashift));
  
  // defs for decreasing radius factor
  var initrad = (netsize >> 3); // for 256 cols, radius starts
  var radiusbiasshift = 6; // at 32.0 biased by 6 bits
  var radiusbias = (1 << radiusbiasshift);
  var initradius = (initrad * radiusbias); //and decreases by a
  var radiusdec = 30; // factor of 1/30 each cycle
  
  // defs for decreasing alpha factor
  var alphabiasshift = 10; // alpha starts at 1.0
  var initalpha = (1 << alphabiasshift);
  var alphadec; // biased by 10 bits
  
  /* radbias and alpharadbias used for radpower calculation */
  var radbiasshift = 8;
  var radbias = (1 << radbiasshift);
  var alpharadbshift = (alphabiasshift + radbiasshift);
  var alpharadbias = (1 << alpharadbshift);
  
  // four primes near 500 - assume no image has a length so large that it is
  // divisible by all four primes
  var prime1 = 499;
  var prime2 = 491;
  var prime3 = 487;
  var prime4 = 503;
  var minpicturebytes = (3 * prime4);
  
  /*
    Constructor: NeuQuant
  
    Arguments:
  
    pixels - array of pixels in RGB format
    samplefac - sampling factor 1 to 30 where lower is better quality
  
    >
    > pixels = [r, g, b, r, g, b, r, g, b, ..]
    >
  */
  function NeuQuant(pixels, samplefac) {
    var network; // int[netsize][4]
    var netindex; // for network lookup - really 256
  
    // bias and freq arrays for learning
    var bias;
    var freq;
    var radpower;
  
    /*
      Private Method: init
  
      sets up arrays
    */
    function init() {
      network = [];
      netindex = new Int32Array(256);
      bias = new Int32Array(netsize);
      freq = new Int32Array(netsize);
      radpower = new Int32Array(netsize >> 3);
  
      var i, v;
      for (i = 0; i < netsize; i++) {
        v = (i << (netbiasshift + 8)) / netsize;
        network[i] = new Float64Array([v, v, v, 0]);
        //network[i] = [v, v, v, 0]
        freq[i] = intbias / netsize;
        bias[i] = 0;
      }
    }
  
    /*
      Private Method: unbiasnet
  
      unbiases network to give byte values 0..255 and record position i to prepare for sort
    */
    function unbiasnet() {
      for (var i = 0; i < netsize; i++) {
        network[i][0] >>= netbiasshift;
        network[i][1] >>= netbiasshift;
        network[i][2] >>= netbiasshift;
        network[i][3] = i; // record color number
      }
    }
  
    /*
      Private Method: altersingle
  
      moves neuron *i* towards biased (b,g,r) by factor *alpha*
    */
    function altersingle(alpha, i, b, g, r) {
      network[i][0] -= (alpha * (network[i][0] - b)) / initalpha;
      network[i][1] -= (alpha * (network[i][1] - g)) / initalpha;
      network[i][2] -= (alpha * (network[i][2] - r)) / initalpha;
    }
  
    /*
      Private Method: alterneigh
  
      moves neurons in *radius* around index *i* towards biased (b,g,r) by factor *alpha*
    */
    function alterneigh(radius, i, b, g, r) {
      var lo = Math.abs(i - radius);
      var hi = Math.min(i + radius, netsize);
  
      var j = i + 1;
      var k = i - 1;
      var m = 1;
  
      var p, a;
      while ((j < hi) || (k > lo)) {
        a = radpower[m++];
  
        if (j < hi) {
          p = network[j++];
          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;
        }
  
        if (k > lo) {
          p = network[k--];
          p[0] -= (a * (p[0] - b)) / alpharadbias;
          p[1] -= (a * (p[1] - g)) / alpharadbias;
          p[2] -= (a * (p[2] - r)) / alpharadbias;
        }
      }
    }
  
    /*
      Private Method: contest
  
      searches for biased BGR values
    */
    function contest(b, g, r) {
      /*
        finds closest neuron (min dist) and updates freq
        finds best neuron (min dist-bias) and returns position
        for frequently chosen neurons, freq[i] is high and bias[i] is negative
        bias[i] = gamma * ((1 / netsize) - freq[i])
      */
  
      var bestd = ~(1 << 31);
      var bestbiasd = bestd;
      var bestpos = -1;
      var bestbiaspos = bestpos;
  
      var i, n, dist, biasdist, betafreq;
      for (i = 0; i < netsize; i++) {
        n = network[i];
  
        dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
        if (dist < bestd) {
          bestd = dist;
          bestpos = i;
        }
  
        biasdist = dist - ((bias[i]) >> (intbiasshift - netbiasshift));
        if (biasdist < bestbiasd) {
          bestbiasd = biasdist;
          bestbiaspos = i;
        }
  
        betafreq = (freq[i] >> betashift);
        freq[i] -= betafreq;
        bias[i] += (betafreq << gammashift);
      }
  
      freq[bestpos] += beta;
      bias[bestpos] -= betagamma;
  
      return bestbiaspos;
    }
  
    /*
      Private Method: inxbuild
  
      sorts network and builds netindex[0..255]
    */
    function inxbuild() {
      var i, j, p, q, smallpos, smallval, previouscol = 0, startpos = 0;
      for (i = 0; i < netsize; i++) {
        p = network[i];
        smallpos = i;
        smallval = p[1]; // index on g
        // find smallest in i..netsize-1
        for (j = i + 1; j < netsize; j++) {
          q = network[j];
          if (q[1] < smallval) { // index on g
            smallpos = j;
            smallval = q[1]; // index on g
          }
        }
        q = network[smallpos];
        // swap p (i) and q (smallpos) entries
        if (i != smallpos) {
          j = q[0];   q[0] = p[0];   p[0] = j;
          j = q[1];   q[1] = p[1];   p[1] = j;
          j = q[2];   q[2] = p[2];   p[2] = j;
          j = q[3];   q[3] = p[3];   p[3] = j;
        }
        // smallval entry is now in position i
  
        if (smallval != previouscol) {
          netindex[previouscol] = (startpos + i) >> 1;
          for (j = previouscol + 1; j < smallval; j++)
            netindex[j] = i;
          previouscol = smallval;
          startpos = i;
        }
      }
      netindex[previouscol] = (startpos + maxnetpos) >> 1;
      for (j = previouscol + 1; j < 256; j++)
        netindex[j] = maxnetpos; // really 256
    }
  
    /*
      Private Method: inxsearch
  
      searches for BGR values 0..255 and returns a color index
    */
    function inxsearch(b, g, r) {
      var a, p, dist;
  
      var bestd = 1000; // biggest possible dist is 256*3
      var best = -1;
  
      var i = netindex[g]; // index on g
      var j = i - 1; // start at netindex[g] and work outwards
  
      while ((i < netsize) || (j >= 0)) {
        if (i < netsize) {
          p = network[i];
          dist = p[1] - g; // inx key
          if (dist >= bestd) i = netsize; // stop iter
          else {
            i++;
            if (dist < 0) dist = -dist;
            a = p[0] - b; if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              a = p[2] - r; if (a < 0) a = -a;
              dist += a;
              if (dist < bestd) {
                bestd = dist;
                best = p[3];
              }
            }
          }
        }
        if (j >= 0) {
          p = network[j];
          dist = g - p[1]; // inx key - reverse dif
          if (dist >= bestd) j = -1; // stop iter
          else {
            j--;
            if (dist < 0) dist = -dist;
            a = p[0] - b; if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              a = p[2] - r; if (a < 0) a = -a;
              dist += a;
              if (dist < bestd) {
                bestd = dist;
                best = p[3];
              }
            }
          }
        }
      }
  
      return best;
    }
  
    /*
      Private Method: learn
  
      "Main Learning Loop"
    */
    function learn() {
      var i;
  
      var lengthcount = pixels.length;
      var alphadec = 30 + ((samplefac - 1) / 3);
      var samplepixels = lengthcount / (3 * samplefac);
      var delta = ~~(samplepixels / ncycles);
      var alpha = initalpha;
      var radius = initradius;
  
      var rad = radius >> radiusbiasshift;
  
      if (rad <= 1) rad = 0;
      for (i = 0; i < rad; i++)
        radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));
  
      var step;
      if (lengthcount < minpicturebytes) {
        samplefac = 1;
        step = 3;
      } else if ((lengthcount % prime1) !== 0) {
        step = 3 * prime1;
      } else if ((lengthcount % prime2) !== 0) {
        step = 3 * prime2;
      } else if ((lengthcount % prime3) !== 0)  {
        step = 3 * prime3;
      } else {
        step = 3 * prime4;
      }
  
      var b, g, r, j;
      var pix = 0; // current pixel
  
      i = 0;
      while (i < samplepixels) {
        b = (pixels[pix] & 0xff) << netbiasshift;
        g = (pixels[pix + 1] & 0xff) << netbiasshift;
        r = (pixels[pix + 2] & 0xff) << netbiasshift;
  
        j = contest(b, g, r);
  
        altersingle(alpha, j, b, g, r);
        if (rad !== 0) alterneigh(rad, j, b, g, r); // alter neighbours
  
        pix += step;
        if (pix >= lengthcount) pix -= lengthcount;
  
        i++;
  
        if (delta === 0) delta = 1;
        if (i % delta === 0) {
          alpha -= alpha / alphadec;
          radius -= radius / radiusdec;
          rad = radius >> radiusbiasshift;
  
          if (rad <= 1) rad = 0;
          for (j = 0; j < rad; j++)
            radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
        }
      }
    }
  
    /*
      Method: buildColormap
  
      1. initializes network
      2. trains it
      3. removes misconceptions
      4. builds colorindex
    */
    function buildColormap() {
      init();
      learn();
      unbiasnet();
      inxbuild();
    }
    this.buildColormap = buildColormap;
  
    /*
      Method: getColormap
  
      builds colormap from the index
  
      returns array in the format:
  
      >
      > [r, g, b, r, g, b, r, g, b, ..]
      >
    */
    function getColormap() {
      var map = [];
      var index = [];
  
      for (var i = 0; i < netsize; i++)
        index[network[i][3]] = i;
  
      var k = 0;
      for (var l = 0; l < netsize; l++) {
        var j = index[l];
        map[k++] = (network[j][0]);
        map[k++] = (network[j][1]);
        map[k++] = (network[j][2]);
      }
      return map;
    }
    this.getColormap = getColormap;
  
    /*
      Method: lookupRGB
  
      looks for the closest *r*, *g*, *b* color in the map and
      returns its index
    */
    this.lookupRGB = inxsearch;
  }
  
  module.exports = NeuQuant;
  
  },{}],4:[function(require,module,exports){
  var GIFEncoder, renderFrame;
  
  GIFEncoder = require('./GIFEncoder.js');
  
  renderFrame = function(frame) {
    var encoder, page, stream, transfer;
    encoder = new GIFEncoder(frame.width, frame.height);
    if (frame.index === 0) {
      encoder.writeHeader();
    } else {
      encoder.firstFrame = false;
    }
    encoder.setTransparent(frame.transparent);
    encoder.setDispose(frame.dispose);
    encoder.setRepeat(frame.repeat);
    encoder.setDelay(frame.delay);
    encoder.setQuality(frame.quality);
    encoder.setDither(frame.dither);
    encoder.setGlobalPalette(frame.globalPalette);
    encoder.addFrame(frame.data);
    if (frame.last) {
      encoder.finish();
    }
    if (frame.globalPalette === true) {
      frame.globalPalette = encoder.getGlobalPalette();
    }
    stream = encoder.stream();
    frame.data = stream.pages;
    frame.cursor = stream.cursor;
    frame.pageSize = stream.constructor.pageSize;
    if (frame.canTransfer) {
      transfer = (function() {
        var i, len, ref, results;
        ref = frame.data;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          page = ref[i];
          results.push(page.buffer);
        }
        return results;
      })();
      return self.postMessage(frame, transfer);
    } else {
      return self.postMessage(frame);
    }
  };
  
  self.onmessage = function(event) {
    return renderFrame(event.data);
  };
  
  
  },{"./GIFEncoder.js":1}]},{},[4])
  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvR0lGRW5jb2Rlci5qcyIsInNyYy9MWldFbmNvZGVyLmpzIiwic3JjL1R5cGVkTmV1UXVhbnQuanMiLCJzcmMvZ2lmLndvcmtlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvYUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGlCQUFSOztBQUViLFdBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixNQUFBO0VBQUEsT0FBQSxHQUFVLElBQUksVUFBSixDQUFlLEtBQUssQ0FBQyxLQUFyQixFQUE0QixLQUFLLENBQUMsTUFBbEM7RUFFVixJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsQ0FBbEI7SUFDRSxPQUFPLENBQUMsV0FBUixDQUFBLEVBREY7R0FBQSxNQUFBO0lBR0UsT0FBTyxDQUFDLFVBQVIsR0FBcUIsTUFIdkI7O0VBS0EsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsS0FBSyxDQUFDLFdBQTdCO0VBQ0EsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsS0FBSyxDQUFDLE9BQXpCO0VBQ0EsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsS0FBSyxDQUFDLE1BQXhCO0VBQ0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsS0FBSyxDQUFDLEtBQXZCO0VBQ0EsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsS0FBSyxDQUFDLE9BQXpCO0VBQ0EsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsS0FBSyxDQUFDLE1BQXhCO0VBQ0EsT0FBTyxDQUFDLGdCQUFSLENBQXlCLEtBQUssQ0FBQyxhQUEvQjtFQUNBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEtBQUssQ0FBQyxJQUF2QjtFQUNBLElBQW9CLEtBQUssQ0FBQyxJQUExQjtJQUFBLE9BQU8sQ0FBQyxNQUFSLENBQUEsRUFBQTs7RUFDQSxJQUFHLEtBQUssQ0FBQyxhQUFOLEtBQXVCLElBQTFCO0lBQ0UsS0FBSyxDQUFDLGFBQU4sR0FBc0IsT0FBTyxDQUFDLGdCQUFSLENBQUEsRUFEeEI7O0VBR0EsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQUE7RUFDVCxLQUFLLENBQUMsSUFBTixHQUFhLE1BQU0sQ0FBQztFQUNwQixLQUFLLENBQUMsTUFBTixHQUFlLE1BQU0sQ0FBQztFQUN0QixLQUFLLENBQUMsUUFBTixHQUFpQixNQUFNLENBQUMsV0FBVyxDQUFDO0VBRXBDLElBQUcsS0FBSyxDQUFDLFdBQVQ7SUFDRSxRQUFBOztBQUFZO0FBQUE7V0FBQSxxQ0FBQTs7cUJBQUEsSUFBSSxDQUFDO0FBQUw7OztXQUNaLElBQUksQ0FBQyxXQUFMLENBQWlCLEtBQWpCLEVBQXdCLFFBQXhCLEVBRkY7R0FBQSxNQUFBO1dBSUUsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakIsRUFKRjs7QUF6Qlk7O0FBK0JkLElBQUksQ0FBQyxTQUFMLEdBQWlCLFNBQUMsS0FBRDtTQUFXLFdBQUEsQ0FBWSxLQUFLLENBQUMsSUFBbEI7QUFBWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXG4gIEdJRkVuY29kZXIuanNcblxuICBBdXRob3JzXG4gIEtldmluIFdlaW5lciAob3JpZ2luYWwgSmF2YSB2ZXJzaW9uIC0ga3dlaW5lckBmbXN3YXJlLmNvbSlcbiAgVGhpYmF1bHQgSW1iZXJ0IChBUzMgdmVyc2lvbiAtIGJ5dGVhcnJheS5vcmcpXG4gIEpvaGFuIE5vcmRiZXJnIChKUyB2ZXJzaW9uIC0gY29kZUBqb2hhbi1ub3JkYmVyZy5jb20pXG4qL1xuXG52YXIgTmV1UXVhbnQgPSByZXF1aXJlKCcuL1R5cGVkTmV1UXVhbnQuanMnKTtcbnZhciBMWldFbmNvZGVyID0gcmVxdWlyZSgnLi9MWldFbmNvZGVyLmpzJyk7XG5cbmZ1bmN0aW9uIEJ5dGVBcnJheSgpIHtcbiAgdGhpcy5wYWdlID0gLTE7XG4gIHRoaXMucGFnZXMgPSBbXTtcbiAgdGhpcy5uZXdQYWdlKCk7XG59XG5cbkJ5dGVBcnJheS5wYWdlU2l6ZSA9IDQwOTY7XG5CeXRlQXJyYXkuY2hhck1hcCA9IHt9O1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKVxuICBCeXRlQXJyYXkuY2hhck1hcFtpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG5cbkJ5dGVBcnJheS5wcm90b3R5cGUubmV3UGFnZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBhZ2VzWysrdGhpcy5wYWdlXSA9IG5ldyBVaW50OEFycmF5KEJ5dGVBcnJheS5wYWdlU2l6ZSk7XG4gIHRoaXMuY3Vyc29yID0gMDtcbn07XG5cbkJ5dGVBcnJheS5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcnYgPSAnJztcbiAgZm9yICh2YXIgcCA9IDA7IHAgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgcCsrKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBCeXRlQXJyYXkucGFnZVNpemU7IGkrKykge1xuICAgICAgcnYgKz0gQnl0ZUFycmF5LmNoYXJNYXBbdGhpcy5wYWdlc1twXVtpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBydjtcbn07XG5cbkJ5dGVBcnJheS5wcm90b3R5cGUud3JpdGVCeXRlID0gZnVuY3Rpb24odmFsKSB7XG4gIGlmICh0aGlzLmN1cnNvciA+PSBCeXRlQXJyYXkucGFnZVNpemUpIHRoaXMubmV3UGFnZSgpO1xuICB0aGlzLnBhZ2VzW3RoaXMucGFnZV1bdGhpcy5jdXJzb3IrK10gPSB2YWw7XG59O1xuXG5CeXRlQXJyYXkucHJvdG90eXBlLndyaXRlVVRGQnl0ZXMgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgZm9yICh2YXIgbCA9IHN0cmluZy5sZW5ndGgsIGkgPSAwOyBpIDwgbDsgaSsrKVxuICAgIHRoaXMud3JpdGVCeXRlKHN0cmluZy5jaGFyQ29kZUF0KGkpKTtcbn07XG5cbkJ5dGVBcnJheS5wcm90b3R5cGUud3JpdGVCeXRlcyA9IGZ1bmN0aW9uKGFycmF5LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBsID0gbGVuZ3RoIHx8IGFycmF5Lmxlbmd0aCwgaSA9IG9mZnNldCB8fCAwOyBpIDwgbDsgaSsrKVxuICAgIHRoaXMud3JpdGVCeXRlKGFycmF5W2ldKTtcbn07XG5cbmZ1bmN0aW9uIEdJRkVuY29kZXIod2lkdGgsIGhlaWdodCkge1xuICAvLyBpbWFnZSBzaXplXG4gIHRoaXMud2lkdGggPSB+fndpZHRoO1xuICB0aGlzLmhlaWdodCA9IH5+aGVpZ2h0O1xuXG4gIC8vIHRyYW5zcGFyZW50IGNvbG9yIGlmIGdpdmVuXG4gIHRoaXMudHJhbnNwYXJlbnQgPSBudWxsO1xuXG4gIC8vIHRyYW5zcGFyZW50IGluZGV4IGluIGNvbG9yIHRhYmxlXG4gIHRoaXMudHJhbnNJbmRleCA9IDA7XG5cbiAgLy8gLTEgPSBubyByZXBlYXQsIDAgPSBmb3JldmVyLiBhbnl0aGluZyBlbHNlIGlzIHJlcGVhdCBjb3VudFxuICB0aGlzLnJlcGVhdCA9IC0xO1xuXG4gIC8vIGZyYW1lIGRlbGF5IChodW5kcmVkdGhzKVxuICB0aGlzLmRlbGF5ID0gMDtcblxuICB0aGlzLmltYWdlID0gbnVsbDsgLy8gY3VycmVudCBmcmFtZVxuICB0aGlzLnBpeGVscyA9IG51bGw7IC8vIEJHUiBieXRlIGFycmF5IGZyb20gZnJhbWVcbiAgdGhpcy5pbmRleGVkUGl4ZWxzID0gbnVsbDsgLy8gY29udmVydGVkIGZyYW1lIGluZGV4ZWQgdG8gcGFsZXR0ZVxuICB0aGlzLmNvbG9yRGVwdGggPSBudWxsOyAvLyBudW1iZXIgb2YgYml0IHBsYW5lc1xuICB0aGlzLmNvbG9yVGFiID0gbnVsbDsgLy8gUkdCIHBhbGV0dGVcbiAgdGhpcy5uZXVRdWFudCA9IG51bGw7IC8vIE5ldVF1YW50IGluc3RhbmNlIHRoYXQgd2FzIHVzZWQgdG8gZ2VuZXJhdGUgdGhpcy5jb2xvclRhYi5cbiAgdGhpcy51c2VkRW50cnkgPSBuZXcgQXJyYXkoKTsgLy8gYWN0aXZlIHBhbGV0dGUgZW50cmllc1xuICB0aGlzLnBhbFNpemUgPSA3OyAvLyBjb2xvciB0YWJsZSBzaXplIChiaXRzLTEpXG4gIHRoaXMuZGlzcG9zZSA9IC0xOyAvLyBkaXNwb3NhbCBjb2RlICgtMSA9IHVzZSBkZWZhdWx0KVxuICB0aGlzLmZpcnN0RnJhbWUgPSB0cnVlO1xuICB0aGlzLnNhbXBsZSA9IDEwOyAvLyBkZWZhdWx0IHNhbXBsZSBpbnRlcnZhbCBmb3IgcXVhbnRpemVyXG4gIHRoaXMuZGl0aGVyID0gZmFsc2U7IC8vIGRlZmF1bHQgZGl0aGVyaW5nXG4gIHRoaXMuZ2xvYmFsUGFsZXR0ZSA9IGZhbHNlO1xuXG4gIHRoaXMub3V0ID0gbmV3IEJ5dGVBcnJheSgpO1xufVxuXG4vKlxuICBTZXRzIHRoZSBkZWxheSB0aW1lIGJldHdlZW4gZWFjaCBmcmFtZSwgb3IgY2hhbmdlcyBpdCBmb3Igc3Vic2VxdWVudCBmcmFtZXNcbiAgKGFwcGxpZXMgdG8gbGFzdCBmcmFtZSBhZGRlZClcbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5zZXREZWxheSA9IGZ1bmN0aW9uKG1pbGxpc2Vjb25kcykge1xuICB0aGlzLmRlbGF5ID0gTWF0aC5yb3VuZChtaWxsaXNlY29uZHMgLyAxMCk7XG59O1xuXG4vKlxuICBTZXRzIGZyYW1lIHJhdGUgaW4gZnJhbWVzIHBlciBzZWNvbmQuXG4qL1xuR0lGRW5jb2Rlci5wcm90b3R5cGUuc2V0RnJhbWVSYXRlID0gZnVuY3Rpb24oZnBzKSB7XG4gIHRoaXMuZGVsYXkgPSBNYXRoLnJvdW5kKDEwMCAvIGZwcyk7XG59O1xuXG4vKlxuICBTZXRzIHRoZSBHSUYgZnJhbWUgZGlzcG9zYWwgY29kZSBmb3IgdGhlIGxhc3QgYWRkZWQgZnJhbWUgYW5kIGFueVxuICBzdWJzZXF1ZW50IGZyYW1lcy5cblxuICBEZWZhdWx0IGlzIDAgaWYgbm8gdHJhbnNwYXJlbnQgY29sb3IgaGFzIGJlZW4gc2V0LCBvdGhlcndpc2UgMi5cbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5zZXREaXNwb3NlID0gZnVuY3Rpb24oZGlzcG9zYWxDb2RlKSB7XG4gIGlmIChkaXNwb3NhbENvZGUgPj0gMCkgdGhpcy5kaXNwb3NlID0gZGlzcG9zYWxDb2RlO1xufTtcblxuLypcbiAgU2V0cyB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBzZXQgb2YgR0lGIGZyYW1lcyBzaG91bGQgYmUgcGxheWVkLlxuXG4gIC0xID0gcGxheSBvbmNlXG4gIDAgPSByZXBlYXQgaW5kZWZpbml0ZWx5XG5cbiAgRGVmYXVsdCBpcyAtMVxuXG4gIE11c3QgYmUgaW52b2tlZCBiZWZvcmUgdGhlIGZpcnN0IGltYWdlIGlzIGFkZGVkXG4qL1xuXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5zZXRSZXBlYXQgPSBmdW5jdGlvbihyZXBlYXQpIHtcbiAgdGhpcy5yZXBlYXQgPSByZXBlYXQ7XG59O1xuXG4vKlxuICBTZXRzIHRoZSB0cmFuc3BhcmVudCBjb2xvciBmb3IgdGhlIGxhc3QgYWRkZWQgZnJhbWUgYW5kIGFueSBzdWJzZXF1ZW50XG4gIGZyYW1lcy4gU2luY2UgYWxsIGNvbG9ycyBhcmUgc3ViamVjdCB0byBtb2RpZmljYXRpb24gaW4gdGhlIHF1YW50aXphdGlvblxuICBwcm9jZXNzLCB0aGUgY29sb3IgaW4gdGhlIGZpbmFsIHBhbGV0dGUgZm9yIGVhY2ggZnJhbWUgY2xvc2VzdCB0byB0aGUgZ2l2ZW5cbiAgY29sb3IgYmVjb21lcyB0aGUgdHJhbnNwYXJlbnQgY29sb3IgZm9yIHRoYXQgZnJhbWUuIE1heSBiZSBzZXQgdG8gbnVsbCB0b1xuICBpbmRpY2F0ZSBubyB0cmFuc3BhcmVudCBjb2xvci5cbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5zZXRUcmFuc3BhcmVudCA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gIHRoaXMudHJhbnNwYXJlbnQgPSBjb2xvcjtcbn07XG5cbi8qXG4gIEFkZHMgbmV4dCBHSUYgZnJhbWUuIFRoZSBmcmFtZSBpcyBub3Qgd3JpdHRlbiBpbW1lZGlhdGVseSwgYnV0IGlzXG4gIGFjdHVhbGx5IGRlZmVycmVkIHVudGlsIHRoZSBuZXh0IGZyYW1lIGlzIHJlY2VpdmVkIHNvIHRoYXQgdGltaW5nXG4gIGRhdGEgY2FuIGJlIGluc2VydGVkLiAgSW52b2tpbmcgZmluaXNoKCkgZmx1c2hlcyBhbGwgZnJhbWVzLlxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLmFkZEZyYW1lID0gZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XG4gIHRoaXMuaW1hZ2UgPSBpbWFnZURhdGE7XG5cbiAgdGhpcy5jb2xvclRhYiA9IHRoaXMuZ2xvYmFsUGFsZXR0ZSAmJiB0aGlzLmdsb2JhbFBhbGV0dGUuc2xpY2UgPyB0aGlzLmdsb2JhbFBhbGV0dGUgOiBudWxsO1xuXG4gIHRoaXMuZ2V0SW1hZ2VQaXhlbHMoKTsgLy8gY29udmVydCB0byBjb3JyZWN0IGZvcm1hdCBpZiBuZWNlc3NhcnlcbiAgdGhpcy5hbmFseXplUGl4ZWxzKCk7IC8vIGJ1aWxkIGNvbG9yIHRhYmxlICYgbWFwIHBpeGVsc1xuXG4gIGlmICh0aGlzLmdsb2JhbFBhbGV0dGUgPT09IHRydWUpIHRoaXMuZ2xvYmFsUGFsZXR0ZSA9IHRoaXMuY29sb3JUYWI7XG5cbiAgaWYgKHRoaXMuZmlyc3RGcmFtZSkge1xuICAgIHRoaXMud3JpdGVMU0QoKTsgLy8gbG9naWNhbCBzY3JlZW4gZGVzY3JpcHRpb3JcbiAgICB0aGlzLndyaXRlUGFsZXR0ZSgpOyAvLyBnbG9iYWwgY29sb3IgdGFibGVcbiAgICBpZiAodGhpcy5yZXBlYXQgPj0gMCkge1xuICAgICAgLy8gdXNlIE5TIGFwcCBleHRlbnNpb24gdG8gaW5kaWNhdGUgcmVwc1xuICAgICAgdGhpcy53cml0ZU5ldHNjYXBlRXh0KCk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy53cml0ZUdyYXBoaWNDdHJsRXh0KCk7IC8vIHdyaXRlIGdyYXBoaWMgY29udHJvbCBleHRlbnNpb25cbiAgdGhpcy53cml0ZUltYWdlRGVzYygpOyAvLyBpbWFnZSBkZXNjcmlwdG9yXG4gIGlmICghdGhpcy5maXJzdEZyYW1lICYmICF0aGlzLmdsb2JhbFBhbGV0dGUpIHRoaXMud3JpdGVQYWxldHRlKCk7IC8vIGxvY2FsIGNvbG9yIHRhYmxlXG4gIHRoaXMud3JpdGVQaXhlbHMoKTsgLy8gZW5jb2RlIGFuZCB3cml0ZSBwaXhlbCBkYXRhXG5cbiAgdGhpcy5maXJzdEZyYW1lID0gZmFsc2U7XG59O1xuXG4vKlxuICBBZGRzIGZpbmFsIHRyYWlsZXIgdG8gdGhlIEdJRiBzdHJlYW0sIGlmIHlvdSBkb24ndCBjYWxsIHRoZSBmaW5pc2ggbWV0aG9kXG4gIHRoZSBHSUYgc3RyZWFtIHdpbGwgbm90IGJlIHZhbGlkLlxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm91dC53cml0ZUJ5dGUoMHgzYik7IC8vIGdpZiB0cmFpbGVyXG59O1xuXG4vKlxuICBTZXRzIHF1YWxpdHkgb2YgY29sb3IgcXVhbnRpemF0aW9uIChjb252ZXJzaW9uIG9mIGltYWdlcyB0byB0aGUgbWF4aW11bSAyNTZcbiAgY29sb3JzIGFsbG93ZWQgYnkgdGhlIEdJRiBzcGVjaWZpY2F0aW9uKS4gTG93ZXIgdmFsdWVzIChtaW5pbXVtID0gMSlcbiAgcHJvZHVjZSBiZXR0ZXIgY29sb3JzLCBidXQgc2xvdyBwcm9jZXNzaW5nIHNpZ25pZmljYW50bHkuIDEwIGlzIHRoZVxuICBkZWZhdWx0LCBhbmQgcHJvZHVjZXMgZ29vZCBjb2xvciBtYXBwaW5nIGF0IHJlYXNvbmFibGUgc3BlZWRzLiBWYWx1ZXNcbiAgZ3JlYXRlciB0aGFuIDIwIGRvIG5vdCB5aWVsZCBzaWduaWZpY2FudCBpbXByb3ZlbWVudHMgaW4gc3BlZWQuXG4qL1xuR0lGRW5jb2Rlci5wcm90b3R5cGUuc2V0UXVhbGl0eSA9IGZ1bmN0aW9uKHF1YWxpdHkpIHtcbiAgaWYgKHF1YWxpdHkgPCAxKSBxdWFsaXR5ID0gMTtcbiAgdGhpcy5zYW1wbGUgPSBxdWFsaXR5O1xufTtcblxuLypcbiAgU2V0cyBkaXRoZXJpbmcgbWV0aG9kLiBBdmFpbGFibGUgYXJlOlxuICAtIEZBTFNFIG5vIGRpdGhlcmluZ1xuICAtIFRSVUUgb3IgRmxveWRTdGVpbmJlcmdcbiAgLSBGYWxzZUZsb3lkU3RlaW5iZXJnXG4gIC0gU3R1Y2tpXG4gIC0gQXRraW5zb25cbiAgWW91IGNhbiBhZGQgJy1zZXJwZW50aW5lJyB0byB1c2Ugc2VycGVudGluZSBzY2FubmluZ1xuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLnNldERpdGhlciA9IGZ1bmN0aW9uKGRpdGhlcikge1xuICBpZiAoZGl0aGVyID09PSB0cnVlKSBkaXRoZXIgPSAnRmxveWRTdGVpbmJlcmcnO1xuICB0aGlzLmRpdGhlciA9IGRpdGhlcjtcbn07XG5cbi8qXG4gIFNldHMgZ2xvYmFsIHBhbGV0dGUgZm9yIGFsbCBmcmFtZXMuXG4gIFlvdSBjYW4gcHJvdmlkZSBUUlVFIHRvIGNyZWF0ZSBnbG9iYWwgcGFsZXR0ZSBmcm9tIGZpcnN0IHBpY3R1cmUuXG4gIE9yIGFuIGFycmF5IG9mIHIsZyxiLHIsZyxiLC4uLlxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLnNldEdsb2JhbFBhbGV0dGUgPSBmdW5jdGlvbihwYWxldHRlKSB7XG4gIHRoaXMuZ2xvYmFsUGFsZXR0ZSA9IHBhbGV0dGU7XG59O1xuXG4vKlxuICBSZXR1cm5zIGdsb2JhbCBwYWxldHRlIHVzZWQgZm9yIGFsbCBmcmFtZXMuXG4gIElmIHNldEdsb2JhbFBhbGV0dGUodHJ1ZSkgd2FzIHVzZWQsIHRoZW4gdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVyblxuICBjYWxjdWxhdGVkIHBhbGV0dGUgYWZ0ZXIgdGhlIGZpcnN0IGZyYW1lIGlzIGFkZGVkLlxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLmdldEdsb2JhbFBhbGV0dGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICh0aGlzLmdsb2JhbFBhbGV0dGUgJiYgdGhpcy5nbG9iYWxQYWxldHRlLnNsaWNlICYmIHRoaXMuZ2xvYmFsUGFsZXR0ZS5zbGljZSgwKSkgfHwgdGhpcy5nbG9iYWxQYWxldHRlO1xufTtcblxuLypcbiAgV3JpdGVzIEdJRiBmaWxlIGhlYWRlclxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLndyaXRlSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub3V0LndyaXRlVVRGQnl0ZXMoXCJHSUY4OWFcIik7XG59O1xuXG4vKlxuICBBbmFseXplcyBjdXJyZW50IGZyYW1lIGNvbG9ycyBhbmQgY3JlYXRlcyBjb2xvciBtYXAuXG4qL1xuR0lGRW5jb2Rlci5wcm90b3R5cGUuYW5hbHl6ZVBpeGVscyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY29sb3JUYWIpIHtcbiAgICB0aGlzLm5ldVF1YW50ID0gbmV3IE5ldVF1YW50KHRoaXMucGl4ZWxzLCB0aGlzLnNhbXBsZSk7XG4gICAgdGhpcy5uZXVRdWFudC5idWlsZENvbG9ybWFwKCk7IC8vIGNyZWF0ZSByZWR1Y2VkIHBhbGV0dGVcbiAgICB0aGlzLmNvbG9yVGFiID0gdGhpcy5uZXVRdWFudC5nZXRDb2xvcm1hcCgpO1xuICB9XG5cbiAgLy8gbWFwIGltYWdlIHBpeGVscyB0byBuZXcgcGFsZXR0ZVxuICBpZiAodGhpcy5kaXRoZXIpIHtcbiAgICB0aGlzLmRpdGhlclBpeGVscyh0aGlzLmRpdGhlci5yZXBsYWNlKCctc2VycGVudGluZScsICcnKSwgdGhpcy5kaXRoZXIubWF0Y2goLy1zZXJwZW50aW5lLykgIT09IG51bGwpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaW5kZXhQaXhlbHMoKTtcbiAgfVxuXG4gIHRoaXMucGl4ZWxzID0gbnVsbDtcbiAgdGhpcy5jb2xvckRlcHRoID0gODtcbiAgdGhpcy5wYWxTaXplID0gNztcblxuICAvLyBnZXQgY2xvc2VzdCBtYXRjaCB0byB0cmFuc3BhcmVudCBjb2xvciBpZiBzcGVjaWZpZWRcbiAgaWYgKHRoaXMudHJhbnNwYXJlbnQgIT09IG51bGwpIHtcbiAgICB0aGlzLnRyYW5zSW5kZXggPSB0aGlzLmZpbmRDbG9zZXN0KHRoaXMudHJhbnNwYXJlbnQsIHRydWUpO1xuICB9XG59O1xuXG4vKlxuICBJbmRleCBwaXhlbHMsIHdpdGhvdXQgZGl0aGVyaW5nXG4qL1xuR0lGRW5jb2Rlci5wcm90b3R5cGUuaW5kZXhQaXhlbHMgPSBmdW5jdGlvbihpbWdxKSB7XG4gIHZhciBuUGl4ID0gdGhpcy5waXhlbHMubGVuZ3RoIC8gMztcbiAgdGhpcy5pbmRleGVkUGl4ZWxzID0gbmV3IFVpbnQ4QXJyYXkoblBpeCk7XG4gIHZhciBrID0gMDtcbiAgZm9yICh2YXIgaiA9IDA7IGogPCBuUGl4OyBqKyspIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLmZpbmRDbG9zZXN0UkdCKFxuICAgICAgdGhpcy5waXhlbHNbaysrXSAmIDB4ZmYsXG4gICAgICB0aGlzLnBpeGVsc1trKytdICYgMHhmZixcbiAgICAgIHRoaXMucGl4ZWxzW2srK10gJiAweGZmXG4gICAgKTtcbiAgICB0aGlzLnVzZWRFbnRyeVtpbmRleF0gPSB0cnVlO1xuICAgIHRoaXMuaW5kZXhlZFBpeGVsc1tqXSA9IGluZGV4O1xuICB9XG59O1xuXG4vKlxuICBUYWtlbiBmcm9tIGh0dHA6Ly9qc2Jpbi5jb20vaVhvZklqaS8yL2VkaXQgYnkgUEFFelxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLmRpdGhlclBpeGVscyA9IGZ1bmN0aW9uKGtlcm5lbCwgc2VycGVudGluZSkge1xuICB2YXIga2VybmVscyA9IHtcbiAgICBGYWxzZUZsb3lkU3RlaW5iZXJnOiBbXG4gICAgICBbMyAvIDgsIDEsIDBdLFxuICAgICAgWzMgLyA4LCAwLCAxXSxcbiAgICAgIFsyIC8gOCwgMSwgMV1cbiAgICBdLFxuICAgIEZsb3lkU3RlaW5iZXJnOiBbXG4gICAgICBbNyAvIDE2LCAxLCAwXSxcbiAgICAgIFszIC8gMTYsIC0xLCAxXSxcbiAgICAgIFs1IC8gMTYsIDAsIDFdLFxuICAgICAgWzEgLyAxNiwgMSwgMV1cbiAgICBdLFxuICAgIFN0dWNraTogW1xuICAgICAgWzggLyA0MiwgMSwgMF0sXG4gICAgICBbNCAvIDQyLCAyLCAwXSxcbiAgICAgIFsyIC8gNDIsIC0yLCAxXSxcbiAgICAgIFs0IC8gNDIsIC0xLCAxXSxcbiAgICAgIFs4IC8gNDIsIDAsIDFdLFxuICAgICAgWzQgLyA0MiwgMSwgMV0sXG4gICAgICBbMiAvIDQyLCAyLCAxXSxcbiAgICAgIFsxIC8gNDIsIC0yLCAyXSxcbiAgICAgIFsyIC8gNDIsIC0xLCAyXSxcbiAgICAgIFs0IC8gNDIsIDAsIDJdLFxuICAgICAgWzIgLyA0MiwgMSwgMl0sXG4gICAgICBbMSAvIDQyLCAyLCAyXVxuICAgIF0sXG4gICAgQXRraW5zb246IFtcbiAgICAgIFsxIC8gOCwgMSwgMF0sXG4gICAgICBbMSAvIDgsIDIsIDBdLFxuICAgICAgWzEgLyA4LCAtMSwgMV0sXG4gICAgICBbMSAvIDgsIDAsIDFdLFxuICAgICAgWzEgLyA4LCAxLCAxXSxcbiAgICAgIFsxIC8gOCwgMCwgMl1cbiAgICBdXG4gIH07XG5cbiAgaWYgKCFrZXJuZWwgfHwgIWtlcm5lbHNba2VybmVsXSkge1xuICAgIHRocm93ICdVbmtub3duIGRpdGhlcmluZyBrZXJuZWw6ICcgKyBrZXJuZWw7XG4gIH1cblxuICB2YXIgZHMgPSBrZXJuZWxzW2tlcm5lbF07XG4gIHZhciBpbmRleCA9IDAsXG4gICAgaGVpZ2h0ID0gdGhpcy5oZWlnaHQsXG4gICAgd2lkdGggPSB0aGlzLndpZHRoLFxuICAgIGRhdGEgPSB0aGlzLnBpeGVscztcbiAgdmFyIGRpcmVjdGlvbiA9IHNlcnBlbnRpbmUgPyAtMSA6IDE7XG5cbiAgdGhpcy5pbmRleGVkUGl4ZWxzID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5waXhlbHMubGVuZ3RoIC8gMyk7XG5cbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXG4gICAgaWYgKHNlcnBlbnRpbmUpIGRpcmVjdGlvbiA9IGRpcmVjdGlvbiAqIC0xO1xuXG4gICAgZm9yICh2YXIgeCA9IChkaXJlY3Rpb24gPT0gMSA/IDAgOiB3aWR0aCAtIDEpLCB4ZW5kID0gKGRpcmVjdGlvbiA9PSAxID8gd2lkdGggOiAwKTsgeCAhPT0geGVuZDsgeCArPSBkaXJlY3Rpb24pIHtcblxuICAgICAgaW5kZXggPSAoeSAqIHdpZHRoKSArIHg7XG4gICAgICAvLyBHZXQgb3JpZ2luYWwgY29sb3VyXG4gICAgICB2YXIgaWR4ID0gaW5kZXggKiAzO1xuICAgICAgdmFyIHIxID0gZGF0YVtpZHhdO1xuICAgICAgdmFyIGcxID0gZGF0YVtpZHggKyAxXTtcbiAgICAgIHZhciBiMSA9IGRhdGFbaWR4ICsgMl07XG5cbiAgICAgIC8vIEdldCBjb252ZXJ0ZWQgY29sb3VyXG4gICAgICBpZHggPSB0aGlzLmZpbmRDbG9zZXN0UkdCKHIxLCBnMSwgYjEpO1xuICAgICAgdGhpcy51c2VkRW50cnlbaWR4XSA9IHRydWU7XG4gICAgICB0aGlzLmluZGV4ZWRQaXhlbHNbaW5kZXhdID0gaWR4O1xuICAgICAgaWR4ICo9IDM7XG4gICAgICB2YXIgcjIgPSB0aGlzLmNvbG9yVGFiW2lkeF07XG4gICAgICB2YXIgZzIgPSB0aGlzLmNvbG9yVGFiW2lkeCArIDFdO1xuICAgICAgdmFyIGIyID0gdGhpcy5jb2xvclRhYltpZHggKyAyXTtcblxuICAgICAgdmFyIGVyID0gcjEgLSByMjtcbiAgICAgIHZhciBlZyA9IGcxIC0gZzI7XG4gICAgICB2YXIgZWIgPSBiMSAtIGIyO1xuXG4gICAgICBmb3IgKHZhciBpID0gKGRpcmVjdGlvbiA9PSAxID8gMDogZHMubGVuZ3RoIC0gMSksIGVuZCA9IChkaXJlY3Rpb24gPT0gMSA/IGRzLmxlbmd0aCA6IDApOyBpICE9PSBlbmQ7IGkgKz0gZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciB4MSA9IGRzW2ldWzFdOyAvLyAqZGlyZWN0aW9uOyAgLy8gIFNob3VsZCB0aGlzIGJ5IHRpbWVzZCBieSBkaXJlY3Rpb24/Li50byBtYWtlIHRoZSBrZXJuZWwgZ28gaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbi4uLi5nb3Qgbm8gaWRlYS4uLi5cbiAgICAgICAgdmFyIHkxID0gZHNbaV1bMl07XG4gICAgICAgIGlmICh4MSArIHggPj0gMCAmJiB4MSArIHggPCB3aWR0aCAmJiB5MSArIHkgPj0gMCAmJiB5MSArIHkgPCBoZWlnaHQpIHtcbiAgICAgICAgICB2YXIgZCA9IGRzW2ldWzBdO1xuICAgICAgICAgIGlkeCA9IGluZGV4ICsgeDEgKyAoeTEgKiB3aWR0aCk7XG4gICAgICAgICAgaWR4ICo9IDM7XG5cbiAgICAgICAgICBkYXRhW2lkeF0gPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGRhdGFbaWR4XSArIGVyICogZCkpO1xuICAgICAgICAgIGRhdGFbaWR4ICsgMV0gPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGRhdGFbaWR4ICsgMV0gKyBlZyAqIGQpKTtcbiAgICAgICAgICBkYXRhW2lkeCArIDJdID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBkYXRhW2lkeCArIDJdICsgZWIgKiBkKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbi8qXG4gIFJldHVybnMgaW5kZXggb2YgcGFsZXR0ZSBjb2xvciBjbG9zZXN0IHRvIGNcbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5maW5kQ2xvc2VzdCA9IGZ1bmN0aW9uKGMsIHVzZWQpIHtcbiAgcmV0dXJuIHRoaXMuZmluZENsb3Nlc3RSR0IoKGMgJiAweEZGMDAwMCkgPj4gMTYsIChjICYgMHgwMEZGMDApID4+IDgsIChjICYgMHgwMDAwRkYpLCB1c2VkKTtcbn07XG5cbkdJRkVuY29kZXIucHJvdG90eXBlLmZpbmRDbG9zZXN0UkdCID0gZnVuY3Rpb24ociwgZywgYiwgdXNlZCkge1xuICBpZiAodGhpcy5jb2xvclRhYiA9PT0gbnVsbCkgcmV0dXJuIC0xO1xuXG4gIGlmICh0aGlzLm5ldVF1YW50ICYmICF1c2VkKSB7XG4gICAgcmV0dXJuIHRoaXMubmV1UXVhbnQubG9va3VwUkdCKHIsIGcsIGIpO1xuICB9XG5cbiAgdmFyIGMgPSBiIHwgKGcgPDwgOCkgfCAociA8PCAxNik7XG5cbiAgdmFyIG1pbnBvcyA9IDA7XG4gIHZhciBkbWluID0gMjU2ICogMjU2ICogMjU2O1xuICB2YXIgbGVuID0gdGhpcy5jb2xvclRhYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGluZGV4ID0gMDsgaSA8IGxlbjsgaW5kZXgrKykge1xuICAgIHZhciBkciA9IHIgLSAodGhpcy5jb2xvclRhYltpKytdICYgMHhmZik7XG4gICAgdmFyIGRnID0gZyAtICh0aGlzLmNvbG9yVGFiW2krK10gJiAweGZmKTtcbiAgICB2YXIgZGIgPSBiIC0gKHRoaXMuY29sb3JUYWJbaSsrXSAmIDB4ZmYpO1xuICAgIHZhciBkID0gZHIgKiBkciArIGRnICogZGcgKyBkYiAqIGRiO1xuICAgIGlmICgoIXVzZWQgfHwgdGhpcy51c2VkRW50cnlbaW5kZXhdKSAmJiAoZCA8IGRtaW4pKSB7XG4gICAgICBkbWluID0gZDtcbiAgICAgIG1pbnBvcyA9IGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtaW5wb3M7XG59O1xuXG4vKlxuICBFeHRyYWN0cyBpbWFnZSBwaXhlbHMgaW50byBieXRlIGFycmF5IHBpeGVsc1xuICAocmVtb3ZlcyBhbHBoYWNoYW5uZWwgZnJvbSBjYW52YXMgaW1hZ2VkYXRhKVxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLmdldEltYWdlUGl4ZWxzID0gZnVuY3Rpb24oKSB7XG4gIHZhciB3ID0gdGhpcy53aWR0aDtcbiAgdmFyIGggPSB0aGlzLmhlaWdodDtcbiAgdGhpcy5waXhlbHMgPSBuZXcgVWludDhBcnJheSh3ICogaCAqIDMpO1xuXG4gIHZhciBkYXRhID0gdGhpcy5pbWFnZTtcbiAgdmFyIHNyY1BvcyA9IDA7XG4gIHZhciBjb3VudCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBoOyBpKyspIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHc7IGorKykge1xuICAgICAgdGhpcy5waXhlbHNbY291bnQrK10gPSBkYXRhW3NyY1BvcysrXTtcbiAgICAgIHRoaXMucGl4ZWxzW2NvdW50KytdID0gZGF0YVtzcmNQb3MrK107XG4gICAgICB0aGlzLnBpeGVsc1tjb3VudCsrXSA9IGRhdGFbc3JjUG9zKytdO1xuICAgICAgc3JjUG9zKys7XG4gICAgfVxuICB9XG59O1xuXG4vKlxuICBXcml0ZXMgR3JhcGhpYyBDb250cm9sIEV4dGVuc2lvblxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLndyaXRlR3JhcGhpY0N0cmxFeHQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vdXQud3JpdGVCeXRlKDB4MjEpOyAvLyBleHRlbnNpb24gaW50cm9kdWNlclxuICB0aGlzLm91dC53cml0ZUJ5dGUoMHhmOSk7IC8vIEdDRSBsYWJlbFxuICB0aGlzLm91dC53cml0ZUJ5dGUoNCk7IC8vIGRhdGEgYmxvY2sgc2l6ZVxuXG4gIHZhciB0cmFuc3AsIGRpc3A7XG4gIGlmICh0aGlzLnRyYW5zcGFyZW50ID09PSBudWxsKSB7XG4gICAgdHJhbnNwID0gMDtcbiAgICBkaXNwID0gMDsgLy8gZGlzcG9zZSA9IG5vIGFjdGlvblxuICB9IGVsc2Uge1xuICAgIHRyYW5zcCA9IDE7XG4gICAgZGlzcCA9IDI7IC8vIGZvcmNlIGNsZWFyIGlmIHVzaW5nIHRyYW5zcGFyZW50IGNvbG9yXG4gIH1cblxuICBpZiAodGhpcy5kaXNwb3NlID49IDApIHtcbiAgICBkaXNwID0gdGhpcy5kaXNwb3NlICYgNzsgLy8gdXNlciBvdmVycmlkZVxuICB9XG4gIGRpc3AgPDw9IDI7XG5cbiAgLy8gcGFja2VkIGZpZWxkc1xuICB0aGlzLm91dC53cml0ZUJ5dGUoXG4gICAgMCB8IC8vIDE6MyByZXNlcnZlZFxuICAgIGRpc3AgfCAvLyA0OjYgZGlzcG9zYWxcbiAgICAwIHwgLy8gNyB1c2VyIGlucHV0IC0gMCA9IG5vbmVcbiAgICB0cmFuc3AgLy8gOCB0cmFuc3BhcmVuY3kgZmxhZ1xuICApO1xuXG4gIHRoaXMud3JpdGVTaG9ydCh0aGlzLmRlbGF5KTsgLy8gZGVsYXkgeCAxLzEwMCBzZWNcbiAgdGhpcy5vdXQud3JpdGVCeXRlKHRoaXMudHJhbnNJbmRleCk7IC8vIHRyYW5zcGFyZW50IGNvbG9yIGluZGV4XG4gIHRoaXMub3V0LndyaXRlQnl0ZSgwKTsgLy8gYmxvY2sgdGVybWluYXRvclxufTtcblxuLypcbiAgV3JpdGVzIEltYWdlIERlc2NyaXB0b3JcbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS53cml0ZUltYWdlRGVzYyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm91dC53cml0ZUJ5dGUoMHgyYyk7IC8vIGltYWdlIHNlcGFyYXRvclxuICB0aGlzLndyaXRlU2hvcnQoMCk7IC8vIGltYWdlIHBvc2l0aW9uIHgseSA9IDAsMFxuICB0aGlzLndyaXRlU2hvcnQoMCk7XG4gIHRoaXMud3JpdGVTaG9ydCh0aGlzLndpZHRoKTsgLy8gaW1hZ2Ugc2l6ZVxuICB0aGlzLndyaXRlU2hvcnQodGhpcy5oZWlnaHQpO1xuXG4gIC8vIHBhY2tlZCBmaWVsZHNcbiAgaWYgKHRoaXMuZmlyc3RGcmFtZSB8fCB0aGlzLmdsb2JhbFBhbGV0dGUpIHtcbiAgICAvLyBubyBMQ1QgLSBHQ1QgaXMgdXNlZCBmb3IgZmlyc3QgKG9yIG9ubHkpIGZyYW1lXG4gICAgdGhpcy5vdXQud3JpdGVCeXRlKDApO1xuICB9IGVsc2Uge1xuICAgIC8vIHNwZWNpZnkgbm9ybWFsIExDVFxuICAgIHRoaXMub3V0LndyaXRlQnl0ZShcbiAgICAgIDB4ODAgfCAvLyAxIGxvY2FsIGNvbG9yIHRhYmxlIDE9eWVzXG4gICAgICAwIHwgLy8gMiBpbnRlcmxhY2UgLSAwPW5vXG4gICAgICAwIHwgLy8gMyBzb3J0ZWQgLSAwPW5vXG4gICAgICAwIHwgLy8gNC01IHJlc2VydmVkXG4gICAgICB0aGlzLnBhbFNpemUgLy8gNi04IHNpemUgb2YgY29sb3IgdGFibGVcbiAgICApO1xuICB9XG59O1xuXG4vKlxuICBXcml0ZXMgTG9naWNhbCBTY3JlZW4gRGVzY3JpcHRvclxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLndyaXRlTFNEID0gZnVuY3Rpb24oKSB7XG4gIC8vIGxvZ2ljYWwgc2NyZWVuIHNpemVcbiAgdGhpcy53cml0ZVNob3J0KHRoaXMud2lkdGgpO1xuICB0aGlzLndyaXRlU2hvcnQodGhpcy5oZWlnaHQpO1xuXG4gIC8vIHBhY2tlZCBmaWVsZHNcbiAgdGhpcy5vdXQud3JpdGVCeXRlKFxuICAgIDB4ODAgfCAvLyAxIDogZ2xvYmFsIGNvbG9yIHRhYmxlIGZsYWcgPSAxIChnY3QgdXNlZClcbiAgICAweDcwIHwgLy8gMi00IDogY29sb3IgcmVzb2x1dGlvbiA9IDdcbiAgICAweDAwIHwgLy8gNSA6IGdjdCBzb3J0IGZsYWcgPSAwXG4gICAgdGhpcy5wYWxTaXplIC8vIDYtOCA6IGdjdCBzaXplXG4gICk7XG5cbiAgdGhpcy5vdXQud3JpdGVCeXRlKDApOyAvLyBiYWNrZ3JvdW5kIGNvbG9yIGluZGV4XG4gIHRoaXMub3V0LndyaXRlQnl0ZSgwKTsgLy8gcGl4ZWwgYXNwZWN0IHJhdGlvIC0gYXNzdW1lIDE6MVxufTtcblxuLypcbiAgV3JpdGVzIE5ldHNjYXBlIGFwcGxpY2F0aW9uIGV4dGVuc2lvbiB0byBkZWZpbmUgcmVwZWF0IGNvdW50LlxuKi9cbkdJRkVuY29kZXIucHJvdG90eXBlLndyaXRlTmV0c2NhcGVFeHQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vdXQud3JpdGVCeXRlKDB4MjEpOyAvLyBleHRlbnNpb24gaW50cm9kdWNlclxuICB0aGlzLm91dC53cml0ZUJ5dGUoMHhmZik7IC8vIGFwcCBleHRlbnNpb24gbGFiZWxcbiAgdGhpcy5vdXQud3JpdGVCeXRlKDExKTsgLy8gYmxvY2sgc2l6ZVxuICB0aGlzLm91dC53cml0ZVVURkJ5dGVzKCdORVRTQ0FQRTIuMCcpOyAvLyBhcHAgaWQgKyBhdXRoIGNvZGVcbiAgdGhpcy5vdXQud3JpdGVCeXRlKDMpOyAvLyBzdWItYmxvY2sgc2l6ZVxuICB0aGlzLm91dC53cml0ZUJ5dGUoMSk7IC8vIGxvb3Agc3ViLWJsb2NrIGlkXG4gIHRoaXMud3JpdGVTaG9ydCh0aGlzLnJlcGVhdCk7IC8vIGxvb3AgY291bnQgKGV4dHJhIGl0ZXJhdGlvbnMsIDA9cmVwZWF0IGZvcmV2ZXIpXG4gIHRoaXMub3V0LndyaXRlQnl0ZSgwKTsgLy8gYmxvY2sgdGVybWluYXRvclxufTtcblxuLypcbiAgV3JpdGVzIGNvbG9yIHRhYmxlXG4qL1xuR0lGRW5jb2Rlci5wcm90b3R5cGUud3JpdGVQYWxldHRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub3V0LndyaXRlQnl0ZXModGhpcy5jb2xvclRhYik7XG4gIHZhciBuID0gKDMgKiAyNTYpIC0gdGhpcy5jb2xvclRhYi5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKVxuICAgIHRoaXMub3V0LndyaXRlQnl0ZSgwKTtcbn07XG5cbkdJRkVuY29kZXIucHJvdG90eXBlLndyaXRlU2hvcnQgPSBmdW5jdGlvbihwVmFsdWUpIHtcbiAgdGhpcy5vdXQud3JpdGVCeXRlKHBWYWx1ZSAmIDB4RkYpO1xuICB0aGlzLm91dC53cml0ZUJ5dGUoKHBWYWx1ZSA+PiA4KSAmIDB4RkYpO1xufTtcblxuLypcbiAgRW5jb2RlcyBhbmQgd3JpdGVzIHBpeGVsIGRhdGFcbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS53cml0ZVBpeGVscyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZW5jID0gbmV3IExaV0VuY29kZXIodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMuaW5kZXhlZFBpeGVscywgdGhpcy5jb2xvckRlcHRoKTtcbiAgZW5jLmVuY29kZSh0aGlzLm91dCk7XG59O1xuXG4vKlxuICBSZXRyaWV2ZXMgdGhlIEdJRiBzdHJlYW1cbiovXG5HSUZFbmNvZGVyLnByb3RvdHlwZS5zdHJlYW0gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3V0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHSUZFbmNvZGVyO1xuIiwiLypcbiAgTFpXRW5jb2Rlci5qc1xuXG4gIEF1dGhvcnNcbiAgS2V2aW4gV2VpbmVyIChvcmlnaW5hbCBKYXZhIHZlcnNpb24gLSBrd2VpbmVyQGZtc3dhcmUuY29tKVxuICBUaGliYXVsdCBJbWJlcnQgKEFTMyB2ZXJzaW9uIC0gYnl0ZWFycmF5Lm9yZylcbiAgSm9oYW4gTm9yZGJlcmcgKEpTIHZlcnNpb24gLSBjb2RlQGpvaGFuLW5vcmRiZXJnLmNvbSlcblxuICBBY2tub3dsZWRnZW1lbnRzXG4gIEdJRkNPTVBSLkMgLSBHSUYgSW1hZ2UgY29tcHJlc3Npb24gcm91dGluZXNcbiAgTGVtcGVsLVppdiBjb21wcmVzc2lvbiBiYXNlZCBvbiAnY29tcHJlc3MnLiBHSUYgbW9kaWZpY2F0aW9ucyBieVxuICBEYXZpZCBSb3dsZXkgKG1nYXJkaUB3YXRkY3N1LndhdGVybG9vLmVkdSlcbiAgR0lGIEltYWdlIGNvbXByZXNzaW9uIC0gbW9kaWZpZWQgJ2NvbXByZXNzJ1xuICBCYXNlZCBvbjogY29tcHJlc3MuYyAtIEZpbGUgY29tcHJlc3Npb24gYWxhIElFRUUgQ29tcHV0ZXIsIEp1bmUgMTk4NC5cbiAgQnkgQXV0aG9yczogU3BlbmNlciBXLiBUaG9tYXMgKGRlY3ZheCFoYXJwbyF1dGFoLWNzIXV0YWgtZ3IhdGhvbWFzKVxuICBKaW0gTWNLaWUgKGRlY3ZheCFtY3ZheCFqaW0pXG4gIFN0ZXZlIERhdmllcyAoZGVjdmF4IXZheDEzNSFwZXRzZCFwZW9yYSFzcmQpXG4gIEtlbiBUdXJrb3dza2kgKGRlY3ZheCFkZWN3cmwhdHVydGxldmF4IWtlbilcbiAgSmFtZXMgQS4gV29vZHMgKGRlY3ZheCFpaG5wNCFhbWVzIWphdylcbiAgSm9lIE9yb3N0IChkZWN2YXghdmF4MTM1IXBldHNkIWpvZSlcbiovXG5cbnZhciBFT0YgPSAtMTtcbnZhciBCSVRTID0gMTI7XG52YXIgSFNJWkUgPSA1MDAzOyAvLyA4MCUgb2NjdXBhbmN5XG52YXIgbWFza3MgPSBbMHgwMDAwLCAweDAwMDEsIDB4MDAwMywgMHgwMDA3LCAweDAwMEYsIDB4MDAxRixcbiAgICAgICAgICAgICAweDAwM0YsIDB4MDA3RiwgMHgwMEZGLCAweDAxRkYsIDB4MDNGRiwgMHgwN0ZGLFxuICAgICAgICAgICAgIDB4MEZGRiwgMHgxRkZGLCAweDNGRkYsIDB4N0ZGRiwgMHhGRkZGXTtcblxuZnVuY3Rpb24gTFpXRW5jb2Rlcih3aWR0aCwgaGVpZ2h0LCBwaXhlbHMsIGNvbG9yRGVwdGgpIHtcbiAgdmFyIGluaXRDb2RlU2l6ZSA9IE1hdGgubWF4KDIsIGNvbG9yRGVwdGgpO1xuXG4gIHZhciBhY2N1bSA9IG5ldyBVaW50OEFycmF5KDI1Nik7XG4gIHZhciBodGFiID0gbmV3IEludDMyQXJyYXkoSFNJWkUpO1xuICB2YXIgY29kZXRhYiA9IG5ldyBJbnQzMkFycmF5KEhTSVpFKTtcblxuICB2YXIgY3VyX2FjY3VtLCBjdXJfYml0cyA9IDA7XG4gIHZhciBhX2NvdW50O1xuICB2YXIgZnJlZV9lbnQgPSAwOyAvLyBmaXJzdCB1bnVzZWQgZW50cnlcbiAgdmFyIG1heGNvZGU7XG5cbiAgLy8gYmxvY2sgY29tcHJlc3Npb24gcGFyYW1ldGVycyAtLSBhZnRlciBhbGwgY29kZXMgYXJlIHVzZWQgdXAsXG4gIC8vIGFuZCBjb21wcmVzc2lvbiByYXRlIGNoYW5nZXMsIHN0YXJ0IG92ZXIuXG4gIHZhciBjbGVhcl9mbGcgPSBmYWxzZTtcblxuICAvLyBBbGdvcml0aG06IHVzZSBvcGVuIGFkZHJlc3NpbmcgZG91YmxlIGhhc2hpbmcgKG5vIGNoYWluaW5nKSBvbiB0aGVcbiAgLy8gcHJlZml4IGNvZGUgLyBuZXh0IGNoYXJhY3RlciBjb21iaW5hdGlvbi4gV2UgZG8gYSB2YXJpYW50IG9mIEtudXRoJ3NcbiAgLy8gYWxnb3JpdGhtIEQgKHZvbC4gMywgc2VjLiA2LjQpIGFsb25nIHdpdGggRy4gS25vdHQncyByZWxhdGl2ZWx5LXByaW1lXG4gIC8vIHNlY29uZGFyeSBwcm9iZS4gSGVyZSwgdGhlIG1vZHVsYXIgZGl2aXNpb24gZmlyc3QgcHJvYmUgaXMgZ2l2ZXMgd2F5XG4gIC8vIHRvIGEgZmFzdGVyIGV4Y2x1c2l2ZS1vciBtYW5pcHVsYXRpb24uIEFsc28gZG8gYmxvY2sgY29tcHJlc3Npb24gd2l0aFxuICAvLyBhbiBhZGFwdGl2ZSByZXNldCwgd2hlcmVieSB0aGUgY29kZSB0YWJsZSBpcyBjbGVhcmVkIHdoZW4gdGhlIGNvbXByZXNzaW9uXG4gIC8vIHJhdGlvIGRlY3JlYXNlcywgYnV0IGFmdGVyIHRoZSB0YWJsZSBmaWxscy4gVGhlIHZhcmlhYmxlLWxlbmd0aCBvdXRwdXRcbiAgLy8gY29kZXMgYXJlIHJlLXNpemVkIGF0IHRoaXMgcG9pbnQsIGFuZCBhIHNwZWNpYWwgQ0xFQVIgY29kZSBpcyBnZW5lcmF0ZWRcbiAgLy8gZm9yIHRoZSBkZWNvbXByZXNzb3IuIExhdGUgYWRkaXRpb246IGNvbnN0cnVjdCB0aGUgdGFibGUgYWNjb3JkaW5nIHRvXG4gIC8vIGZpbGUgc2l6ZSBmb3Igbm90aWNlYWJsZSBzcGVlZCBpbXByb3ZlbWVudCBvbiBzbWFsbCBmaWxlcy4gUGxlYXNlIGRpcmVjdFxuICAvLyBxdWVzdGlvbnMgYWJvdXQgdGhpcyBpbXBsZW1lbnRhdGlvbiB0byBhbWVzIWphdy5cbiAgdmFyIGdfaW5pdF9iaXRzLCBDbGVhckNvZGUsIEVPRkNvZGU7XG5cbiAgLy8gQWRkIGEgY2hhcmFjdGVyIHRvIHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgcGFja2V0LCBhbmQgaWYgaXQgaXMgMjU0XG4gIC8vIGNoYXJhY3RlcnMsIGZsdXNoIHRoZSBwYWNrZXQgdG8gZGlzay5cbiAgZnVuY3Rpb24gY2hhcl9vdXQoYywgb3V0cykge1xuICAgIGFjY3VtW2FfY291bnQrK10gPSBjO1xuICAgIGlmIChhX2NvdW50ID49IDI1NCkgZmx1c2hfY2hhcihvdXRzKTtcbiAgfVxuXG4gIC8vIENsZWFyIG91dCB0aGUgaGFzaCB0YWJsZVxuICAvLyB0YWJsZSBjbGVhciBmb3IgYmxvY2sgY29tcHJlc3NcbiAgZnVuY3Rpb24gY2xfYmxvY2sob3V0cykge1xuICAgIGNsX2hhc2goSFNJWkUpO1xuICAgIGZyZWVfZW50ID0gQ2xlYXJDb2RlICsgMjtcbiAgICBjbGVhcl9mbGcgPSB0cnVlO1xuICAgIG91dHB1dChDbGVhckNvZGUsIG91dHMpO1xuICB9XG5cbiAgLy8gUmVzZXQgY29kZSB0YWJsZVxuICBmdW5jdGlvbiBjbF9oYXNoKGhzaXplKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoc2l6ZTsgKytpKSBodGFiW2ldID0gLTE7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wcmVzcyhpbml0X2JpdHMsIG91dHMpIHtcbiAgICB2YXIgZmNvZGUsIGMsIGksIGVudCwgZGlzcCwgaHNpemVfcmVnLCBoc2hpZnQ7XG5cbiAgICAvLyBTZXQgdXAgdGhlIGdsb2JhbHM6IGdfaW5pdF9iaXRzIC0gaW5pdGlhbCBudW1iZXIgb2YgYml0c1xuICAgIGdfaW5pdF9iaXRzID0gaW5pdF9iaXRzO1xuXG4gICAgLy8gU2V0IHVwIHRoZSBuZWNlc3NhcnkgdmFsdWVzXG4gICAgY2xlYXJfZmxnID0gZmFsc2U7XG4gICAgbl9iaXRzID0gZ19pbml0X2JpdHM7XG4gICAgbWF4Y29kZSA9IE1BWENPREUobl9iaXRzKTtcblxuICAgIENsZWFyQ29kZSA9IDEgPDwgKGluaXRfYml0cyAtIDEpO1xuICAgIEVPRkNvZGUgPSBDbGVhckNvZGUgKyAxO1xuICAgIGZyZWVfZW50ID0gQ2xlYXJDb2RlICsgMjtcblxuICAgIGFfY291bnQgPSAwOyAvLyBjbGVhciBwYWNrZXRcblxuICAgIGVudCA9IG5leHRQaXhlbCgpO1xuXG4gICAgaHNoaWZ0ID0gMDtcbiAgICBmb3IgKGZjb2RlID0gSFNJWkU7IGZjb2RlIDwgNjU1MzY7IGZjb2RlICo9IDIpICsraHNoaWZ0O1xuICAgIGhzaGlmdCA9IDggLSBoc2hpZnQ7IC8vIHNldCBoYXNoIGNvZGUgcmFuZ2UgYm91bmRcbiAgICBoc2l6ZV9yZWcgPSBIU0laRTtcbiAgICBjbF9oYXNoKGhzaXplX3JlZyk7IC8vIGNsZWFyIGhhc2ggdGFibGVcblxuICAgIG91dHB1dChDbGVhckNvZGUsIG91dHMpO1xuXG4gICAgb3V0ZXJfbG9vcDogd2hpbGUgKChjID0gbmV4dFBpeGVsKCkpICE9IEVPRikge1xuICAgICAgZmNvZGUgPSAoYyA8PCBCSVRTKSArIGVudDtcbiAgICAgIGkgPSAoYyA8PCBoc2hpZnQpIF4gZW50OyAvLyB4b3IgaGFzaGluZ1xuICAgICAgaWYgKGh0YWJbaV0gPT09IGZjb2RlKSB7XG4gICAgICAgIGVudCA9IGNvZGV0YWJbaV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChodGFiW2ldID49IDApIHsgLy8gbm9uLWVtcHR5IHNsb3RcbiAgICAgICAgZGlzcCA9IGhzaXplX3JlZyAtIGk7IC8vIHNlY29uZGFyeSBoYXNoIChhZnRlciBHLiBLbm90dClcbiAgICAgICAgaWYgKGkgPT09IDApIGRpc3AgPSAxO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKChpIC09IGRpc3ApIDwgMCkgaSArPSBoc2l6ZV9yZWc7XG4gICAgICAgICAgaWYgKGh0YWJbaV0gPT09IGZjb2RlKSB7XG4gICAgICAgICAgICBlbnQgPSBjb2RldGFiW2ldO1xuICAgICAgICAgICAgY29udGludWUgb3V0ZXJfbG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGh0YWJbaV0gPj0gMCk7XG4gICAgICB9XG4gICAgICBvdXRwdXQoZW50LCBvdXRzKTtcbiAgICAgIGVudCA9IGM7XG4gICAgICBpZiAoZnJlZV9lbnQgPCAxIDw8IEJJVFMpIHtcbiAgICAgICAgY29kZXRhYltpXSA9IGZyZWVfZW50Kys7IC8vIGNvZGUgLT4gaGFzaHRhYmxlXG4gICAgICAgIGh0YWJbaV0gPSBmY29kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsX2Jsb2NrKG91dHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFB1dCBvdXQgdGhlIGZpbmFsIGNvZGUuXG4gICAgb3V0cHV0KGVudCwgb3V0cyk7XG4gICAgb3V0cHV0KEVPRkNvZGUsIG91dHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5jb2RlKG91dHMpIHtcbiAgICBvdXRzLndyaXRlQnl0ZShpbml0Q29kZVNpemUpOyAvLyB3cml0ZSBcImluaXRpYWwgY29kZSBzaXplXCIgYnl0ZVxuICAgIHJlbWFpbmluZyA9IHdpZHRoICogaGVpZ2h0OyAvLyByZXNldCBuYXZpZ2F0aW9uIHZhcmlhYmxlc1xuICAgIGN1clBpeGVsID0gMDtcbiAgICBjb21wcmVzcyhpbml0Q29kZVNpemUgKyAxLCBvdXRzKTsgLy8gY29tcHJlc3MgYW5kIHdyaXRlIHRoZSBwaXhlbCBkYXRhXG4gICAgb3V0cy53cml0ZUJ5dGUoMCk7IC8vIHdyaXRlIGJsb2NrIHRlcm1pbmF0b3JcbiAgfVxuXG4gIC8vIEZsdXNoIHRoZSBwYWNrZXQgdG8gZGlzaywgYW5kIHJlc2V0IHRoZSBhY2N1bXVsYXRvclxuICBmdW5jdGlvbiBmbHVzaF9jaGFyKG91dHMpIHtcbiAgICBpZiAoYV9jb3VudCA+IDApIHtcbiAgICAgIG91dHMud3JpdGVCeXRlKGFfY291bnQpO1xuICAgICAgb3V0cy53cml0ZUJ5dGVzKGFjY3VtLCAwLCBhX2NvdW50KTtcbiAgICAgIGFfY291bnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIE1BWENPREUobl9iaXRzKSB7XG4gICAgcmV0dXJuICgxIDw8IG5fYml0cykgLSAxO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBuZXh0IHBpeGVsIGZyb20gdGhlIGltYWdlXG4gIGZ1bmN0aW9uIG5leHRQaXhlbCgpIHtcbiAgICBpZiAocmVtYWluaW5nID09PSAwKSByZXR1cm4gRU9GO1xuICAgIC0tcmVtYWluaW5nO1xuICAgIHZhciBwaXggPSBwaXhlbHNbY3VyUGl4ZWwrK107XG4gICAgcmV0dXJuIHBpeCAmIDB4ZmY7XG4gIH1cblxuICBmdW5jdGlvbiBvdXRwdXQoY29kZSwgb3V0cykge1xuICAgIGN1cl9hY2N1bSAmPSBtYXNrc1tjdXJfYml0c107XG5cbiAgICBpZiAoY3VyX2JpdHMgPiAwKSBjdXJfYWNjdW0gfD0gKGNvZGUgPDwgY3VyX2JpdHMpO1xuICAgIGVsc2UgY3VyX2FjY3VtID0gY29kZTtcblxuICAgIGN1cl9iaXRzICs9IG5fYml0cztcblxuICAgIHdoaWxlIChjdXJfYml0cyA+PSA4KSB7XG4gICAgICBjaGFyX291dCgoY3VyX2FjY3VtICYgMHhmZiksIG91dHMpO1xuICAgICAgY3VyX2FjY3VtID4+PSA4O1xuICAgICAgY3VyX2JpdHMgLT0gODtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgbmV4dCBlbnRyeSBpcyBnb2luZyB0byBiZSB0b28gYmlnIGZvciB0aGUgY29kZSBzaXplLFxuICAgIC8vIHRoZW4gaW5jcmVhc2UgaXQsIGlmIHBvc3NpYmxlLlxuICAgIGlmIChmcmVlX2VudCA+IG1heGNvZGUgfHwgY2xlYXJfZmxnKSB7XG4gICAgICBpZiAoY2xlYXJfZmxnKSB7XG4gICAgICAgIG1heGNvZGUgPSBNQVhDT0RFKG5fYml0cyA9IGdfaW5pdF9iaXRzKTtcbiAgICAgICAgY2xlYXJfZmxnID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICArK25fYml0cztcbiAgICAgICAgaWYgKG5fYml0cyA9PSBCSVRTKSBtYXhjb2RlID0gMSA8PCBCSVRTO1xuICAgICAgICBlbHNlIG1heGNvZGUgPSBNQVhDT0RFKG5fYml0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT0gRU9GQ29kZSkge1xuICAgICAgLy8gQXQgRU9GLCB3cml0ZSB0aGUgcmVzdCBvZiB0aGUgYnVmZmVyLlxuICAgICAgd2hpbGUgKGN1cl9iaXRzID4gMCkge1xuICAgICAgICBjaGFyX291dCgoY3VyX2FjY3VtICYgMHhmZiksIG91dHMpO1xuICAgICAgICBjdXJfYWNjdW0gPj49IDg7XG4gICAgICAgIGN1cl9iaXRzIC09IDg7XG4gICAgICB9XG4gICAgICBmbHVzaF9jaGFyKG91dHMpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZW5jb2RlID0gZW5jb2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExaV0VuY29kZXI7XG4iLCIvKiBOZXVRdWFudCBOZXVyYWwtTmV0IFF1YW50aXphdGlvbiBBbGdvcml0aG1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIENvcHlyaWdodCAoYykgMTk5NCBBbnRob255IERla2tlclxuICpcbiAqIE5FVVFVQU5UIE5ldXJhbC1OZXQgcXVhbnRpemF0aW9uIGFsZ29yaXRobSBieSBBbnRob255IERla2tlciwgMTk5NC5cbiAqIFNlZSBcIktvaG9uZW4gbmV1cmFsIG5ldHdvcmtzIGZvciBvcHRpbWFsIGNvbG91ciBxdWFudGl6YXRpb25cIlxuICogaW4gXCJOZXR3b3JrOiBDb21wdXRhdGlvbiBpbiBOZXVyYWwgU3lzdGVtc1wiIFZvbC4gNSAoMTk5NCkgcHAgMzUxLTM2Ny5cbiAqIGZvciBhIGRpc2N1c3Npb24gb2YgdGhlIGFsZ29yaXRobS5cbiAqIFNlZSBhbHNvICBodHRwOi8vbWVtYmVycy5vemVtYWlsLmNvbS5hdS9+ZGVra2VyL05FVVFVQU5ULkhUTUxcbiAqXG4gKiBBbnkgcGFydHkgb2J0YWluaW5nIGEgY29weSBvZiB0aGVzZSBmaWxlcyBmcm9tIHRoZSBhdXRob3IsIGRpcmVjdGx5IG9yXG4gKiBpbmRpcmVjdGx5LCBpcyBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgYSBmdWxsIGFuZCB1bnJlc3RyaWN0ZWQgaXJyZXZvY2FibGUsXG4gKiB3b3JsZC13aWRlLCBwYWlkIHVwLCByb3lhbHR5LWZyZWUsIG5vbmV4Y2x1c2l2ZSByaWdodCBhbmQgbGljZW5zZSB0byBkZWFsXG4gKiBpbiB0aGlzIHNvZnR3YXJlIGFuZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgaW5jbHVkaW5nIHdpdGhvdXRcbiAqIGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4gKiBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgd2hvIHJlY2VpdmVcbiAqIGNvcGllcyBmcm9tIGFueSBzdWNoIHBhcnR5IHRvIGRvIHNvLCB3aXRoIHRoZSBvbmx5IHJlcXVpcmVtZW50IGJlaW5nXG4gKiB0aGF0IHRoaXMgY29weXJpZ2h0IG5vdGljZSByZW1haW4gaW50YWN0LlxuICpcbiAqIChKYXZhU2NyaXB0IHBvcnQgMjAxMiBieSBKb2hhbiBOb3JkYmVyZylcbiAqL1xuXG52YXIgbmN5Y2xlcyA9IDEwMDsgLy8gbnVtYmVyIG9mIGxlYXJuaW5nIGN5Y2xlc1xudmFyIG5ldHNpemUgPSAyNTY7IC8vIG51bWJlciBvZiBjb2xvcnMgdXNlZFxudmFyIG1heG5ldHBvcyA9IG5ldHNpemUgLSAxO1xuXG4vLyBkZWZzIGZvciBmcmVxIGFuZCBiaWFzXG52YXIgbmV0Ymlhc3NoaWZ0ID0gNDsgLy8gYmlhcyBmb3IgY29sb3VyIHZhbHVlc1xudmFyIGludGJpYXNzaGlmdCA9IDE2OyAvLyBiaWFzIGZvciBmcmFjdGlvbnNcbnZhciBpbnRiaWFzID0gKDEgPDwgaW50Ymlhc3NoaWZ0KTtcbnZhciBnYW1tYXNoaWZ0ID0gMTA7XG52YXIgZ2FtbWEgPSAoMSA8PCBnYW1tYXNoaWZ0KTtcbnZhciBiZXRhc2hpZnQgPSAxMDtcbnZhciBiZXRhID0gKGludGJpYXMgPj4gYmV0YXNoaWZ0KTsgLyogYmV0YSA9IDEvMTAyNCAqL1xudmFyIGJldGFnYW1tYSA9IChpbnRiaWFzIDw8IChnYW1tYXNoaWZ0IC0gYmV0YXNoaWZ0KSk7XG5cbi8vIGRlZnMgZm9yIGRlY3JlYXNpbmcgcmFkaXVzIGZhY3RvclxudmFyIGluaXRyYWQgPSAobmV0c2l6ZSA+PiAzKTsgLy8gZm9yIDI1NiBjb2xzLCByYWRpdXMgc3RhcnRzXG52YXIgcmFkaXVzYmlhc3NoaWZ0ID0gNjsgLy8gYXQgMzIuMCBiaWFzZWQgYnkgNiBiaXRzXG52YXIgcmFkaXVzYmlhcyA9ICgxIDw8IHJhZGl1c2JpYXNzaGlmdCk7XG52YXIgaW5pdHJhZGl1cyA9IChpbml0cmFkICogcmFkaXVzYmlhcyk7IC8vYW5kIGRlY3JlYXNlcyBieSBhXG52YXIgcmFkaXVzZGVjID0gMzA7IC8vIGZhY3RvciBvZiAxLzMwIGVhY2ggY3ljbGVcblxuLy8gZGVmcyBmb3IgZGVjcmVhc2luZyBhbHBoYSBmYWN0b3JcbnZhciBhbHBoYWJpYXNzaGlmdCA9IDEwOyAvLyBhbHBoYSBzdGFydHMgYXQgMS4wXG52YXIgaW5pdGFscGhhID0gKDEgPDwgYWxwaGFiaWFzc2hpZnQpO1xudmFyIGFscGhhZGVjOyAvLyBiaWFzZWQgYnkgMTAgYml0c1xuXG4vKiByYWRiaWFzIGFuZCBhbHBoYXJhZGJpYXMgdXNlZCBmb3IgcmFkcG93ZXIgY2FsY3VsYXRpb24gKi9cbnZhciByYWRiaWFzc2hpZnQgPSA4O1xudmFyIHJhZGJpYXMgPSAoMSA8PCByYWRiaWFzc2hpZnQpO1xudmFyIGFscGhhcmFkYnNoaWZ0ID0gKGFscGhhYmlhc3NoaWZ0ICsgcmFkYmlhc3NoaWZ0KTtcbnZhciBhbHBoYXJhZGJpYXMgPSAoMSA8PCBhbHBoYXJhZGJzaGlmdCk7XG5cbi8vIGZvdXIgcHJpbWVzIG5lYXIgNTAwIC0gYXNzdW1lIG5vIGltYWdlIGhhcyBhIGxlbmd0aCBzbyBsYXJnZSB0aGF0IGl0IGlzXG4vLyBkaXZpc2libGUgYnkgYWxsIGZvdXIgcHJpbWVzXG52YXIgcHJpbWUxID0gNDk5O1xudmFyIHByaW1lMiA9IDQ5MTtcbnZhciBwcmltZTMgPSA0ODc7XG52YXIgcHJpbWU0ID0gNTAzO1xudmFyIG1pbnBpY3R1cmVieXRlcyA9ICgzICogcHJpbWU0KTtcblxuLypcbiAgQ29uc3RydWN0b3I6IE5ldVF1YW50XG5cbiAgQXJndW1lbnRzOlxuXG4gIHBpeGVscyAtIGFycmF5IG9mIHBpeGVscyBpbiBSR0IgZm9ybWF0XG4gIHNhbXBsZWZhYyAtIHNhbXBsaW5nIGZhY3RvciAxIHRvIDMwIHdoZXJlIGxvd2VyIGlzIGJldHRlciBxdWFsaXR5XG5cbiAgPlxuICA+IHBpeGVscyA9IFtyLCBnLCBiLCByLCBnLCBiLCByLCBnLCBiLCAuLl1cbiAgPlxuKi9cbmZ1bmN0aW9uIE5ldVF1YW50KHBpeGVscywgc2FtcGxlZmFjKSB7XG4gIHZhciBuZXR3b3JrOyAvLyBpbnRbbmV0c2l6ZV1bNF1cbiAgdmFyIG5ldGluZGV4OyAvLyBmb3IgbmV0d29yayBsb29rdXAgLSByZWFsbHkgMjU2XG5cbiAgLy8gYmlhcyBhbmQgZnJlcSBhcnJheXMgZm9yIGxlYXJuaW5nXG4gIHZhciBiaWFzO1xuICB2YXIgZnJlcTtcbiAgdmFyIHJhZHBvd2VyO1xuXG4gIC8qXG4gICAgUHJpdmF0ZSBNZXRob2Q6IGluaXRcblxuICAgIHNldHMgdXAgYXJyYXlzXG4gICovXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbmV0d29yayA9IFtdO1xuICAgIG5ldGluZGV4ID0gbmV3IEludDMyQXJyYXkoMjU2KTtcbiAgICBiaWFzID0gbmV3IEludDMyQXJyYXkobmV0c2l6ZSk7XG4gICAgZnJlcSA9IG5ldyBJbnQzMkFycmF5KG5ldHNpemUpO1xuICAgIHJhZHBvd2VyID0gbmV3IEludDMyQXJyYXkobmV0c2l6ZSA+PiAzKTtcblxuICAgIHZhciBpLCB2O1xuICAgIGZvciAoaSA9IDA7IGkgPCBuZXRzaXplOyBpKyspIHtcbiAgICAgIHYgPSAoaSA8PCAobmV0Ymlhc3NoaWZ0ICsgOCkpIC8gbmV0c2l6ZTtcbiAgICAgIG5ldHdvcmtbaV0gPSBuZXcgRmxvYXQ2NEFycmF5KFt2LCB2LCB2LCAwXSk7XG4gICAgICAvL25ldHdvcmtbaV0gPSBbdiwgdiwgdiwgMF1cbiAgICAgIGZyZXFbaV0gPSBpbnRiaWFzIC8gbmV0c2l6ZTtcbiAgICAgIGJpYXNbaV0gPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAgUHJpdmF0ZSBNZXRob2Q6IHVuYmlhc25ldFxuXG4gICAgdW5iaWFzZXMgbmV0d29yayB0byBnaXZlIGJ5dGUgdmFsdWVzIDAuLjI1NSBhbmQgcmVjb3JkIHBvc2l0aW9uIGkgdG8gcHJlcGFyZSBmb3Igc29ydFxuICAqL1xuICBmdW5jdGlvbiB1bmJpYXNuZXQoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXRzaXplOyBpKyspIHtcbiAgICAgIG5ldHdvcmtbaV1bMF0gPj49IG5ldGJpYXNzaGlmdDtcbiAgICAgIG5ldHdvcmtbaV1bMV0gPj49IG5ldGJpYXNzaGlmdDtcbiAgICAgIG5ldHdvcmtbaV1bMl0gPj49IG5ldGJpYXNzaGlmdDtcbiAgICAgIG5ldHdvcmtbaV1bM10gPSBpOyAvLyByZWNvcmQgY29sb3IgbnVtYmVyXG4gICAgfVxuICB9XG5cbiAgLypcbiAgICBQcml2YXRlIE1ldGhvZDogYWx0ZXJzaW5nbGVcblxuICAgIG1vdmVzIG5ldXJvbiAqaSogdG93YXJkcyBiaWFzZWQgKGIsZyxyKSBieSBmYWN0b3IgKmFscGhhKlxuICAqL1xuICBmdW5jdGlvbiBhbHRlcnNpbmdsZShhbHBoYSwgaSwgYiwgZywgcikge1xuICAgIG5ldHdvcmtbaV1bMF0gLT0gKGFscGhhICogKG5ldHdvcmtbaV1bMF0gLSBiKSkgLyBpbml0YWxwaGE7XG4gICAgbmV0d29ya1tpXVsxXSAtPSAoYWxwaGEgKiAobmV0d29ya1tpXVsxXSAtIGcpKSAvIGluaXRhbHBoYTtcbiAgICBuZXR3b3JrW2ldWzJdIC09IChhbHBoYSAqIChuZXR3b3JrW2ldWzJdIC0gcikpIC8gaW5pdGFscGhhO1xuICB9XG5cbiAgLypcbiAgICBQcml2YXRlIE1ldGhvZDogYWx0ZXJuZWlnaFxuXG4gICAgbW92ZXMgbmV1cm9ucyBpbiAqcmFkaXVzKiBhcm91bmQgaW5kZXggKmkqIHRvd2FyZHMgYmlhc2VkIChiLGcscikgYnkgZmFjdG9yICphbHBoYSpcbiAgKi9cbiAgZnVuY3Rpb24gYWx0ZXJuZWlnaChyYWRpdXMsIGksIGIsIGcsIHIpIHtcbiAgICB2YXIgbG8gPSBNYXRoLmFicyhpIC0gcmFkaXVzKTtcbiAgICB2YXIgaGkgPSBNYXRoLm1pbihpICsgcmFkaXVzLCBuZXRzaXplKTtcblxuICAgIHZhciBqID0gaSArIDE7XG4gICAgdmFyIGsgPSBpIC0gMTtcbiAgICB2YXIgbSA9IDE7XG5cbiAgICB2YXIgcCwgYTtcbiAgICB3aGlsZSAoKGogPCBoaSkgfHwgKGsgPiBsbykpIHtcbiAgICAgIGEgPSByYWRwb3dlclttKytdO1xuXG4gICAgICBpZiAoaiA8IGhpKSB7XG4gICAgICAgIHAgPSBuZXR3b3JrW2orK107XG4gICAgICAgIHBbMF0gLT0gKGEgKiAocFswXSAtIGIpKSAvIGFscGhhcmFkYmlhcztcbiAgICAgICAgcFsxXSAtPSAoYSAqIChwWzFdIC0gZykpIC8gYWxwaGFyYWRiaWFzO1xuICAgICAgICBwWzJdIC09IChhICogKHBbMl0gLSByKSkgLyBhbHBoYXJhZGJpYXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChrID4gbG8pIHtcbiAgICAgICAgcCA9IG5ldHdvcmtbay0tXTtcbiAgICAgICAgcFswXSAtPSAoYSAqIChwWzBdIC0gYikpIC8gYWxwaGFyYWRiaWFzO1xuICAgICAgICBwWzFdIC09IChhICogKHBbMV0gLSBnKSkgLyBhbHBoYXJhZGJpYXM7XG4gICAgICAgIHBbMl0gLT0gKGEgKiAocFsyXSAtIHIpKSAvIGFscGhhcmFkYmlhcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgIFByaXZhdGUgTWV0aG9kOiBjb250ZXN0XG5cbiAgICBzZWFyY2hlcyBmb3IgYmlhc2VkIEJHUiB2YWx1ZXNcbiAgKi9cbiAgZnVuY3Rpb24gY29udGVzdChiLCBnLCByKSB7XG4gICAgLypcbiAgICAgIGZpbmRzIGNsb3Nlc3QgbmV1cm9uIChtaW4gZGlzdCkgYW5kIHVwZGF0ZXMgZnJlcVxuICAgICAgZmluZHMgYmVzdCBuZXVyb24gKG1pbiBkaXN0LWJpYXMpIGFuZCByZXR1cm5zIHBvc2l0aW9uXG4gICAgICBmb3IgZnJlcXVlbnRseSBjaG9zZW4gbmV1cm9ucywgZnJlcVtpXSBpcyBoaWdoIGFuZCBiaWFzW2ldIGlzIG5lZ2F0aXZlXG4gICAgICBiaWFzW2ldID0gZ2FtbWEgKiAoKDEgLyBuZXRzaXplKSAtIGZyZXFbaV0pXG4gICAgKi9cblxuICAgIHZhciBiZXN0ZCA9IH4oMSA8PCAzMSk7XG4gICAgdmFyIGJlc3RiaWFzZCA9IGJlc3RkO1xuICAgIHZhciBiZXN0cG9zID0gLTE7XG4gICAgdmFyIGJlc3RiaWFzcG9zID0gYmVzdHBvcztcblxuICAgIHZhciBpLCBuLCBkaXN0LCBiaWFzZGlzdCwgYmV0YWZyZXE7XG4gICAgZm9yIChpID0gMDsgaSA8IG5ldHNpemU7IGkrKykge1xuICAgICAgbiA9IG5ldHdvcmtbaV07XG5cbiAgICAgIGRpc3QgPSBNYXRoLmFicyhuWzBdIC0gYikgKyBNYXRoLmFicyhuWzFdIC0gZykgKyBNYXRoLmFicyhuWzJdIC0gcik7XG4gICAgICBpZiAoZGlzdCA8IGJlc3RkKSB7XG4gICAgICAgIGJlc3RkID0gZGlzdDtcbiAgICAgICAgYmVzdHBvcyA9IGk7XG4gICAgICB9XG5cbiAgICAgIGJpYXNkaXN0ID0gZGlzdCAtICgoYmlhc1tpXSkgPj4gKGludGJpYXNzaGlmdCAtIG5ldGJpYXNzaGlmdCkpO1xuICAgICAgaWYgKGJpYXNkaXN0IDwgYmVzdGJpYXNkKSB7XG4gICAgICAgIGJlc3RiaWFzZCA9IGJpYXNkaXN0O1xuICAgICAgICBiZXN0Ymlhc3BvcyA9IGk7XG4gICAgICB9XG5cbiAgICAgIGJldGFmcmVxID0gKGZyZXFbaV0gPj4gYmV0YXNoaWZ0KTtcbiAgICAgIGZyZXFbaV0gLT0gYmV0YWZyZXE7XG4gICAgICBiaWFzW2ldICs9IChiZXRhZnJlcSA8PCBnYW1tYXNoaWZ0KTtcbiAgICB9XG5cbiAgICBmcmVxW2Jlc3Rwb3NdICs9IGJldGE7XG4gICAgYmlhc1tiZXN0cG9zXSAtPSBiZXRhZ2FtbWE7XG5cbiAgICByZXR1cm4gYmVzdGJpYXNwb3M7XG4gIH1cblxuICAvKlxuICAgIFByaXZhdGUgTWV0aG9kOiBpbnhidWlsZFxuXG4gICAgc29ydHMgbmV0d29yayBhbmQgYnVpbGRzIG5ldGluZGV4WzAuLjI1NV1cbiAgKi9cbiAgZnVuY3Rpb24gaW54YnVpbGQoKSB7XG4gICAgdmFyIGksIGosIHAsIHEsIHNtYWxscG9zLCBzbWFsbHZhbCwgcHJldmlvdXNjb2wgPSAwLCBzdGFydHBvcyA9IDA7XG4gICAgZm9yIChpID0gMDsgaSA8IG5ldHNpemU7IGkrKykge1xuICAgICAgcCA9IG5ldHdvcmtbaV07XG4gICAgICBzbWFsbHBvcyA9IGk7XG4gICAgICBzbWFsbHZhbCA9IHBbMV07IC8vIGluZGV4IG9uIGdcbiAgICAgIC8vIGZpbmQgc21hbGxlc3QgaW4gaS4ubmV0c2l6ZS0xXG4gICAgICBmb3IgKGogPSBpICsgMTsgaiA8IG5ldHNpemU7IGorKykge1xuICAgICAgICBxID0gbmV0d29ya1tqXTtcbiAgICAgICAgaWYgKHFbMV0gPCBzbWFsbHZhbCkgeyAvLyBpbmRleCBvbiBnXG4gICAgICAgICAgc21hbGxwb3MgPSBqO1xuICAgICAgICAgIHNtYWxsdmFsID0gcVsxXTsgLy8gaW5kZXggb24gZ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBxID0gbmV0d29ya1tzbWFsbHBvc107XG4gICAgICAvLyBzd2FwIHAgKGkpIGFuZCBxIChzbWFsbHBvcykgZW50cmllc1xuICAgICAgaWYgKGkgIT0gc21hbGxwb3MpIHtcbiAgICAgICAgaiA9IHFbMF07ICAgcVswXSA9IHBbMF07ICAgcFswXSA9IGo7XG4gICAgICAgIGogPSBxWzFdOyAgIHFbMV0gPSBwWzFdOyAgIHBbMV0gPSBqO1xuICAgICAgICBqID0gcVsyXTsgICBxWzJdID0gcFsyXTsgICBwWzJdID0gajtcbiAgICAgICAgaiA9IHFbM107ICAgcVszXSA9IHBbM107ICAgcFszXSA9IGo7XG4gICAgICB9XG4gICAgICAvLyBzbWFsbHZhbCBlbnRyeSBpcyBub3cgaW4gcG9zaXRpb24gaVxuXG4gICAgICBpZiAoc21hbGx2YWwgIT0gcHJldmlvdXNjb2wpIHtcbiAgICAgICAgbmV0aW5kZXhbcHJldmlvdXNjb2xdID0gKHN0YXJ0cG9zICsgaSkgPj4gMTtcbiAgICAgICAgZm9yIChqID0gcHJldmlvdXNjb2wgKyAxOyBqIDwgc21hbGx2YWw7IGorKylcbiAgICAgICAgICBuZXRpbmRleFtqXSA9IGk7XG4gICAgICAgIHByZXZpb3VzY29sID0gc21hbGx2YWw7XG4gICAgICAgIHN0YXJ0cG9zID0gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgbmV0aW5kZXhbcHJldmlvdXNjb2xdID0gKHN0YXJ0cG9zICsgbWF4bmV0cG9zKSA+PiAxO1xuICAgIGZvciAoaiA9IHByZXZpb3VzY29sICsgMTsgaiA8IDI1NjsgaisrKVxuICAgICAgbmV0aW5kZXhbal0gPSBtYXhuZXRwb3M7IC8vIHJlYWxseSAyNTZcbiAgfVxuXG4gIC8qXG4gICAgUHJpdmF0ZSBNZXRob2Q6IGlueHNlYXJjaFxuXG4gICAgc2VhcmNoZXMgZm9yIEJHUiB2YWx1ZXMgMC4uMjU1IGFuZCByZXR1cm5zIGEgY29sb3IgaW5kZXhcbiAgKi9cbiAgZnVuY3Rpb24gaW54c2VhcmNoKGIsIGcsIHIpIHtcbiAgICB2YXIgYSwgcCwgZGlzdDtcblxuICAgIHZhciBiZXN0ZCA9IDEwMDA7IC8vIGJpZ2dlc3QgcG9zc2libGUgZGlzdCBpcyAyNTYqM1xuICAgIHZhciBiZXN0ID0gLTE7XG5cbiAgICB2YXIgaSA9IG5ldGluZGV4W2ddOyAvLyBpbmRleCBvbiBnXG4gICAgdmFyIGogPSBpIC0gMTsgLy8gc3RhcnQgYXQgbmV0aW5kZXhbZ10gYW5kIHdvcmsgb3V0d2FyZHNcblxuICAgIHdoaWxlICgoaSA8IG5ldHNpemUpIHx8IChqID49IDApKSB7XG4gICAgICBpZiAoaSA8IG5ldHNpemUpIHtcbiAgICAgICAgcCA9IG5ldHdvcmtbaV07XG4gICAgICAgIGRpc3QgPSBwWzFdIC0gZzsgLy8gaW54IGtleVxuICAgICAgICBpZiAoZGlzdCA+PSBiZXN0ZCkgaSA9IG5ldHNpemU7IC8vIHN0b3AgaXRlclxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgaWYgKGRpc3QgPCAwKSBkaXN0ID0gLWRpc3Q7XG4gICAgICAgICAgYSA9IHBbMF0gLSBiOyBpZiAoYSA8IDApIGEgPSAtYTtcbiAgICAgICAgICBkaXN0ICs9IGE7XG4gICAgICAgICAgaWYgKGRpc3QgPCBiZXN0ZCkge1xuICAgICAgICAgICAgYSA9IHBbMl0gLSByOyBpZiAoYSA8IDApIGEgPSAtYTtcbiAgICAgICAgICAgIGRpc3QgKz0gYTtcbiAgICAgICAgICAgIGlmIChkaXN0IDwgYmVzdGQpIHtcbiAgICAgICAgICAgICAgYmVzdGQgPSBkaXN0O1xuICAgICAgICAgICAgICBiZXN0ID0gcFszXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChqID49IDApIHtcbiAgICAgICAgcCA9IG5ldHdvcmtbal07XG4gICAgICAgIGRpc3QgPSBnIC0gcFsxXTsgLy8gaW54IGtleSAtIHJldmVyc2UgZGlmXG4gICAgICAgIGlmIChkaXN0ID49IGJlc3RkKSBqID0gLTE7IC8vIHN0b3AgaXRlclxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBqLS07XG4gICAgICAgICAgaWYgKGRpc3QgPCAwKSBkaXN0ID0gLWRpc3Q7XG4gICAgICAgICAgYSA9IHBbMF0gLSBiOyBpZiAoYSA8IDApIGEgPSAtYTtcbiAgICAgICAgICBkaXN0ICs9IGE7XG4gICAgICAgICAgaWYgKGRpc3QgPCBiZXN0ZCkge1xuICAgICAgICAgICAgYSA9IHBbMl0gLSByOyBpZiAoYSA8IDApIGEgPSAtYTtcbiAgICAgICAgICAgIGRpc3QgKz0gYTtcbiAgICAgICAgICAgIGlmIChkaXN0IDwgYmVzdGQpIHtcbiAgICAgICAgICAgICAgYmVzdGQgPSBkaXN0O1xuICAgICAgICAgICAgICBiZXN0ID0gcFszXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYmVzdDtcbiAgfVxuXG4gIC8qXG4gICAgUHJpdmF0ZSBNZXRob2Q6IGxlYXJuXG5cbiAgICBcIk1haW4gTGVhcm5pbmcgTG9vcFwiXG4gICovXG4gIGZ1bmN0aW9uIGxlYXJuKCkge1xuICAgIHZhciBpO1xuXG4gICAgdmFyIGxlbmd0aGNvdW50ID0gcGl4ZWxzLmxlbmd0aDtcbiAgICB2YXIgYWxwaGFkZWMgPSAzMCArICgoc2FtcGxlZmFjIC0gMSkgLyAzKTtcbiAgICB2YXIgc2FtcGxlcGl4ZWxzID0gbGVuZ3RoY291bnQgLyAoMyAqIHNhbXBsZWZhYyk7XG4gICAgdmFyIGRlbHRhID0gfn4oc2FtcGxlcGl4ZWxzIC8gbmN5Y2xlcyk7XG4gICAgdmFyIGFscGhhID0gaW5pdGFscGhhO1xuICAgIHZhciByYWRpdXMgPSBpbml0cmFkaXVzO1xuXG4gICAgdmFyIHJhZCA9IHJhZGl1cyA+PiByYWRpdXNiaWFzc2hpZnQ7XG5cbiAgICBpZiAocmFkIDw9IDEpIHJhZCA9IDA7XG4gICAgZm9yIChpID0gMDsgaSA8IHJhZDsgaSsrKVxuICAgICAgcmFkcG93ZXJbaV0gPSBhbHBoYSAqICgoKHJhZCAqIHJhZCAtIGkgKiBpKSAqIHJhZGJpYXMpIC8gKHJhZCAqIHJhZCkpO1xuXG4gICAgdmFyIHN0ZXA7XG4gICAgaWYgKGxlbmd0aGNvdW50IDwgbWlucGljdHVyZWJ5dGVzKSB7XG4gICAgICBzYW1wbGVmYWMgPSAxO1xuICAgICAgc3RlcCA9IDM7XG4gICAgfSBlbHNlIGlmICgobGVuZ3RoY291bnQgJSBwcmltZTEpICE9PSAwKSB7XG4gICAgICBzdGVwID0gMyAqIHByaW1lMTtcbiAgICB9IGVsc2UgaWYgKChsZW5ndGhjb3VudCAlIHByaW1lMikgIT09IDApIHtcbiAgICAgIHN0ZXAgPSAzICogcHJpbWUyO1xuICAgIH0gZWxzZSBpZiAoKGxlbmd0aGNvdW50ICUgcHJpbWUzKSAhPT0gMCkgIHtcbiAgICAgIHN0ZXAgPSAzICogcHJpbWUzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGVwID0gMyAqIHByaW1lNDtcbiAgICB9XG5cbiAgICB2YXIgYiwgZywgciwgajtcbiAgICB2YXIgcGl4ID0gMDsgLy8gY3VycmVudCBwaXhlbFxuXG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBzYW1wbGVwaXhlbHMpIHtcbiAgICAgIGIgPSAocGl4ZWxzW3BpeF0gJiAweGZmKSA8PCBuZXRiaWFzc2hpZnQ7XG4gICAgICBnID0gKHBpeGVsc1twaXggKyAxXSAmIDB4ZmYpIDw8IG5ldGJpYXNzaGlmdDtcbiAgICAgIHIgPSAocGl4ZWxzW3BpeCArIDJdICYgMHhmZikgPDwgbmV0Ymlhc3NoaWZ0O1xuXG4gICAgICBqID0gY29udGVzdChiLCBnLCByKTtcblxuICAgICAgYWx0ZXJzaW5nbGUoYWxwaGEsIGosIGIsIGcsIHIpO1xuICAgICAgaWYgKHJhZCAhPT0gMCkgYWx0ZXJuZWlnaChyYWQsIGosIGIsIGcsIHIpOyAvLyBhbHRlciBuZWlnaGJvdXJzXG5cbiAgICAgIHBpeCArPSBzdGVwO1xuICAgICAgaWYgKHBpeCA+PSBsZW5ndGhjb3VudCkgcGl4IC09IGxlbmd0aGNvdW50O1xuXG4gICAgICBpKys7XG5cbiAgICAgIGlmIChkZWx0YSA9PT0gMCkgZGVsdGEgPSAxO1xuICAgICAgaWYgKGkgJSBkZWx0YSA9PT0gMCkge1xuICAgICAgICBhbHBoYSAtPSBhbHBoYSAvIGFscGhhZGVjO1xuICAgICAgICByYWRpdXMgLT0gcmFkaXVzIC8gcmFkaXVzZGVjO1xuICAgICAgICByYWQgPSByYWRpdXMgPj4gcmFkaXVzYmlhc3NoaWZ0O1xuXG4gICAgICAgIGlmIChyYWQgPD0gMSkgcmFkID0gMDtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHJhZDsgaisrKVxuICAgICAgICAgIHJhZHBvd2VyW2pdID0gYWxwaGEgKiAoKChyYWQgKiByYWQgLSBqICogaikgKiByYWRiaWFzKSAvIChyYWQgKiByYWQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgIE1ldGhvZDogYnVpbGRDb2xvcm1hcFxuXG4gICAgMS4gaW5pdGlhbGl6ZXMgbmV0d29ya1xuICAgIDIuIHRyYWlucyBpdFxuICAgIDMuIHJlbW92ZXMgbWlzY29uY2VwdGlvbnNcbiAgICA0LiBidWlsZHMgY29sb3JpbmRleFxuICAqL1xuICBmdW5jdGlvbiBidWlsZENvbG9ybWFwKCkge1xuICAgIGluaXQoKTtcbiAgICBsZWFybigpO1xuICAgIHVuYmlhc25ldCgpO1xuICAgIGlueGJ1aWxkKCk7XG4gIH1cbiAgdGhpcy5idWlsZENvbG9ybWFwID0gYnVpbGRDb2xvcm1hcDtcblxuICAvKlxuICAgIE1ldGhvZDogZ2V0Q29sb3JtYXBcblxuICAgIGJ1aWxkcyBjb2xvcm1hcCBmcm9tIHRoZSBpbmRleFxuXG4gICAgcmV0dXJucyBhcnJheSBpbiB0aGUgZm9ybWF0OlxuXG4gICAgPlxuICAgID4gW3IsIGcsIGIsIHIsIGcsIGIsIHIsIGcsIGIsIC4uXVxuICAgID5cbiAgKi9cbiAgZnVuY3Rpb24gZ2V0Q29sb3JtYXAoKSB7XG4gICAgdmFyIG1hcCA9IFtdO1xuICAgIHZhciBpbmRleCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXRzaXplOyBpKyspXG4gICAgICBpbmRleFtuZXR3b3JrW2ldWzNdXSA9IGk7XG5cbiAgICB2YXIgayA9IDA7XG4gICAgZm9yICh2YXIgbCA9IDA7IGwgPCBuZXRzaXplOyBsKyspIHtcbiAgICAgIHZhciBqID0gaW5kZXhbbF07XG4gICAgICBtYXBbaysrXSA9IChuZXR3b3JrW2pdWzBdKTtcbiAgICAgIG1hcFtrKytdID0gKG5ldHdvcmtbal1bMV0pO1xuICAgICAgbWFwW2srK10gPSAobmV0d29ya1tqXVsyXSk7XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG4gIH1cbiAgdGhpcy5nZXRDb2xvcm1hcCA9IGdldENvbG9ybWFwO1xuXG4gIC8qXG4gICAgTWV0aG9kOiBsb29rdXBSR0JcblxuICAgIGxvb2tzIGZvciB0aGUgY2xvc2VzdCAqciosICpnKiwgKmIqIGNvbG9yIGluIHRoZSBtYXAgYW5kXG4gICAgcmV0dXJucyBpdHMgaW5kZXhcbiAgKi9cbiAgdGhpcy5sb29rdXBSR0IgPSBpbnhzZWFyY2g7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTmV1UXVhbnQ7XG4iLCJHSUZFbmNvZGVyID0gcmVxdWlyZSAnLi9HSUZFbmNvZGVyLmpzJ1xuXG5yZW5kZXJGcmFtZSA9IChmcmFtZSkgLT5cbiAgZW5jb2RlciA9IG5ldyBHSUZFbmNvZGVyIGZyYW1lLndpZHRoLCBmcmFtZS5oZWlnaHRcblxuICBpZiBmcmFtZS5pbmRleCBpcyAwXG4gICAgZW5jb2Rlci53cml0ZUhlYWRlcigpXG4gIGVsc2VcbiAgICBlbmNvZGVyLmZpcnN0RnJhbWUgPSBmYWxzZVxuXG4gIGVuY29kZXIuc2V0VHJhbnNwYXJlbnQgZnJhbWUudHJhbnNwYXJlbnRcbiAgZW5jb2Rlci5zZXREaXNwb3NlIGZyYW1lLmRpc3Bvc2VcbiAgZW5jb2Rlci5zZXRSZXBlYXQgZnJhbWUucmVwZWF0XG4gIGVuY29kZXIuc2V0RGVsYXkgZnJhbWUuZGVsYXlcbiAgZW5jb2Rlci5zZXRRdWFsaXR5IGZyYW1lLnF1YWxpdHlcbiAgZW5jb2Rlci5zZXREaXRoZXIgZnJhbWUuZGl0aGVyXG4gIGVuY29kZXIuc2V0R2xvYmFsUGFsZXR0ZSBmcmFtZS5nbG9iYWxQYWxldHRlXG4gIGVuY29kZXIuYWRkRnJhbWUgZnJhbWUuZGF0YVxuICBlbmNvZGVyLmZpbmlzaCgpIGlmIGZyYW1lLmxhc3RcbiAgaWYgZnJhbWUuZ2xvYmFsUGFsZXR0ZSA9PSB0cnVlXG4gICAgZnJhbWUuZ2xvYmFsUGFsZXR0ZSA9IGVuY29kZXIuZ2V0R2xvYmFsUGFsZXR0ZSgpXG5cbiAgc3RyZWFtID0gZW5jb2Rlci5zdHJlYW0oKVxuICBmcmFtZS5kYXRhID0gc3RyZWFtLnBhZ2VzXG4gIGZyYW1lLmN1cnNvciA9IHN0cmVhbS5jdXJzb3JcbiAgZnJhbWUucGFnZVNpemUgPSBzdHJlYW0uY29uc3RydWN0b3IucGFnZVNpemVcblxuICBpZiBmcmFtZS5jYW5UcmFuc2ZlclxuICAgIHRyYW5zZmVyID0gKHBhZ2UuYnVmZmVyIGZvciBwYWdlIGluIGZyYW1lLmRhdGEpXG4gICAgc2VsZi5wb3N0TWVzc2FnZSBmcmFtZSwgdHJhbnNmZXJcbiAgZWxzZVxuICAgIHNlbGYucG9zdE1lc3NhZ2UgZnJhbWVcblxuc2VsZi5vbm1lc3NhZ2UgPSAoZXZlbnQpIC0+IHJlbmRlckZyYW1lIGV2ZW50LmRhdGFcbiJdfQ==
  