import React from "react";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { render, screen, waitFor } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../gql/graphql";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    mockedClient = createMockClient();
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Uber Eats")
    );
  });
  it("renders validation errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const button = await screen.findByRole("button");
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

    userEvent.type(email, "working@email.com");
    userEvent.click(button);

    await waitFor(async () => {
      const passwordRequiredError = await screen.findByRole("alert");
      expect(passwordRequiredError).toHaveTextContent(/password is required/i);
    });
  });
  it("submits mutation with form values", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = await screen.findByRole("button");
    const formData = {
      email: "working@email.com",
      password: "12",
      role: UserRole.Client,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(button);
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");

    const mutationError = await screen.findByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mutationError).toHaveTextContent("mutation-error");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
