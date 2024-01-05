describe("Edit Profile", () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login("jkhsky121@gmail.com", "asdfasdf");
  });
  it("can go to /edit-profile using the header", () => {
    cy.get("a[href='/edit-profile']").click();
    cy.wait(2000);
    cy.title().should("eq", "Edit Profile | Uber Eats");
  });
  it("can change email", () => {
    cy.intercept("POST", "http://localhost:3000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "jkhsky121@gmail.com";
      }
    });
    cy.visit("/edit-profile");
    cy.findByPlaceholderText(/email/i).clear().type("new@gmail.com");
    cy.findByRole("button").click();
  });
});
