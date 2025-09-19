import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';
import { link } from 'fs';

export class GameHistoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    //Locators 
    playButton = () => this.page.locator('a.nav-item').filter({ hasText: 'Play' });
    gameHistoryButton = () => this.page.getByText('Game History');
    backButton = () => this.page.locator('.back-button');
    loadMoreButton = () => this.page.getByRole('button', {name: 'Load More'});
    gamesTable = () => this.page.locator('.table-container');
    gameCards = () => this.page.locator('a.tr >> .player');
    gameReviewButton = () => this.page.getByRole('img', { name: 'analysis-icon' });
    computerGamesTab = () => this.page.getByRole('button', {name: 'Computer Games'});

    async goToPlayPage(){
        await this.page.goto(`${BASE_URL}/play`, { timeout: 60000});
    }

    async clickGameHistoryButton(){
        await this.playButton().hover();
        await this.gameHistoryButton().waitFor({ state: 'visible' });
        await this.gameHistoryButton().click();
    }

    async checkGameHistoryPage(){
        await expect(this.page).toHaveURL(/@[^/]+\/game-history/);
    }

    async clickBackButton(){
        await this.backButton().click();
    }

    async checkNavigationBack(previousPage: string){
        await expect(this.page).toHaveURL(`${BASE_URL}/${previousPage}`);
    }

    async clickAnyGameCard() {
        const response = await this.page.waitForResponse(response =>
        response.url().includes('api.xiangqi.com/api/users/games/') && response.request().method() === 'GET'
        );
        await expect(response.status()).toBe(200);
        if (await this.loadMoreButton().isVisible()) {
            await this.loadMoreButton().click();
        }
        const count = await this.gameCards().count();
        if (count > 0) {
            const randomIndex = Math.floor(Math.random() * count);
            const card = this.gameCards().nth(randomIndex);
            await card.click();
            await this.page.waitForTimeout(3000) 
        } else {
            throw new Error('No game links found');
            }
        }   

    async checkNavigationToGame(){
        await this.page.waitForURL(/\/game/);
        await expect(this.page).toHaveURL(/\/game/);
    }

    async clickAnyGameReviewButton(){
        await expect(this.gamesTable()).toBeVisible({timeout: 6000});
        if (await this.loadMoreButton().isVisible()) {
            await this.loadMoreButton().click();
        }
        const count = await this.gameReviewButton().count();
        if (count > 0) {
            const randomIndex = Math.floor(Math.random() * count);
            const card = this.gameReviewButton().nth(randomIndex);

            const href = await card.getAttribute('href');
            await card.click();
            await this.page.waitForTimeout(6000)
        } 
        else {
            throw new Error('No game links found');
            }   
    }

    async checkNavigationToGameReview(){
        await expect(this.page).toHaveURL(/\/review/);
    }

    async clickComputerGamesTab(){
        await this.computerGamesTab().click();
    }

    async checkNavigationToComputerGamesTab(){
        await expect(this.page).toHaveURL(/game-history\?tab=1$/);
        //see all computer games :)
        while (await this.loadMoreButton().isVisible().catch(() => false)) {
            await this.loadMoreButton().click();
            await this.page.waitForTimeout(500);
        }
    }





}