import { User } from "../../../src/models";
import LoginPage from "../../pages/LoginPage";

describe("Custom Flow Test", function () {
  let loginPage: LoginPage;

  beforeEach(function () {
    cy.task("db:seed");
    loginPage = new LoginPage();
  });

  it("should login using Page Object", function () {
    cy.database("find", "users").then((user: User) => {
      loginPage.visit();
      loginPage.login(user.username, "s3cret");
      cy.location("pathname").should("equal", "/");
    });
  });

  it("should show error for invalid login", function () {
    loginPage.visit();
    loginPage.login("invalid", "invalid");
    loginPage.getErrorMessage().should("be.visible").and("contain", "Username or password is invalid");
  });
});