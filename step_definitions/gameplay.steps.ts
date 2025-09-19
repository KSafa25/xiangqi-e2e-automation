import { Given, When, Then } from '@cucumber/cucumber';
import { GameplayPage } from '../page_objects/GamePlayPage';
import { ICustomWorld } from '../hooks/hooks';

const moveTime = '1'
const gameTime = '3'
const message = 'Hello, this is me!'
const mention = 'Hello, @Mahdeed01'

Given('Both players are logged in', async function (this: ICustomWorld) {

  // Player 1 context from auth/user.json
  //this.context = await this.browser.newContext({ storageState: 'auth/user.json' });
  const { GamePlayPage } = this.pages;

  // Player 2 context from auth/auth-player2.json
  const player2Context = await this.browser.newContext({ storageState: 'auth/auth-player2.json' });
  const player2Page = await player2Context.newPage();
  this.pages.player2Page = player2Page;
  this.gameplay2 = new GameplayPage(player2Page);

  // Save both contexts so After hook can close them
  this.contexts = { player1Context: this.context, player2Context };

  // Navigate both players to the play page
  await Promise.all([
    GamePlayPage.goToPlayPage(),
    this.gameplay2.goToPlayPage(),
  ]);
});

When('Both join game', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.clickCreateGameButton();
  const gameURL = await GamePlayPage.createGame(moveTime, gameTime);
  await Promise.all([
    this.gameplay2!.joinGame(gameURL),
  ]);
});

Then('Both play game', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkGamePage();
  await this.gameplay2!.checkGamePage();
  await GamePlayPage.movePiece('cannon','red',1,'3','e');
  await this.gameplay2!.movePiece('cannon','brown',1,'3','g');
  await GamePlayPage.movePiece('cannon','red',1,'7','e');
  await this.gameplay2!.movePiece('horse','brown',1,'3','i');
  await GamePlayPage.movePiece('cannon','red',1,'6','b');
  await this.gameplay2!.movePiece('pawn','brown',0,'5','a');
});

When('PlayerA checkmates PlayerB', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.movePiece('cannon','red',1,'6','e');
})

Then('Checkmate modal should appear', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkCheckmate();
  await this.gameplay2!.checkCheckmate();
  if(this.context){

  }
})

When('PlayerB abandons the game', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkGamePage();
  await this.gameplay2!.checkGamePage();
  await this.gameplay2!.abandonGame();
});

Then('Abandon modal should appear', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkAbandonedGame();
  await this.gameplay2!.checkAbandonedGame();
});

When('PlayerA resigns the game', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.resignGame();
});

Then('Resign modal should appear', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkResignedGame();
  await this.gameplay2!.checkResignedGame();
})

When('PlayerB makes an undo request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await this.gameplay2!.clickUndo('Black');
})

When('PlayerA accepts the undo request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.acceptRequest('Red', 'undo');
})

Then('Last move must be undone', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await this.gameplay2!.checkUndoneMove('5','a');
  await GamePlayPage.resignGame();
})

When('PlayerA rejects the undo request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.rejectRequest('Red', 'undo');
})

Then('Last move must not be undone', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await this.gameplay2!.checkNotUndoneMove('5','a');
  await GamePlayPage.resignGame();
})

When('PlayerA disables the undo request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.disableRequest('Red', 'undo');
})

Then('Undo button should be disabled', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await this.gameplay2!.checkNotUndoneMove('5','a');
  await GamePlayPage.checkDisabledUndo();
  await this.gameplay2!.checkDisabledUndo();
  await GamePlayPage.resignGame();
})

When('PlayerB makes a draw request', async function (this: ICustomWorld) {
  await this.gameplay2!.clickDraw('Black');
})

When('PlayerA accepts the draw request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.acceptRequest('Red', 'draw');
})

Then('Game should be drawn', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkDrawnGame();
  await this.gameplay2!.checkDrawnGame();
})

When('PlayerA rejects the draw request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.rejectRequest('Red', 'draw');
})

Then('Game should not be drawn', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkNotDrawnGame();
  await this.gameplay2!.checkNotDrawnGame();
  await GamePlayPage.resignGame();
})

When('PlayerA disables the draw request', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.disableRequest('Red', 'draw');
})

Then('Draw button should be disabled', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkNotDrawnGame();
  await this.gameplay2!.checkNotDrawnGame();
  await GamePlayPage.checkDisabledDraw();
  await this.gameplay2!.checkDisabledDraw();
  await GamePlayPage.resignGame();
})

When('PlayerAs move timer expires', { timeout: 5 * 60 * 1000 }, async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.letMoveTimerExpire(moveTime);
})

Then('Game should end with timer expired', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkTimerExpiredGame();
  await this.gameplay2!.checkTimerExpiredGame();
})

When('PlayerA flips the board', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.flipBoard();
})

Then('Board should be flipped for playerA', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkFlippedBoard('red');
  await GamePlayPage.abandonGame();
})

let beforeTimer = "";
When('PlayerA requests for an extra min', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  beforeTimer = await GamePlayPage.clickTime('Red');
})

When('PlayerB accepts the request', async function (this: ICustomWorld) {
  await this.gameplay2!.acceptRequest('Black', 'extra time');
})

Then('Extra min should be added to the timers', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkExtraMinAdded(beforeTimer);
  await GamePlayPage.resignGame();
})

When('PlayerA types a message', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.typeMessage(message);
});

Then('PlayerB sees that PlayerA is typing', async function (this: ICustomWorld) {
  await this.gameplay2!.checkIfTyping();
});

When('PlayerA sends the message', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.sendMessage();
});

Then('PlayerB sees the message in game chat', async function (this: ICustomWorld) {
  await this.gameplay2!.checkReceivedMessage(message);    
});

When('PlayerB mentions PlayerA', async function (this: ICustomWorld) {
  await this.gameplay2!.typeMessage(mention);
  await this.gameplay2!.sendMessage();
});

Then('PlayerA sees their mention in game chat', async function (this: ICustomWorld) {
  const { GamePlayPage } = this.pages;
  await GamePlayPage.checkReceivedMessage(mention);
});

When('PlayerB clicks on the mention', async function (this: ICustomWorld) {
  await this.gameplay2!.clickOnMention(mention);
});

Then('PlayerB is navigated to PlayerA\'s profile', async function (this: ICustomWorld) {
   await this.gameplay2!.checkNavigationToProfile();
});

       