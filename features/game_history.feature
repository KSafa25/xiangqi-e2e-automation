# features/game_history.feature
Feature: User Game History
  As a user
  I want to sign in to my account
  So that I can access my game history

Scenario: A user can visit game history page
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page

Scenario: A user can go back from game history page
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on back button 
    Then I am returned to lobby 

@gameHistory
Scenario: A user can open any game from game history page
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on any game card
    Then I should be navigated to game page

Scenario: A user can review any game from game history page
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on any game card review button
    Then I should be navigated to game review page

Scenario: A user can view all archived computer games on game history page
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on Computer games tab
    Then I should be able to see all archived computer games 

@gameHistory
Scenario: A user can view any archived computer game
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on Computer games tab
    When I click on any game card
    Then I should be navigated to game page

Scenario: A user can review any archived computer game
    Given I visit lobby as a signed in user
    When I click on game history tab
    Then I should be redirected to game history page
    When I click on Computer games tab
    When I click on any game card review button
    Then I should be navigated to game review page
