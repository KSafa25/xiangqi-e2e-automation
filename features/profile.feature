Feature: User Profile Management
  As a signed-in user, I want to manage my profile
  So that I can view and edit my information and game statistics

  Scenario: Verify and edit user profile
    Given I am signed into the system
    When I navigate to the user profile page
    And I edit my profile information
    And I verify my game statistics
    And I verify the recent games section
    Then I should be able to navigate back to the profile page