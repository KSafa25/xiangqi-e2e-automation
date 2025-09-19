import { Page, expect } from '@playwright/test';
import { BASE_URL } from '../config/globals';
import { Socket } from 'dgram';
 import { spawn } from 'child_process';

export class PuzzlePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Locators
  playPuzzleButton = () => this.page.getByText('Play Puzzle');
  currentFen = ""; 

  async navigateToPuzzlePage(){
    await this.page.goto(`${BASE_URL}/puzzle`, { waitUntil: 'load' })
  }

  async clickPlayPuzzleButton(){
    await this.playPuzzleButton().click();
  }

  async checkPuzzlePage(){
    await expect(this.page).toHaveURL(/\/puzzle\//);
    await this.page.waitForTimeout(5000);
    
  }

  async displaySocket() {
  this.page.on('websocket', ws => {
    if (!ws.url().includes('socket.io')) return;

    ws.on('framesent', frame => {
      const payload = frame.payload;

      if (typeof payload === 'string' && payload.includes('"puzzle.move"')) {
        try {
          // Remove "42/xiangqi," part
          const jsonPart = payload.slice(payload.indexOf(',') + 1);
          const [eventName, data] = JSON.parse(jsonPart);

          if (eventName === 'puzzle.move') {
            console.log('📤 Sent puzzle.move:');
            console.log('  FEN:', data.fen);
            this.currentFen = data.fen;
            console.log('  Moves:', data.moves);
          }
        } catch (err) {
          console.error('Failed to parse puzzle.move frame:', err);
        }
      }
    });
  });
}

    async getCurrentFen(){
        return this.currentFen;
    }

   

async getBestMove(fen: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const engine = spawn('./pikafish'); // path to pikafish binary

    engine.stdin.write('uci\n');  // init
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write('go depth 12\n'); // search depth

    engine.stdout.on('data', (data) => {
      const text = data.toString();
      // Pikafish prints lines like: "bestmove d1f1"
      if (text.includes('bestmove')) {
        const match = text.match(/bestmove (\S+)/);
        if (match) resolve(match[1]);
        engine.stdin.write('quit\n');
      }
    });

    engine.on('error', reject);
  });
}


 
}