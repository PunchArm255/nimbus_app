import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67952c5f003614298a57"); // my project ID

export const account = new Account(client);
export const databases = new Databases(client);
