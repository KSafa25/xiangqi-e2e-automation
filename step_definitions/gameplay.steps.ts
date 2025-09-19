import { Given, When, Then } from '@cucumber/cucumber';
import { GameplayPage } from '../page_objects/GamePlayPage';
import { ICustomWorld } from '../hooks/hooks';

const usernameA = 'Mahdeed01'
const usernameB = 'Mahdeed03'
const password = 'Pakistan@05'
const moveTime = '1'
const gameTime = '3'
const message = 'Hello, this is me!'
const mention = 'Hello, @Mahdeed01'

Given('Both players are logged in', async function (this: ICustomWorld) {
  if (this.context) {
    await this.context.close(); 
  }
  this.context = await this.browser.newContext({ storageState: 'auth-player1.json' });
  const player1Page = await this.context.newPage();
  this.pages.player1Page = player1Page;
  this.gameplay1 = new GameplayPage(player1Page);

  // Player 2 — still create a separate isolated context
  const player2Context = await this.browser.newContext({ storageState: 'auth-player2.json' });
  const player2Page = await player2Context.newPage();
  this.pages.player2Page = player2Page;
  this.contexts = { player1Context: this.context, player2Context };
  this.gameplay2 = new GameplayPage(player2Page);

  await Promise.all([
    this.gameplay1.goToPlayPage(),
    this.gameplay2.goToPlayPage(),
  ]);
});

When('Both join game', async function (this: ICustomWorld) {
  await this.gameplay1!.clickCreateGameButton();
  const gameURL = await this.gameplay1!.createGame(moveTime, gameTime);
  await Promise.all([
    this.gameplay2!.joinGame(gameURL),
  ]);
});

Then('Both play game', async function (this: ICustomWorld) {
  await this.gameplay1!.checkGamePage();
  await this.gameplay2!.checkGamePage();
  await this.gameplay1!.movePiece('cannon','red',1,'3','e');
  await this.gameplay2!.movePiece('cannon','brown',1,'3','g');
  await this.gameplay1!.movePiece('cannon','red',1,'7','e');
  await this.gameplay2!.movePiece('horse','brown',1,'3','i');
  await this.gameplay1!.movePiece('cannon','red',1,'6','b');
  await this.gameplay2!.movePiece('pawn','brown',0,'5','a');
});

When('PlayerA checkmates PlayerB', async function (this: ICustomWorld) {
  await this.gameplay1!.movePiece('cannon','red',1,'6','e');
})

Then('Checkmate modal should appear', async function (this: ICustomWorld) {
  await this.gameplay1!.checkCheckmate();
  await this.gameplay2!.checkCheckmate();
  if(this.context){

  }
})

When('PlayerB abandons the game', async function (this: ICustomWorld) {
  await this.gameplay1!.checkGamePage();
  await this.gameplay2!.checkGamePage();
  await this.gameplay2!.abandonGame();
});

Then('Abandon modal should appear', async function (this: ICustomWorld) {
  await this.gameplay1!.checkAbandonedGame();
  await this.gameplay2!.checkAbandonedGame();
});

When('PlayerA resigns the game', async function (this: ICustomWorld) {
  await this.gameplay1!.resignGame();
});

Then('Resign modal should appear', async function (this: ICustomWorld) {
  await this.gameplay1!.checkResignedGame();
  await this.gameplay2!.checkResignedGame();
})

When('PlayerB makes an undo request', async function (this: ICustomWorld) {
  await this.gameplay2!.clickUndo('Black');
})

When('PlayerA accepts the undo request', async function (this: ICustomWorld) {
  await this.gameplay1!.acceptRequest('Red', 'undo');
})

Then('Last move must be undone', async function (this: ICustomWorld) {
  await this.gameplay2!.checkUndoneMove('5','a');
  await this.gameplay1!.resignGame();
})

When('PlayerA rejects the undo request', async function (this: ICustomWorld) {
  await this.gameplay1!.rejectRequest('Red', 'undo');
})

Then('Last move must not be undone', async function (this: ICustomWorld) {
  await this.gameplay2!.checkNotUndoneMove('5','a');
  await this.gameplay1!.resignGame();
})

