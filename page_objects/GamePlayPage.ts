import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';
import { link } from 'fs';

export class GameplayPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  createGameButton = () => this.page.getByText('Create Custom Game');
  gameTimer = () => this.page.locator('input[type="range"]').nth(0);
  moveTimer = () => this.page.locator('input[type="range"]').nth(2);
  playButton = () => this.page.getByRole('button', {name: 'Play'});
  continueButton = () => this.page.getByRole('button', {name: 'Continue'});
  abandonBtn = () => this.page.getByAltText('abandoned-icon');
  yesBtn = () => this.page.locator('.reply-btn').nth(0);
  redButton = () => this.page.locator('[id="0-RED"]'); 
  rightRedCanon = () => this.page.locator('img[alt="cannon-red-zh"]').nth(1);
  leftBlackCanon = () => this.page.locator('img[alt="cannon-brown-zh"]').nth(1);
  canMoveToSquare = () => this.page.locator('[class="can-move-to-square"]');
  abadonModal = () => this.page.getByRole('heading', {name: "Abandoned"});
  gameEndModal = () => this.page.locator('.ReactModal__Content');
  gameEndHeading = () => this.gameEndModal().locator('h1');
  resignButton = () => this.page.locator('li:has(span:text("Resign"))');
  undoButton = () => this.page.locator('li:has(span:text("Undo"))');
  acceptButton = () => this.page.getByText("Accept");
  rejectButton = () => this.page.getByText("Reject");
  neverButton = () => this.page.getByText("Never");
  latestMessage = () => this.page.locator('.message-body');
  drawButton = () => this.page.locator('li:has(span:text("Draw"))');
  menuButton = () => this.page.locator('li:has(span:text("Menu"))');
  flipboardButton = () => this.page.locator('.flip-board-text');
  timeButton = () => this.page.locator('li:has(span:text("Time"))');
  timer = () => this.page.locator('span.notranslate.timer-span').nth(3);
  messageInput = () => this.page.locator('input[type="text"][name="message"]');
  isTypingText = () => this.page.locator('.typing-div')
  ongoingGamesButton = () => this.page.getByText('My Ongoing Games');
  yesButton = () => this.page.getByText('Yes');
  gameTimerMap: Record<string, string> = {
    '3': '0',
    '5': '1',
    '10': '2',
    '15': '3',
    '20': '4',
    '30': '5',
    '60': '6',
  };

  moveTimerMap: Record<string, string> = {
    '1': '0',
    '2': '1',
    '5': '2',
    '10': '3',
  };
  
  // Actions

  async goToPlayPage(){
    await this.page.goto(`${BASE_URL}/play`, { timeout: 60000});
  }

  async clickCreateGameButton(){
    await this.createGameButton().click();
    await this.page.waitForTimeout(3000);
    await expect(this.page).toHaveURL(/\/custom-game/);
  }

  async createGame(moveTimer: string, gameTimer: string): Promise<string> {
    const setupGameOptions = async () => {
      if (this.gameTimerMap[gameTimer]) {
        await this.gameTimer().fill(this.gameTimerMap[gameTimer], { force: true });
      }
      if (this.moveTimerMap[moveTimer]) {
        await this.moveTimer().fill(this.moveTimerMap[moveTimer], { force: true });
      }
      await this.redButton().check();
    };
    await setupGameOptions();
    let [response] = await Promise.all([
      this.page.waitForResponse(
        res => res.url().includes('/api/v2/games/create-custom'),
        { timeout: 6000 }
      ),
      this.playButton().click()
    ]);
    if (response.status() === 200) {
      return this.page.url();
    }
    if (response.status() === 400) {
      // clean up existing ongoing game
      await this.page.goto(`${BASE_URL}/play`, {timeout: 3000});
      await this.ongoingGamesButton().click();
      if (await this.playButton().isVisible()) {
        expect(this.playButton()).toBeVisible()
        await this.playButton().click();
      } else {
        await this.continueButton().click();
      }
      if (await this.abandonBtn().isVisible()) {
        await this.abandonBtn().click();
        await this.yesBtn().click();
      } else {
        await this.resignButton().click();
        await this.yesBtn().click();
      }

      // start from scratch again
      await this.page.goto(`${BASE_URL}/play`, {timeout: 3000});
      await this.createGameButton().click();
      await setupGameOptions();

      [response] = await Promise.all([
        this.page.waitForResponse(
          res => res.url().includes('/api/v2/games/create-custom'),
          { timeout: 6000 }
        ),
        this.playButton().click()
      ]);
      return this.page.url();
    }
    throw new Error(`Unexpected status: ${response.status()}`);
  }

  async checkGamePage(){
    await expect(this.page).toHaveURL(/\/game/);
  }

  async joinGame(gameURL: string){
    await this.page.goto(gameURL, {timeout: 5000})
  }

  async abandonGame(){
    await this.abandonBtn().click();
    await this.yesBtn().click();
  }

  async movePiece(piece: string, color: string, n: number, row: string, col: string){
    await this.page.waitForTimeout(3000);
    await this.page.locator('.ReactModal__Overlay').waitFor({ state: 'detached' });
    const locator = this.page.locator(`img[alt="${piece}-${color}-zh"]`).nth(n);
    await locator.click({force: true});
    const targetSquare = this.page.locator(`.square[class*="${row}-${col}"]`);
    await targetSquare.click({force: true});
  }

  async checkAbandonedGame(){
    await expect(this.gameEndModal()).toBeVisible();
    await expect(this.abadonModal()).toBeVisible();
  }

  async checkCheckmate(){
    await expect(this.gameEndModal()).toBeVisible();
    await expect(this.gameEndHeading()).toHaveText(/checkmate/i);
  }

  async resignGame(){
    await this.resignButton().click();
    await this.yesBtn().click();
  }

  async checkResignedGame(){
    await expect(this.gameEndModal()).toBeVisible();
    await expect(this.gameEndHeading()).toHaveText(/resigned/i);
  }

  async clickUndo(side: string){
    await this.undoButton().click();
    await expect(this.latestMessage().last()).toHaveText(`${side} requested an undo`);
  }

  async acceptRequest(side: string, request: string){
    await this.acceptButton().click({force: true});
    await expect(
    this.page.locator('.message-body', { hasText: `${side} accepted ${request} request` })
    ).toHaveCount(1);  
  }

  async checkUndoneMove(row: string, col: string){
    await expect(
    this.page.locator(`.square[class*="${row}-${col}"]`, { has: this.page.locator('.square-has-piece') }))
    .not.toBeVisible();
  }

  async rejectRequest(side: string, request: string){
    await this.rejectButton().click({force: true});
    await expect(this.latestMessage().last()).toHaveText(`${side} declined ${request} request`);
  }

  async checkNotUndoneMove(row: string, col: string){
    await expect(
    this.page.locator(`.square[class*="${row}-${col}"]`, { has: this.page.locator('.square-has-piece') }))
    .toBeVisible();
  }

  async disableRequest(side: string, request: string){
    await this.neverButton().click({force: true});
    await expect(this.latestMessage().last()).toHaveText(`${side} disabled ${request} request`);
  }

  async checkDisabledUndo(){
    await expect(this.undoButton()).toHaveClass(/disabled/);
  }

  async clickDraw(side: string){
    await this.drawButton().click();
    await expect(this.latestMessage().last()).toHaveText(`${side} requested a draw`);
  }

  async checkDrawnGame(){
    await expect(this.gameEndModal()).toBeVisible();
    await expect(this.gameEndHeading()).toHaveText(/draw/i);
  }

  async checkNotDrawnGame(){
     await expect(this.gameEndModal()).not.toBeVisible();
  }

  async checkDisabledDraw(){
    await expect(this.drawButton()).toHaveClass(/disabled/);
  }

  async letMoveTimerExpire(moveTime: string){
    const timeMs = parseInt(moveTime) * 60 * 1000; 
    await this.page.waitForTimeout(timeMs);
  }

  async checkTimerExpiredGame(){
    await expect(this.gameEndModal()).toBeVisible();
    await expect(this.gameEndHeading()).toHaveText(/timer expired/i);
  }

  async flipBoard(){
    await this.page.locator('.ReactModal__Overlay').waitFor({ state: 'detached' });
    await this.menuButton().click();
    await this.flipboardButton().click();
  }

  async checkFlippedBoard(side: 'red' | 'black') {
    await this.page.waitForTimeout(3000);
    const expectedPieceClass = side === 'red' ? 'red-piece' : 'black-piece';
    const rows = [10, 8, 7];
    let found = false;
    for (const r of rows) {
      const piece = this.page.locator(`div[r="${r}"] .${expectedPieceClass}`);
      if (await piece.count() > 0) {
        found = true;
        break;    
      }
    }
    expect(found).toBe(true);
  }
  
  async clickTime(side: string){
    await this.timeButton().click();
    const beforeText = (await this.timer().textContent())!.trim();
    await expect(this.latestMessage().last()).toHaveText(`${side} requested an extra minute`);
    return beforeText;
  }

  async checkExtraMinAdded(beforeTime: string){
    await this.page.waitForTimeout(3000); 
    const afterText = (await this.timer().textContent())!.trim();
    const beforeSeconds = toSeconds(beforeTime);
    const afterSeconds = toSeconds(afterText);

    const diff = afterSeconds - beforeSeconds;
    expect(diff).toBeGreaterThanOrEqual(55);
    expect(diff).toBeLessThanOrEqual(60);
  }

  async typeMessage(message: string){
    this.messageInput().fill(message);
  }

  async checkIfTyping(){
    expect(this.isTypingText()).toBeVisible();
  }

  async sendMessage(){
    await this.messageInput().press('Enter');
  }

  async checkReceivedMessage(message: string){
    await expect(this.latestMessage().last()).toHaveText(message);
  }

  async clickOnMention(mention: string){
    const match = mention.match(/@(\S+)/);
    if (!match) {
      throw new Error(`No @mention found in: "${mention}"`);
    }
    const username = match[0]; 
    const mentionLocator = this.page.getByText(new RegExp(`^${username}(\\s|$)`));
    await this.page.waitForTimeout(4000)
    await mentionLocator.click();
    await this.yesButton().click();
  }

  async checkNavigationToProfile(){
    await expect(this.page).toHaveURL(/\/@/);
  }


}

function toSeconds(timeStr: string) {
  const [mm, ss] = timeStr.split(':').map(Number);
  return mm * 60 + ss;
}

