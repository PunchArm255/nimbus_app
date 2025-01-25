import { ID } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account, databases } from "../appwrite";

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        try {
            const loggedIn = await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            setUser(userData);
            return userData;
        } catch (err) {
            throw err;
        }
    }

    async function logout() {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }

    async function register(email, password, name) {
        try {
            console.log("Creating user account...");
            // Set the user's name during registration
            await account.create(ID.unique(), email, password, name); // Add the name parameter
            const loggedIn = await login(email, password);

            console.log("Creating user document in database...");
            const documentData = {
                userID: loggedIn.$id, // Ensure this matches the attribute name in the collection
                name, // Only store the name
            };
            console.log("Document Data:", documentData);

            await databases.createDocument(
                "67953c900037179cefda", // Database ID
                "67953ca0003a82974731", // Collection ID
                ID.unique(),
                documentData
            );

            console.log("User registered and document created successfully!");
            return loggedIn;
        } catch (err) {
            console.error("Error during registration:", err);
            throw err;
        }
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            setUser(loggedIn);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <UserContext.Provider value={{ current: user, login, logout, register, loading }}>
            {!loading && props.children}
        </UserContext.Provider>
    );
}