// SINTAXE JQUERY
// HIDE = OCULTAR A DIV
// APPEND() CRIA NOVAS DIV's DENTRO DA DIV BGGAME
// FUNÇÃO START É ACIONADA:
// 1 - DIV BEGIN É OCULTADA;
// 2 - SÃO CRIADAS NOVAS DIV's DENTRO DA DIV BGGAME

function start() {
  $('#begin').hide()

  $('#BGGame').append("<div id ='player' class='animation1'></div>")
  $('#BGGame').append("<div id='enemy1' class='animation2'></div>")
  $('#BGGame').append("<div id ='enemy2'></div>")
  $('#BGGame').append("<div id='friend' class='animation3'></div>")
  $('#BGGame').append("<div id='score'></div>")
  $('#BGGame').append('<div id="energy"></div>')

  // GAME LOOP
  // POSIÇÃO RANDOMICA DO INIMIGO 1 ENTRE 0 ATÉ O 334px
  let positionY = parseInt(Math.random() * 334)
  let endGame = false
  var currentEnergy = 3
  let velo = 5
  let game = {}
  let canShot = true
  let points = 0
  let saves = 0
  let lost = 0

  // ATRIBUIÇÃO DOS ÁUDIOS ÀS VARIÁVEIS

  let soundBlast = document.getElementById('soundBlast')
  var soundGameOver = document.getElementById('gameOver')
  let soundBGMusic = document.getElementById('bgMusic')
  let soundLost = document.getElementById('lost')
  let soundRescue = document.getElementById('rescue')
  let soundShot = document.getElementById('soundShot')
  // TECLAS, VALORES DECIMAIS
  let keys = {
    W: 38,
    S: 40,
    D: 68
  }

  game.press = []

  // MÚSICA EM LOOP
  soundBGMusic.addEventListener(
    'ended',
    function () {
      soundBGMusic.currentTime = 0
      soundBGMusic.play()
    },
    false
  )
  soundBGMusic.play()

  // INVOCA UM TEMPORIZADOR COM A FUNÇÃO LOOP, EXECUTADA A CADA 30mSeg
  game.timer = setInterval(loop, 30)

  function loop() {
    moveBG()
    movePlayer()
    moveEnemy1()
    moveEnemy2()
    moveFriend()
    collision()
    score()
    energy()
  }

  // VERIFICA SE O USUÁRIO PRESSIONOU ALGUMA TECLA
  // KEYDOWN = PRESSIONADA

  $(document).keydown(function (e) {
    game.press[e.which] = true
  })

  // KEYUP = NÃO PRESSIONADA

  $(document).keyup(function (e) {
    game.press[e.which] = false
  })

  // MOVIMENTA O BACKGROUND
  // PARSEINT CONVERTE UMA STRING EM UM NÚMERO INTEIRO
  function moveBG() {
    left = parseInt($('#BGGame').css('background-position'))
    $('#BGGame').css('background-position', left - 1)
  }

  // MOVIMENTA O PLAYER

  function movePlayer() {
    if (game.press[keys.W]) {
      let upPlayer = parseInt($('#player').css('top'))
      $('#player').css('top', upPlayer - 10)

      if (upPlayer <= 0) {
        $('#player').css('top', upPlayer + 10)
      }
    }

    if (game.press[keys.S]) {
      let downPlayer = parseInt($('#player').css('top'))
      $('#player').css('top', downPlayer + 10)

      if (downPlayer >= 434) {
        $('#player').css('top', downPlayer - 10)
      }
    }

    if (game.press[keys.D]) {
      shot()
    }
  }

  // MOVIMENTA INIMIGO1 - HELICÓPTERO

  function moveEnemy1() {
    positionX = parseInt($('#enemy1').css('left'))
    $('#enemy1').css('left', positionX - velo)
    $('#enemy1').css('top', positionY)

    if (positionX <= 0) {
      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }
  }

  // MOVIMENTA INIMIGO2 - CAMINHÃO

  function moveEnemy2() {
    positionX = parseInt($('#enemy2').css('left'))
    $('#enemy2').css('left', positionX - 1.2)

    if (positionX <= 0) {
      $('#enemy2').css('left', 775)
    }
  }

  // MOVIMENTA AMIGO

  function moveFriend() {
    positionX = parseInt($('#friend').css('left'))
    $('#friend').css('left', positionX + 2)

    if (positionX > 906) {
      $('#friend').css('left', 0)
    }
  }

  // DISPAROS

  function shot() {
    if (canShot == true) {
      canShot = false
      soundShot.play()
      // ONDE ESTÁ POSICIONADO O JOGADOR
      topo = parseInt($('#player').css('top'))
      positionX = parseInt($('#player').css('left'))

      // PARA QUE O TIRO SAIA NA FRENTE DO JOGADOR
      tiroX = positionX + 190
      topShot = topo + 37

      // CRIANDO A DIV DISPARO
      $('#BGGame').append("<div id='shot'></div>")
      // POSICIONANDO A DIV DISPARODD
      $('#shot').css('top', topShot)
      $('#shot').css('left', tiroX)

      var timeShot = window.setInterval(runShot, 30)
    }
    function runShot() {
      // POSIÇÃO INICIAL DO DISPARO E ACRESCENTANDO 15px a cada 30mili Segundos
      positionX = parseInt($('#shot').css('left'))
      $('#shot').css('left', positionX + 15)

      if (positionX > 900) {
        window.clearInterval(timeShot)
        timeShot = null
        // APÓS O DISPARO SER EXCLUÍDO, PODERÁ ATIRAR NOVAMENTE
        $('#shot').remove()
        canShot = true
      }
    }
  }

  // COLISÃO - JQUERY COLLISION - COLISÃO DE DIV's
  // COLISÃO DO JOGADOR COM O INIMIGO1 - HELICÓPTERO
  function collision() {
    let collision1 = $('#player').collision($('#enemy1'))
    let collision2 = $('#player').collision($('#enemy2'))
    let collision3 = $('#shot').collision($('#enemy1'))
    let collision4 = $('#shot').collision($('#enemy2'))
    let collision5 = $('#player').collision($('#friend'))
    let collision6 = $('#enemy2').collision($('#friend'))
    // SE A VARIÁVEL ESTIVER PREENCHIDA, REPOSICIONARÁ OS RESPECTIVOS ELEMENTOS
    if (collision1.length > 0) {
      currentEnergy--
      // IDENTIFICADO A POSIÇÃO ATUAL DO HELICÓPTERO INIMIGO
      enemy1X = parseInt($('#enemy1').css('left'))
      enemy1Y = parseInt($('#enemy1').css('top'))

      // INVOCAR A FUNÇÃO EXPLOSÃO COM OS PARÂMETROS DO INIMIGO HELICÓPTERO
      blast1(enemy1X, enemy1Y)

      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }

    // VALIDA COLISÃO - JOGADOR CONTRA O CAMINHÃO
    if (collision2.length > 0) {
      currentEnergy--
      // IDENTIFICADO A POSIÇÃO ATUAL DO CAMINHÃO INIMIGO
      enemy2X = parseInt($('#enemy2').css('left'))
      enemy2Y = parseInt($('#enemy2').css('top'))
      // INVOCA FUNÇÃO EXPLOSÃO COM OS PARÂMETROS DO CAMINHÃO INIMIGO
      blast2(enemy2X, enemy2Y)

      // REMOVER CAMINHÃO DA DIV
      $('#enemy2').remove()

      //FUNÇÃO PARA REPOSICIONAR CAMINHÃO INIMIGO
      replaceEnemy2()
    }

    // VALIDA COLISÃO - DISPARO CONTRA INIMIGO1 HELICÓPTERO
    if (collision3.length > 0) {
      points = points + 100
      // AUMENTANDO A DIFICULDADE DO GAME
      velo = velo + 0.2
      enemy1X = parseInt($('#enemy1').css('left'))
      enemy1Y = parseInt($('#enemy1').css('top'))

      // REPOSICIONANDO O DISPARO - FUNÇÃO DISPARO HÁ CONDICIONAL SE DISPARO > 900 É REMOVIDO PARA QUE O TIRO NÃO CONTINUE MESMO QUE TENHA COLIDIDO CONTRA O INIMIGO
      blast1(enemy1X, enemy1Y)
      $('#shot').css('left', 950)

      positionY = parseInt(Math.random() * 334)
      $('#enemy1').css('left', 694)
      $('#enemy1').css('top', positionY)
    }

    // VALIDA COLISÃO - DISPARO CONTRA CAMINHÃO INIMIGO

    if (collision4.length > 0) {
      points = points + 50
      enemy2X = parseInt($('#enemy2').css('left'))
      enemy2Y = parseInt($('#enemy2').css('top'))

      blast2(enemy2X, enemy2Y)
      $('#shot').css('left', 950)

      $('#enemy2').remove()

      replaceEnemy2()
    }

    // VALIDA COLISÃO - JOGADOR E AMIGO - SALVAR
    if (collision5.length > 0) {
      soundRescue.play()
      saves++
      replaceFriend()
      $('#friend').remove()
    }

    // VALIDA COLISÃO - CAMINHÃO CONTRA AMIGO
    if (collision6.length > 0) {
      lost++
      friendX = parseInt($('#friend').css('left'))
      friendY = parseInt($('#friend').css('top'))
      blast3(friendX, friendY)
      $('#friend').remove()

      replaceFriend()
    }
  }

  // EXPLOSÃO CONTRA O HELICÓPTERO INIMIGO

  function blast1(enemy1X, enemy1Y) {
    // CRIAÇÃO DA DIV EXPLOSÃO
    $('#BGGame').append("<div id='blast1'></div>")
    $('#blast1').css('background-image', 'url(../../_assets/imgs/explosao.png)')
    soundBlast.play()
    // ATRIBUIÇÃO DA DIV EXPLOSÃO EM UMA VÁRIAVEL
    let div = $('#blast1')
    div.css('top', enemy1Y)
    div.css('left', enemy1X)
    // MÉTODO DO JQUERY ANIMAÇÃO - DIV EXPLOSÃO VAI ATÉ WIDTH 200 E SOME
    div.animate({ width: 200, opacity: 0 }, 'slow')

    // CRIANDO UM TEMPORIZADOR PARA FINALIZAR A DIV
    let timeBlast = window.setInterval(removeBlast, 1000)

    function removeBlast() {
      div.remove()
      window.clearInterval(timeBlast)
      timeBlast = null
    }
  }

  // EXPLOSÃO CONTA O CAMINHÃO INIMIGO

  function blast2(enemy2X, enemy2Y) {
    $('#BGGame').append('<div id="blast2"></div>')
    $('#blast2').css('background-image', 'url(../../_assets/imgs/explosao.png)')
    soundBlast.play()
    let div = $('#blast2')
    div.css('top', enemy2Y)
    div.css('left', enemy2X)
    div.animate({ width: 200, opacity: 0 }, 'slow')

    let timeBlast2 = window.setInterval(removeBlast2, 1000)

    function removeBlast2() {
      div.remove()
      window.clearInterval(timeBlast2)
      timeBlast2 = null
    }
  }

  // MORTE DO AMIGO COLISÃO CONTRA CAMINHÃO
  function blast3(friendX, friendY) {
    $('#BGGame').append('<div id="blast3" class="animation4"></div>')
    soundLost.play()
    $('#blast3').css('top', friendY)
    $('#blast3').css('left', friendX)
    var timeBlast3 = window.setInterval(resetBlast3, 1000)

    function resetBlast3() {
      $('#blast3').remove()
      window.clearInterval(timeBlast3)
      timeBlast3 = null
    }
  }

  // REPOSICIONAR O CAMINHÃO INIMIGO
  // TEMPO PARA QUE NÃO SEJA IMEDIATAMENTE REPOSICIONADO - 4s
  function replaceEnemy2() {
    var timeCollision4 = window.setInterval(replace4, 4000)
    // FUNÇÃO SERÁ EXECUTADA APÓS 5s
    function replace4() {
      window.clearInterval(timeCollision4)
      timeCollision4 = null

      // SÓ SERÁ RECRIADA A DIV COM O CAMINHÃO ASSIM QUE A CONDICIONAL FIM DO JOGO FOR FALSA
      if (endGame == false) {
        $('#BGGame').append('<div id="enemy2"></div>')
      }
    }
  }

  // REPOSICIONAR AMIGO

  function replaceFriend() {
    var timeFriend = window.setInterval(replace6, 8000)

    function replace6() {
      window.clearInterval(timeFriend)
      timeFriend = null

      if (endGame == false) {
        $('#BGGame').append('<div id="friend" class="animation3"></div>')
      }
    }
  }

  function score() {
    $('#score').html(
      '<h2>   Pontos = ' +
        points +
        '  <br>   Salvos =    ' +
        saves +
        '  <br>   Perdidos =   ' +
        lost +
        '</h2>'
    )
  }

  // FUNÇÃO PARA ANALISAR BARRA DE ENERGIA

  function energy() {
    if (currentEnergy == 3) {
      $('#energy').css(
        'background-image',
        'url(../../_assets/imgs/energia3.png)'
      )
    }
    if (currentEnergy == 2) {
      $('#energy').css(
        'background-image',
        'url(../../_assets/imgs/energia2.png)'
      )
    }
    if (currentEnergy == 1) {
      $('#energy').css(
        'background-image',
        'url(../../_assets/imgs/energia1.png)'
      )
    }
    if (currentEnergy == 0) {
      $('#energy').css(
        'background-image',
        'url(../../_assets/imgs/energia0.png)'
      )
      gameOver()
    }
  }

  function gameOver() {
    endGame = true
    soundBGMusic.pause()
    soundGameOver.play()

    window.clearInterval(game.timer)
    game.timer = null

    $('#player').remove()
    $('#enemy1').remove()
    $('#enemy2').remove()
    $('#friend').remove()

    $('#BGGame').append("<div id='end'></div>")

    $('#end').html(
      '<h1> Game Over</h1> <p>Sua pontuação: ' +
        points +
        '</p>' +
        "<div id='restart'><button class='restartGame' id='restartGame' onclick=restartGame()><span>Jogar Novamente</span></button></div>"
    )
  }
}
function restartGame() {
  var soundGameOver = document.getElementById('gameOver')
  soundGameOver.pause()
  $('#end').remove()
  start()
}

// switch (currentEnergy) {
//   case 1:
//     currentEnergy == 3
//     $('#energy').css(
//       'background-image',
//       'url(../../_assets/imgs/energia3.png)'
//     )
//     break
//   case 2:
//     currentEnergy == 2
//     $('#energy').css(
//       'background-image',
//       'url(../../_assets/imgs/energia2.png)'
//     )
//     break
//   case 3:
//     currentEnergy == 1
//     $('#energy').css(
//       'background-image',
//       url('../../_assets/imgs/energia1.png')
//     )
//     break
//   default:
//     currentEnergy == 0
//     $('#energy').css(
//       'background-image',
//       url('../../_assets/imgs/energia0.png')
//     )
