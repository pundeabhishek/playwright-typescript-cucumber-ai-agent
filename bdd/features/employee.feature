Feature: OrangeHRM employee creation
  As an HR administrator
  I want reusable BDD coverage for employee onboarding
  So that the team can validate the PIM add employee flow

  @bdd @employee
  Scenario: Admin user adds an employee
    Given the user opens the OrangeHRM login page
    When the user logs in with valid demo credentials
    And the user adds a new employee
    Then the employee profile should be saved
