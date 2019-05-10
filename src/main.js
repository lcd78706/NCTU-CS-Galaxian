
import Game from 'game'
import ImageStorage from 'imageStorage'
import SoundStorage from 'soundStorage'
import 'assets/stylesheets/index.scss'

let game = new Game()
let imageStorage = new ImageStorage()
let soundStorage = new SoundStorage()
let startButton = document.getElementById('start')
let scoreElement = document.getElementById('score')
let restartElement = document.getElementById('game-over')

// 確認圖片和音效都載入完成
let checkLoading = window.setInterval(() => {
  if (imageStorage.finishLoading() && soundStorage.finishLoading()) {
    window.clearInterval(checkLoading)

    // game初始完才開始
    if (game.init()) {
      document.getElementById('init').style.height = `${window.innerHeight}px`
    }
  }
}, 100)

// handle click event
startButton.addEventListener('click', () => {
  // 把player_id存在cookie
  let pid = document.getElementById('pid').value
  window.setCookie('pid', pid)

  document.getElementById('init').style.display = 'none'
  game.introduce()
})
restartElement.addEventListener('click', game.restart)

// 幫psuedo element加入style setter
let UID = {
  _current: 0,
  getNew: function () {
    this._current++
    return this._current
  }
}
HTMLElement.prototype.pseudoStyle = function (element, prop, value) {
  let _this = this
  let _sheetId = 'pseudoStyles'
  let _head = document.head || document.getElementsByTagName('head')[0]
  let _sheet = document.getElementById(_sheetId) || document.createElement('style')
  _sheet.id = _sheetId
  let className = 'pseudoStyle' + UID.getNew()

  _this.className += ' ' + className

  _sheet.innerHTML += ' .' + className + ':' + element + '{' + prop + ':' + value + '}'
  _head.appendChild(_sheet)
  return this
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

// global get cookie method
window.getCookie = function (name) {
  let match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  if (match) return match[2]
}

// global set cookie method
window.setCookie = function (name, value) {
  document.cookie = name + "=" + escape(value)
}

export { game, imageStorage, soundStorage }
