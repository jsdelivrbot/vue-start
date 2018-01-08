const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const tg = new Telegram.Telegram('471562304:AAEbH3GBmibD1TXUxHtL6g9m9827Bhlt0z4');


class PingController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  static pingHandler($) {
    $.sendMessage('pong')
  }

  get routes() {
    return {
      'pingCommand': 'pingHandler'
    }
  }
}
class StartController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  static startHandler($) {
    $.sendMessage('You are started!')
  }

  get routes() {
    return {
      'startCommand': 'startHandler'
    }
  }
}


tg.router
  .when(new TextCommand('ping', 'pingCommand'), new PingController())
  .when(new TextCommand('/start', 'startCommand'), new StartController())
  // .when(new TextCommand('/stop', 'stopCommand'), new StopController())
  // .when(new TextCommand('/restart', 'restartCommand'), new RestartController())
