Feature: User Settings Management
  As a logged-in user
  I want to modify my settings
  So that I can personalize my application experience.

  @settings
  Scenario: User successfully updates and reverts all settings
    Given the user is on the lobby page
    When the user navigates to the settings page
    Then the user toggles on the dark theme
    And the user changes the recent games from public to private
    And the user changes who can challenge me to friends only
    #And the user changes the piece style from traditional to english
    And the user hits the save button
    Then the settings are updated accordingly
    When the user navigates to board and pieces settings
    And the user changes the board style from wooden to simple
    And the user hits the save button for board
    #Then a toast message should appear and the board settings are applied
    When the user navigates to the account settings
    #Then the account page appears
    When the user navigates to notifications settings
    #Then the notifications page appears
    When the user navigates to subscription settings
    #Then the subscription page appears
    When the user navigates to general settings
    Then the general page appears
    And the user toggles off the dark theme
    And the user changes the recent games from private to public
    And the user changes who can challenge me to any user
    And the user hits the save button
    Then the settings are saved successfully
    When the user changes the language to Tiếng Việt
    And the user hits the save button
    Then the language is set to Tiếng Việt
    When the user changes the language back to English
    And the user taps on Lưu to save changes
    Then the language is set back to English
