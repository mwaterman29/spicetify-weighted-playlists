# Weighted Playlists

[Spicetify](https://spicetify.app/) extension to allow for a weighted shuffle. You can enable playlists to be weighted and the songs will play corresponding to their weight.



## USAGE NOTE!

I absolutely cannot stand the new Spotify update. The navigation is horrible and I truly find it to be unusable. Consequently, I won't be maintaining the extension for later versions than 1.2.5.1006.

You can download that version here:

https://spotify.en.uptodown.com/windows/download/91111320

Additionally, no guarantee that it works with any Spicetify version later than 2.18.1, though it should work with newer versions.

I recommend a manual install.



## Install

Available from the [Spicetify Marketplace](https://github.com/CharlieS1103/spicetify-marketplace) or via direct install:

Download `weighted-playlists.js` into your Spicetify extensions folder.

Then run:

```powershell
spicetify config extensions weighted-playlists.js
spicetify apply
```

## Usage Details

The extension will add a switch to all your playlists, which when toggled on will enable weighted shuffle for the playlist.

![](https://i.gyazo.com/227878387dd6778ded74f64e51c2b623.png)

Each song will get a button that displays it's weight

![](https://i.gyazo.com/ff52c43368b7c62367a03c96b3a697d0.png)

You can click this button to enable a slider, and change weights accordingly.

![](https://i.gyazo.com/311bdc309533e8df9b97e44ba54e244a.png)

You can set the minimum and maximum weight in the settings.

![img](https://i.gyazo.com/d234fb87d30c6ebba9ddd35d09405e57.png)

You can import and export weights via the clipboard.

![img](https://i.gyazo.com/0dd8bdda798fae0be46b935e61bb6487.png)

### Usage Notes

- Don't set minimum or maximum weight to be too extreme.
- Weight sliders will only appear when sorted by the default Custom Order.
- If you find any issues, please report them on the [issues page.](https://github.com/mwaterman29/spicetify-weighted-playlists/issues/new/choose)



### Upcoming Features

- The shuffle uses the queue system to choose its next song. It generally respects the queue, but playlist changes may eat an item out of the queue or extraneously add one to the queue. This should rarely occur, but will still be addressed in future updates
- Playlist Export: Generating an unweighted playlist from a weighted one for use with the default shuffle.
- UI Enhancements (improved design, draggable popup, etc)



## Credits

Made with Spicetify Creator

- https://github.com/FlafyDev/spicetify-creator

This extension borrows code and knowledge from other extension developers. Check them out!

https://github.com/CharlieS1103/spicetify-extensions/blob/main/fixEnhance/fixEnhance.js

https://github.com/CharlieS1103/spicetify-extensions/blob/main/featureshuffle/featureshuffle.js

https://github.com/daksh2k/Spicetify-stuff/blob/master/Extensions/playNext.js

https://github.com/theRealPadster/spicetify-hide-podcasts/blob/be1d7b6a7a116fc8ce4cd9b1e75d4a88d15c64c7/hidePodcasts.js

Additionally, many of the default extensions had useful code blocks:

https://github.com/khanhas/spicetify-cli/blob/master/Extensions/loopyLoop.js

https://github.com/khanhas/spicetify-cli/blob/master/Extensions/shuffle%2B.js

https://github.com/khanhas/spicetify-cli/blob/master/Extensions/popupLyrics.js

https://github.com/khanhas/spicetify-cli/blob/master/Extensions/webnowplaying.js

https://github.com/khanhas/spicetify-cli/blob/master/Extensions/fullAppDisplay.js