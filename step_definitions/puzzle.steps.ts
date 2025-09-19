import { Given, When, Then } from '@cucumber/cucumber';
import { GameplayPage } from '../page_objects/GamePlayPage';
import { ICustomWorld } from '../hooks/hooks';

Given('A logged in player navigates to puzzle page', async function (this: ICustomWorld) {
    const { puzzlePage } = this.pages;
    await puzzlePage.displaySocket();
    await puzzlePage.navigateToPuzzlePage();
});

When('Player clicks on Play Puzzle button', async function (this: ICustomWorld) {
    const { puzzlePage } = this.pages;
    await puzzlePage.clickPlayPuzzleButton();
});

Then('Puzzle is loaded', async function (this: ICustomWorld) {
    const { puzzlePage } = this.pages;
    await puzzlePage.checkPuzzlePage();
    console.log(await puzzlePage.getCurrentFen());
    const fen = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

  await puzzlePage.getBestMove(fen).then(move => {
  console.log('Best move from Pikafish:', move); // e.g. "h2e2"
});
});