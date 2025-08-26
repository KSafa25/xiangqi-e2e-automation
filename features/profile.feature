@profile
Feature: User Profile Functionality

  Scenario: As a signed-in user, I can view and edit my profile details
    Given a user is logged into the system as "e2euser"
    
    When the user navigates to their profile page
    Then the user's profile URL should contain "e2euser"
    And the user's profile header elements are visible
    And the country flag is visible
    And the core profile information (Joined, Last Online, Friends) is visible
    And the user taps on the Friends button and navigates to the Friends page
    And the user navigates back to the profile page
    
    When the user edits their profile details
    Then the user selects "Oman" as their country
    And the user adds or updates their bio with "this is the automation test account!"
    And the user saves the changes to their profile
    
    When the user updates the Recent Games visibility
    Then the user changes the Recent Games visibility to "Private"
    
    When the user navigates to Game History from the profile page
    Then the user can see more games on the Game History page
    And the user navigates back to the profile page

    Then the user resets all changes made to their profile
