import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.bonds.aora",
  projectId: "6670fe97002f38c14b06",
  databaseId: "66726c400003fc84939f",
  userCollectionId: "66726ca4000f9d6ed357",
  videoCollectionId: "66726ce6003d95a24d82",
  storageId: "66713197000e408dfa76",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.
//To inialize a Appwrite functiosn
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

//create user function form app write newaccount creation
export const createUser = async (email, password, username) => {
  // Ensure there's no active session before creating a new account
  try {
    const currentSession = await account.getSession("current");
    if (currentSession) {
      await account.deleteSession("current");
    }
  } catch (error) {
    // console.log("No active session found, proceeding to create user.");
  }
  try {
    const newAccount = await account.create(
      //account creation
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username); //to get avatar

    await signIn(email, password); //sign in process

    const newUser = await databases.createDocument(
      //new user creation
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    // Attempt to get the current session
    try {
      const currentSession = await account.getSession("current");
      if (currentSession) {
        // If a session is active, log out first
        await account.deleteSession("current");
      }
    } catch (error) {
      // If there's no active session, continue to sign in
      // console.log("No active session found, proceeding to sign in.");
    }
    const session = await account.createEmailPasswordSession(email, password); //session creeation with singin function
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

//to get a accout form resign from a user
export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
};
//to get current user ti sign in from auser
export const getCurrentUser = async () => {
  const currentAccount = await getAccount();
  if (!currentAccount) throw Error;

  try {
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId[Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};
// to displaty a all post in homepage
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

//pt get latest posts form creared at time and display the home page
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId[Query.orderDesc("$createdAt", Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
//search the post by the title
export const searchPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId[Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
//get individul user posts with unique user id
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId[Query.equal("creator", userId)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
//to signout from a user
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFilePreview(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFileView(storageId, fileId, 2000, 2000, "top", 100);
    } else {
      throw new Error("Invalid File Format");
    }
    if (!fileUrl) throw new Error(error);
  } catch (error) {
    throw new Error(error);
  }
};

//upload a fike from a appwrite storage

export const uploadFile = async (file, type) => {
  if (!file) return;
  const [mimeType, ...rest] = file; //to reconstrct a file

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: 0,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};
//to create a video
export const crateVideo = async (form) => {
  try {
    const [thumnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumnail: thumnailUrl,
        prompt: form.prompt,
        video: videoUrl,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
