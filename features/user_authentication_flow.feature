# Feature: User Registration and Authentication
# This feature describes the full end-to-end process of a new user signing up,
# signing out, and then signing back in to verify the account.

Feature: Full User Authentication Flow

  @e2e-flow
  Scenario: Successfully register, sign out, and sign back in
    Given the user navigates to the Xiangqi website
    When the user creates a new account using a temporary email
    And the user signs out from the new account
    Then the user should be able to sign back in with the new credentials
    And the user should see the main game page
