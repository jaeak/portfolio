import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import Project from "./pages/Project"
import Beyond from "./pages/Beyond"
import NotFound from "./pages/NotFound"
import "./styles.css"
import "./components.css"

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/projects", element: <Projects /> },
            { path: "/projects/:slug", element: <Project /> },
            { path: "/beyond", element: <Beyond /> },
            { path: "*", element: <NotFound /> },
        ],
    },
])

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)
