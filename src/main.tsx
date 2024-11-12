import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import UploadPage from "./UploadComponent";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/upload",
		element: <UploadPage />,
	},
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
