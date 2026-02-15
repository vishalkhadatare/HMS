export const AuthRoute = ({ children }) => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
        return null; 
    }

    try {
        const user = JSON.parse(userStr);
        if (!user || !user.role) {
            return null; // Invalid user data, render nothing
        }
        return children; // Authenticated, render children
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null; // Error parsing user data, render nothing
    }
};
