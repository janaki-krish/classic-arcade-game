/* Game sounds
 * Howler  is the audio library for the modern web
 * Docs: https://github.com/goldfire/howler.js
 */


var gameMusic = new Howl({
	urls: ['sounds/Puzzle-Dreams.mp3'],
	loop: true
});

var gameOver = new Howl({
	urls: ['sounds/gong.mp3']
});

var gameSelect = new Howl({
	urls: ['sounds/achievement.mp3']
});