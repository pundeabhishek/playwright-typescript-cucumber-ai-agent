Feature: OrangeHRM login
  As a QA engineer
  I want business-readable login scenarios
  So that stakeholders can understand authentication coverage

  @smoke
  Scenario: Admin user logs in successfully
    Given the user opens the OrangeHRM login page
    When the user logs in with valid demo credentials
    Then the dashboard page should be displayed

  Scenario: Invalid password is rejected
    Given the user opens the OrangeHRM login page
    When the user logs in with invalid demo credentials
    Then a login error message should be displayed
