import Home from './pages/Home'
import Information from './pages/Information.vue'
import Commands from "@/pages/Commands";
import Contact from "@/pages/Contact";
import Status from "@/pages/Status";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/errors/NotFound";
import TokenLogin from "@/pages/logical/TokenLogin";
import Login from "@/pages/logical/Login";

export default [
    {
        title: "Accueil",
        path: "/",
        component: Home
    },
    {
        title: "Informations",
        path: "/infos",
        component: Information
    },
    {
        title: "Commandes",
        path: "/commands",
        component: Commands
    },
    {
        title: "Contact",
        path: "/contact",
        component: Contact
    },
    {
        title: "Status",
        path: "/status",
        component: Status
    },
    {
        title: "Dashboard",
        path: "/dashboard",
        hidden: true,
        component: Dashboard
    },
    {
        title: "Server Dashboard",
        path: "/dashboard/:id",
        component: Dashboard,
        hidden: true
    },
    {
        title: "Leaderboard",
        path: "/leaderboard/",
        component: Leaderboard,
        hidden: true
    },
    {
        title: "Server Leaderboard",
        path: "/leaderboard/:id",
        component: Leaderboard,
        hidden: true
    },
    {
        title: "*",
        path: "*",
        hidden: true,
        component: NotFound
    },
    {
        title: "login",
        path: "/login",
        hidden: true,
        component: Login
    },
    {
        title: "token-login",
        path: "/token-login",
        hidden: true,
        component: TokenLogin
    }
]
