# features/gameplay.feature

Feature: Multiplayer game
  As playerA and PlayerB
  We want to sign in to our accounts simultaneously 
  SO that we can play multiplayer game

@gameplay
Scenario: A player can checkmate the other 
    Given Both players are logged in
    When Both join game
    And Both play game 
    And PlayerA checkmates PlayerB
    Then Checkmate modal should appear

@gameplay
Scenario: A game can be abandoned 
    Given Both players are logged in
    When Both join game
    And PlayerB abandons the game
    Then Abandon modal should appear

@gameplay
Scenario: A player can resign the game 
    Given Both players are logged in 
    When Both join game 
    And Both play game
    And PlayerA resigns the game 
    Then Resign modal should appear

@gameplay
Scenario: A player can accept an undo request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes an undo request
    And PlayerA accepts the undo request
    Then Last move must be undone

Scenario: A player can reject an undo request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes an undo request
    And PlayerA rejects the undo request
    Then Last move must not be undone

Scenario: A player can disable an undo request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes an undo request
    And PlayerA disables the undo request
    Then Undo button should be disabled

Scenario: A player can accept a draw request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes a draw request
    And PlayerA accepts the draw request
    Then Game should be drawn

Scenario: A player can reject a draw request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes a draw request
    And PlayerA rejects the draw request
    Then Game should not be drawn

Scenario: A player can disable a draw request
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerB makes a draw request
    And PlayerA disables the draw request
    Then Draw button should be disabled

Scenario: Game ends if move timer of a player expires
    Given Both players are logged in 
    When Both join game
    And Both play game
    And PlayerAs move timer expires
    Then Game should end with timer expired

Scenario: Board can be flipped 
    Given Both players are logged in
    When Both join game
    And PlayerA flips the board
    Then Board should be flipped for playerA

Scenario: Extra time can be added to move timer
    Given Both players are logged in
    When Both join game
    And Both play game
    And PlayerA requests for an extra min
    And PlayerB accepts the request
    Then Extra min should be added to the timers

Scenario: Game chat supports sending messages and mentions
    Given Both players are logged in
    And Both join game
    And Both play game

    When PlayerA types a message
    Then PlayerB sees that PlayerA is typing

    When PlayerA sends the message
    Then PlayerB sees the message in game chat

    When PlayerB mentions PlayerA
    Then PlayerA sees their mention in game chat

    When PlayerB clicks on the mention
    Then PlayerB is navigated to PlayerA's profile



