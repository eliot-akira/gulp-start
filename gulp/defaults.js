
var slug = require('slug');
var setDefault = require('./util/set-default.js');
var path = require('path');

module.exports = function setAllDefaults( config ) {

  var index = 0, preparedAssets = [];

  if ( ! Array.isArray(config.assets) ) config.assets = [ config.assets ];

  config.globalIgnore = '!{**/_*,**/_*/**}'; // Exclude everything starting with _

  config.assets.forEach( function(asset) {

    if ( asset.name ) asset.name = slug( asset.name );
    else asset.name = 'app'+( index++ == 1 ? '' : index );

    asset.folder = setDefault.value( asset.folder, './' );

    /*---------------------------------------------
     *
     * CSS
     *
     */

    if ( asset.css ) {

      if ( typeof asset.css === 'boolean' ) asset.css = {};

      asset.css = setDefault.props( asset.css, {
        slug: asset.name || 'style',
        folder: path.join(asset.folder, 'css')
      });

      asset.css = setDefault.props( asset.css, {
        src: path.join(asset.css.folder, 'src'),
        dest: asset.css.folder,
        sass: true,
        entry: 'index',
        autoprefix: true,
        clean: true
      });

      if ( asset.css.files ) {
        asset.css.concat = true;
        asset.css.files = setDefault.array( asset.css.files, [] );
      } else {
        asset.css.concat = false;
        asset.css.files = [];
      }
      asset.css.files.push(
        path.join(asset.css.dest, asset.css.slug+'.css'),
        config.globalIgnore
      );

      if ( asset.css.sass ) {
        asset.css.sass = setDefault.props( asset.css.sass, {
          errLogToConsole: true,
        });
        asset.css.extension = setDefault.value( asset.css.extension, '.scss' );
      } else {
        asset.css.extension = setDefault.value( asset.css.extension, '.css' );
      }

      asset.css.autoprefix = setDefault.booleanObject( asset.css.autoprefix, true, {
        browsers: ['last 2 versions', 'ie 9', '> 1%'],
        cascade: false
      });

      asset.css.watch = setDefault.booleanArray( asset.css.watch, true,
        path.join(asset.css.src, '**/*' + asset.css.extension)
      );
      if ( asset.css.watch ) asset.css.watch.push( config.globalIgnore );
    }

    /*---------------------------------------------
     *
     * JS
     *
     */

    if ( asset.js ) {

      if ( typeof asset.js === 'boolean' ) asset.js = {};

      asset.js = setDefault.props( asset.js, {
        slug: asset.name || 'script',
        folder: path.join(asset.folder, 'js')
      });

      asset.js = setDefault.props( asset.js, {
        src: path.join(asset.js.folder, 'src'),
        dest: asset.js.folder,
        browserify: true,
        entry: 'index',
        clean: true
      });

      if ( asset.js.files ) {
        asset.js.concat = true;
        asset.js.files = setDefault.array( asset.js.files, [] );
      } else {
        asset.js.concat = false;
        asset.js.files = [];
      }
      asset.js.files.push(
        path.join(asset.js.dest, asset.js.slug+'.js'),
        config.globalIgnore
      );

      asset.js.extension = asset.js.coffee ?
        setDefault.value( asset.js.extension, '.coffee' ) :
        setDefault.value( asset.js.extension, '.js' );

      asset.js.lint = setDefault.booleanArray( asset.js.lint, true,
        path.join(asset.js.src, '**/*' + asset.js.extension)
      );
      if ( asset.js.lint ) asset.js.lint.push(
        '!'+path.join(asset.js.src, 'lib/**/*'),
        config.globalIgnore
      );

      // Watch

      asset.js.watch = setDefault.booleanArray( asset.js.watch, true,
        path.join(asset.js.src, '**/*' + asset.js.extension)
      );
      if ( asset.js.watch ) asset.js.watch.push( config.globalIgnore );
    }


    /*---------------------------------------------
     *
     * Images
     *
     * TODO: implement
     *
     */

    if ( asset.images ) {

      if ( typeof asset.images === 'boolean' ) asset.images = {};

      asset.images = setDefault.props( asset.images, {
        src: asset.folder,
        dest: asset.folder,
        options: {}
      });
    }


    /*---------------------------------------------
     *
     * Zip
     *
     */

    if ( asset.zip ) {

      if ( typeof asset.zip === 'boolean' ) asset.zip = {};

      asset.zip = setDefault.props( asset.zip, {
        slug: asset.name,
        src: asset.folder,
        dest: asset.folder
      });

      asset.zip.files = setDefault.array( asset.zip.files,
        path.join(asset.zip.src, '**/**/*')
      );
      asset.zip.files.concat([
        '!**/*.zip',
        '!**/.git/**/*',
        '!**/.gitignore',
        '!**/node_modules',
        '!**/node_modules/**',
        config.globalIgnore
      ]);
    }

    preparedAssets.push( asset );

  }); // For each asset of config.assets

  config.assets = preparedAssets;

  return config;
};