When('PlayerA disables the undo request', async function (this: ICustomWorld) {
  await this.gameplay1!.disableRequest('Red', 'undo');
})

Then('Undo button should be disabled', async function (this: ICustomWorld) {
  await this.gameplay2!.checkNotUndoneMove('5','a');
  await this.gameplay1!.checkDisabledUndo();
  await this.gameplay2!.checkDisabledUndo();
  await this.gameplay1!.resignGame();
})

When('PlayerB makes a draw request', async function (this: ICustomWorld) {
  await this.gameplay2!.clickDraw('Black');
})

When('PlayerA accepts the draw request', async function (this: ICustomWorld) {
  await this.gameplay1!.acceptRequest('Red', 'draw');
})

Then('Game should be drawn', async function (this: ICustomWorld) {
  await this.gameplay1!.checkDrawnGame();
  await this.gameplay2!.checkDrawnGame();
})

When('PlayerA rejects the draw request', async function (this: ICustomWorld) {
  await this.gameplay1!.rejectRequest('Red', 'draw');
})

Then('Game should not be drawn', async function (this: ICustomWorld) {
  await this.gameplay1!.checkNotDrawnGame();
  await this.gameplay2!.checkNotDrawnGame();
  await this.gameplay1!.resignGame();
})

When('PlayerA disables the draw request', async function (this: ICustomWorld) {
  await this.gameplay1!.disableRequest('Red', 'draw');
})

Then('Draw button should be disabled', async function (this: ICustomWorld) {
  await this.gameplay1!.checkNotDrawnGame();
  await this.gameplay2!.checkNotDrawnGame();
  await this.gameplay1!.checkDisabledDraw();
  await this.gameplay2!.checkDisabledDraw();
  await this.gameplay1!.resignGame();
})

When('PlayerAs move timer expires', { timeout: 5 * 60 * 1000 }, async function (this: ICustomWorld) {
  await this.gameplay1!.letMoveTimerExpire(moveTime);
})

Then('Game should end with timer expired', async function (this: ICustomWorld) {
  await this.gameplay1!.checkTimerExpiredGame();
  await this.gameplay2!.checkTimerExpiredGame();
})

When('PlayerA flips the board', async function (this: ICustomWorld) {
  await this.gameplay1!.flipBoard();
})

Then('Board should be flipped for playerA', async function (this: ICustomWorld) {
  await this.gameplay1!.checkFlippedBoard('red');
  await this.gameplay1!.abandonGame();
})

let beforeTimer = "";
When('PlayerA requests for an extra min', async function (this: ICustomWorld) {
  beforeTimer = await this.gameplay1!.clickTime('Red');
})

When('PlayerB accepts the request', async function (this: ICustomWorld) {
  await this.gameplay2!.acceptRequest('Black', 'extra time');
})

Then('Extra min should be added to the timers', async function (this: ICustomWorld) {
  await this.gameplay1!.checkExtraMinAdded(beforeTimer);
  await this.gameplay1!.resignGame();
})

When('PlayerA types a message', async function (this: ICustomWorld) {
  await this.gameplay1!.typeMessage(message);
});

Then('PlayerB sees that PlayerA is typing', async function (this: ICustomWorld) {
  await this.gameplay2!.checkIfTyping();
});

When('PlayerA sends the message', async function (this: ICustomWorld) {
  await this.gameplay1!.sendMessage();
});

Then('PlayerB sees the message in game chat', async function (this: ICustomWorld) {
  await this.gameplay2!.checkReceivedMessage(message);    
});

When('PlayerB mentions PlayerA', async function (this: ICustomWorld) {
  await this.gameplay2!.typeMessage(mention);
  await this.gameplay2!.sendMessage();
});

Then('PlayerA sees their mention in game chat', async function (this: ICustomWorld) {
  await this.gameplay1!.checkReceivedMessage(mention);
});

When('PlayerB clicks on the mention', async function (this: ICustomWorld) {
  await this.gameplay2!.clickOnMention(mention);
});

Then('PlayerB is navigated to PlayerA\'s profile', async function (this: ICustomWorld) {
   await this.gameplay2!.checkNavigationToProfile();
});

       