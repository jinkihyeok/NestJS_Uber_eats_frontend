import React from "react";
import { LOGIN_MUTATION, Login } from "../login";
import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test-utils";

describe("<Login />", () => {
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <Login />
      </ApolloProvider>
    );
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Uber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    userEvent.type(email, "this@wont");

    const errorMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    });

    userEvent.clear(email);

    await waitFor(async () => {
      const emailRequiredError = await screen.findByRole("alert");
      expect(emailRequiredError).toHaveTextContent(/email is required/i);
    });
  });

  it("display password required errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const submitBtn = await screen.findByRole("button");

    userEvent.type(email, "this@wont.com");
    userEvent.click(submitBtn);

    const errorMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });

  it("submits form and calls mutation", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = await screen.findByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "xxx",
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = await screen.findByRole("alert");
    await waitFor(() => {
      expect(errorMessage).toHaveTextContent(/mutation-error/i);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith("uber-token", "xxx");
  });
});
