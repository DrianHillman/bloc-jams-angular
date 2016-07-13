(function() {
  function SongPlayer() {
    var SongPlayer = {};

    /**
     * @desc The selected song object from the data
     * @type {Object}
     */
    var currentSong = null;

    /**
      * @desc Buzz object audio file
      * @type {Object}
      */
    var currentBuzzObject = null;

    /**
      * @function setSong
      * @desc Stops currently playing song and loads new audio file as currentBuzzObject
      * @param {Object} song
      */
    var setSong = function(song){
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
    };

    /**
     * @function playSong
     * @desc Plays the selected audio file. This function also sets the Angular state property 'playing', which is attached to the song, accordingly.
     */
    var playSong = function(song){
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
     * @function SongPlayer.play
     * @desc This public method plays the selected song.
     * @param   {Object} song  is a song from data
     */
    SongPlayer.play = function(song) {
      if (currentBuzzObject !== song){
        setSong(song);
        playSong(song);

      }else if (currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          currentBuzzObject.play();
        }
      }
    };

    /**
     * @function SongPlayer.pause
     * @desc This public method pauses the selected song.
     * @param   {Object} song  is a song from data
     */
    SongPlayer.pause = function(song){
      currentBuzzObject.pause();
      song.playing = false;
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
