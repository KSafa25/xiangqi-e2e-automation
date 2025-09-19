import { Given, When, Then, Before } from '@cucumber/cucumber';
import { ICustomWorld } from '../hooks/hooks';

Given('I visit lobby as a signed in user', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.goToPlayPage();
});

When('I click on game history tab', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.clickGameHistoryButton();
});

Then('I should be redirected to game history page', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkGameHistoryPage();
});

When('I click on back button', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.clickBackButton();
});

Then('I am returned to lobby', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkNavigationBack('play');
});

When('I click on any game card', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkGameHistoryPage();
    await gameHistoryPage.clickAnyGameCard();
});

Then('I should be navigated to game page', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkNavigationToGame();
});

When('I click on any game card review button', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkGameHistoryPage();
    await gameHistoryPage.clickAnyGameReviewButton();
});

Then('I should be navigated to game review page', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkNavigationToGameReview();
});

When('I click on Computer games tab', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkGameHistoryPage();
    await gameHistoryPage.clickComputerGamesTab();
});

Then('I should be able to see all archived computer games', async function (this: ICustomWorld) {
    const { gameHistoryPage } = this.pages;
    await gameHistoryPage.checkNavigationToComputerGamesTab();
});
