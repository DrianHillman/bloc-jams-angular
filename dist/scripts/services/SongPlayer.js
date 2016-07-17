(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

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
        stopSong();
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };

    /**
     * @function playSong
     * @desc Plays the selected audio file. Sets the 'playing' Angular state property.
     * @param   {Object} song   is an element within the album data
     */
    var playSong = function(song){
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
     * @function stopSong
     * @desc Stops the current Buzz sound object.
     */
    var stopSong = function(){
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /**
     * @function getSongIndex
     * @desc Inspects the album data to retrieve the index of a song.
     * @param   {Object} song   is an element within the album data
     * @returns {Integer}       the index of the song
     */
    var getSongIndex = function(song){
      return SongPlayer.currentAlbum.songs.indexOf(song);
    };

    /**
     * @desc Retrieves album data from the injected 'Fixtures' service.
     * @type {Object}
     */
    SongPlayer.currentAlbum = Fixtures.getAlbum();

    /**
     * @desc The selected song object from the data.
     * @type {Object}
     */
    SongPlayer.currentSong = null;

    /**
     * @desc Current playback time (in seconds) of currently playing song
     * @type {Number}
     */
    SongPlayer.currentTime = null;

    /**
     * @desc Current volume setting of currently playing song
     * @type {Number}
     */
    SongPlayer.volume = 70;

    /**
     * @function SongPlayer.play
     * @desc This public method plays the selected song.
     * @param   {Object} song  is a song from data
     */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (currentBuzzObject !== song){
        setSong(song);
        SongPlayer.setVolume(SongPlayer.volume);
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
     * @desc This public method changes the player to the previous song.
     */
    SongPlayer.previous = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong();
      }else {
        var song = SongPlayer.currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
     * @function SongPlayer.next
     * @desc This public method changes the player to the next song.
     */
    SongPlayer.next = function(){
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;
      var song = SongPlayer.currentAlbum.songs[currentSongIndex];

      if (currentSongIndex >= SongPlayer.currentAlbum.songs.length) {
        song = SongPlayer.currentAlbum.songs[0];
        setSong(song);
        playSong(song);
      }else {
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    SongPlayer.setVolume = function(vol){
        if (currentBuzzObject){
          currentBuzzObject.setVolume(vol);
        }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
