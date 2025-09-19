# features/puzzle.feature

Feature: Puzzles
  As a player 
  I want to play puzzles

@puzzle
Scenario: A player can play a puzzle
    Given A logged in player navigates to puzzle page
    When Player clicks on Play Puzzle button 
    Then Puzzle is loaded 