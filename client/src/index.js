import React from "react";
import ReactDOM from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";

import { CookiesProvider } from "react-cookie";

import "./index.css";
import "./css/tailwind.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

export const client = new ApolloClient({
    uri: "http://127.0.0.1:4000/"
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
