# features/signin.feature
Feature: User Sign In
  As a user
  I want to sign in to my account
  So that I can access my profile and game history

  Scenario: Successful sign in with valid credentials
    Given I am on the sign in page
    When I enter my email and password
    And I click the sign in button
    Then I should be logged in and redirected to the lobby

Scenario: Unsuccessful sign in with invalid credentials, then successful retry
  Given I am on the sign in page
  When I enter my email and an incorrect password
  And I click the sign in button
  Then I should see an error message with title 'Error' and content 'Invalid password'
  Then I retry with correct password if invalid password toast appears
  Then I should be logged in and redirected to the lobby
