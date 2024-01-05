describe("Create Account", () => {
  it("Should see email / password validation errors", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    cy.findByPlaceholderText(/email/i).type("non@good");
    cy.findByRole("alert").should("have.text", "Please enter a valid email");
    cy.findByPlaceholderText(/email/i).clear();
    cy.findByRole("alert").should("have.text", "Email is required");
    cy.findByPlaceholderText(/email/i).type("non@good.com");
    cy.findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    cy.findByRole("alert").should("have.text", "Password is required");
  });
  it("should be able to create account and login", () => {
    cy.intercept("http://localhost:3000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccount") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    cy.visit("/createAccount");
    cy.findByPlaceholderText(/email/i).type("jkhsky121@gmail.com");
    cy.findByPlaceholderText(/password/i).type("asdfasdf");
    cy.findByRole("button").click();
    cy.wait(1000);
    // @ts-ignore
    cy.login("jkhsky121@gmail.com", "asdfasdf");
  });
});
