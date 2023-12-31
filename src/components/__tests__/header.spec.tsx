import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: false,
                },
              },
            },
          },
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await waitFor(() => {
      screen.getByText("Please verify your email.");
    });
  });
  it("renders without verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("please verify your email.")).toBeNull();
    });
  });
});
