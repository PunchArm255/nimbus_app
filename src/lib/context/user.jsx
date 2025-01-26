import { ID, Query } from "appwrite";
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
            await account.create(ID.unique(), email, password, name);
            const loggedIn = await login(email, password);

            console.log("Creating user document in database...");
            const documentData = {
                userID: loggedIn.$id,
                name,
            };
            console.log("Document Data:", documentData);

            await databases.createDocument(
                "67953c900037179cefda", // Database ID
                "67953ca0003a82974731", // Users Collection ID
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

    async function fetchStats(userID) {
        try {
            const response = await databases.listDocuments(
                "67953c900037179cefda", // Database ID
                "679563a200150960e723", // Stats Collection ID
                [Query.equal("userID", userID)] // Filter by userID
            );

            if (response.documents.length > 0) {
                return response.documents[0].stats;
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
            return null;
        }
    }

    async function updateStats(userID, stats) {
        try {
            const response = await databases.listDocuments(
                "67953c900037179cefda", // Database ID
                "679563a200150960e723", // Stats Collection ID
                [Query.equal("userID", userID)] // Filter by userID
            );

            if (response.documents.length > 0) {
                await databases.updateDocument(
                    "67953c900037179cefda", // Database ID
                    "679563a200150960e723", // Stats Collection ID
                    response.documents[0].$id, // Document ID
                    { stats: JSON.stringify(stats) }
                );
            } else {
                await databases.createDocument(
                    "67953c900037179cefda", // Database ID
                    "679563a200150960e723", // Stats Collection ID
                    ID.unique(),
                    { userID, stats: JSON.stringify(stats) }
                );
            }
        } catch (err) {
            console.error("Error updating stats:", err);
        }
    }

    async function fetchFriends(userID) {
        try {
            const response = await databases.listDocuments(
                "67953c900037179cefda", // Database ID
                "67957eb8003cd2256122", // Friends Collection ID
                [Query.equal("userID", userID)] // Filter by userID
            );

            if (response.documents.length > 0) {
                return response.documents[0].friends || [];
            } else {
                return [];
            }
        } catch (err) {
            console.error("Error fetching friends:", err);
            return [];
        }
    }

    async function updateFriends(userID, friends) {
        try {
            const response = await databases.listDocuments(
                "67953c900037179cefda", // Database ID
                "67957eb8003cd2256122", // Friends Collection ID
                [Query.equal("userID", userID)] // Filter by userID
            );

            if (response.documents.length > 0) {
                await databases.updateDocument(
                    "67953c900037179cefda", // Database ID
                    "67957eb8003cd2256122", // Friends Collection ID
                    response.documents[0].$id, // Document ID
                    { friends }
                );
            } else {
                await databases.createDocument(
                    "67953c900037179cefda", // Database ID
                    "67957eb8003cd2256122", // Friends Collection ID
                    ID.unique(),
                    { userID, friends }
                );
            }
        } catch (err) {
            console.error("Error updating friends:", err);
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
        <UserContext.Provider
            value={{
                current: user,
                login,
                logout,
                register,
                fetchStats,
                updateStats,
                fetchFriends,
                updateFriends,
                loading,
                databases,
            }}
        >
            {!loading && props.children}
        </UserContext.Provider>
    );
}