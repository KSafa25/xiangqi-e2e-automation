Feature: User Settings Management
  As a logged-in user
  I want to modify my settings
  So that I can personalize my application experience.

  @settings
  Scenario: User successfully updates and reverts all settings
    Given the user is on the lobby page
    When the user navigates to the settings page

 # Change language to Chinese
    And the user changes the language from "English" to "中文（简体）"
    And the user taps the save button with label "保存"
    Then the user sees the updated settings with text "保存"

    # Change language to Vietnamese
    And the user changes the language from "中文（简体）" to "Tiếng Việt"
    And the user taps the save button with label "保存"
    Then the user sees the updated settings with text "Lưu"

    # Change language back to English
    And the user changes the language from "Tiếng Việt" to "English"
    And the user taps the save button with label "Lưu"
    Then the user sees the updated settings with text "Save"

    # Change piece style
    And the user changes the piece style from "Traditional" to "English"

    # Toggle Dark Mode ON
    And the user enables Dark Mode

    # Privacy settings
    And the user changes Recent Games from "Public" to "Private"
    And the user changes "Who can challenge me" from "All Users" to "Friends Only"

    # Save
    And the user taps the save button with label "Save"
    Then the settings are successfully updated

    # Step 18-20: Change Board Style
    When the user navigates to the "Board & Pieces" settings page
    And the user changes the board style to "Simple"
    And the user saves the settings
    Then the board style is set to "Simple"

    # Step 21-23: Navigate through other settings pages
    When the user navigates to the "Account" settings page
    And the user navigates to the "Notifications" settings page
    And the user navigates to the "Subscription" settings page

    # Step 24-28: Revert General settings
    When the user navigates to the "General" settings page
    And the user disables Dark Mode
    And the user sets Recent Games to "Public"
    And the user sets "Who can challenge me" to "All Users"
    And the user saves the settings
    Then Dark Mode should be disabled
    And the Recent Games setting is "Public"

    # Step 29-32: Revert Board style
    When the user navigates to the "Board & Pieces" settings page
    And the user changes the board style to "Wooden"
    And the user saves the settings
    Then the board style is set to "Wooden"
    And the settings are successfully updated
