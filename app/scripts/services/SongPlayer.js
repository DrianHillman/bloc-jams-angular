(function() {
  function SongPlayer(Fixtures) {
    var SongPlayer = {};

    /**
     * @desc Retrieves album data from the injected 'Fixtures' service.
     * @returns {[type]} [description]
     */
    var currentAlbum = Fixtures.getAlbum();

    /**
      * @desc Buzz object audio file
      * @type {Object}
      */
    var currentBuzzObject = null;

    /**
      * @function setSong
      * @desc Stops currently playing song and loads new audio file as currentBuzzObject.
      * @param {Object} song
      */
    var setSong = function(song){
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      SongPlayer.currentSong = song;
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
     * @function getSongIndex
     * @desc Inspects the album data to retrieve the index of a song.
     * @param   {Object} song   is an element within the album data
     * @returns {Integer}       the index of the song
     */
    var getSongIndex = function(song){
      return currentAlbum.songs.indexOf(song);
    };

    /**
     * @desc The selected song object from the data.
     * @type {Object}
     */
    SongPlayer.currentSong = null;

    /**
     * @function SongPlayer.play
     * @desc This public method plays the selected song.
     * @param   {Object} song  is a song from data
     */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (currentBuzzObject !== song){
        setSong(song);
        playSong(song);

      }else if (SongPlayer.currentSong === song) {
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
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
     * @function SongPlayer.previous
     * @desc This public method changes the player to the previous song
     * @returns {[type]} [description]
     */
    SongPlayer.previous = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();
