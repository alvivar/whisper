import React from "react";
import ReactDOM from "react-dom";

import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo-hooks";

// Required stuff for subscriptions
import { split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

import { CookiesProvider } from "react-cookie";

import "./index.css";
import "./css/tailwind.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// @todo Environment variables
// const prismaEndpoint = "127.0.0.1:4000"; // Local Prisma on development
const prismaEndpoint = "165.22.45.96/prsm/"; // DigitalOcean on production

const httpLink = new HttpLink({
    uri: `http://${prismaEndpoint}`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://${prismaEndpoint}`,
    options: {
        reconnect: true,
        connectionParams: {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJkZWZhdWx0QGRlZmF1bHQiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTY2MDg5OTA0LCJleHAiOjE1NjY2OTQ3MDR9.vpxYCIUzIstl0bLB4dOtgmRd2jSvjRi6v1buKWIqFnQ"
            }
        }
    }
});

const authLink = setContext((_, { headers }) => {
    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJkZWZhdWx0QGRlZmF1bHQiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTY2MDg5OTA0LCJleHAiOjE1NjY2OTQ3MDR9.vpxYCIUzIstl0bLB4dOtgmRd2jSvjRi6v1buKWIqFnQ"
        }
    };
});

const link = split(
    // Split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
    uri: `http://${prismaEndpoint}`
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </ApolloProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
