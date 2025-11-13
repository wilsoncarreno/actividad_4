class LoginPage {
  visit() {
    cy.visit('/signin');
  }

  enterUsername(username: string) {
    cy.getBySel("signin-username").type(username);
  }

  enterPassword(password: string) {
    cy.getBySel("signin-password").type(password);
  }

  submit() {
    cy.getBySel("signin-submit").click();
  }

  login(username: string, password: string) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.submit();
  }

  getErrorMessage() {
    return cy.getBySel("signin-error");
  }
}

export default LoginPage;