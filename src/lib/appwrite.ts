import { Client, Account, Databases, ID, Query, Functions, ExecutionMethod, } from 'appwrite';
import { patronCollection } from '../components/Utilities/constants';
export { ID } from 'appwrite';
export const client = new Client();
const databases = new Databases(client);
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APP_PROJECT_ID); // Replace with your pro\ject ID

export const account = new Account(client);
const databaseId = import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID;
export const getDocuments = async () => {
    return await databases.listDocuments(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_PATRON_COLLECTION_ID,
        [
            Query.orderDesc('$createdAt'), // Ajouté : Ordonne les documents par 'createddate' en ordre décroissant
            Query.limit(100), // Ajouté : Limite le nombre de documents retournés à 100
            Query.isNotNull('barcode'),
            Query.notEqual('barcode', "") // Ajouté : Filtre les documents pour ne retourner que ceux avec le statut "active"
        ]
    );
}
export const getSingleDocuments = async (documentId: string) => {
    return await databases.getDocument(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_PATRON_COLLECTION_ID,
        documentId
    );
}

export const getActivities = async (documentId: string) => {
    return await databases.listDocuments(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_ACTIVITY_COLLECTION_ID,
        [Query.equal('patrons', documentId),

        Query.orderDesc('$createdAt') // Ajouté : Ordonne les documents par 'createddate' en ordre décroissant

        ]
    );
}

export const login = (email: string, password: string) => {
    return account.createEmailPasswordSession(email, password);
}

export const logout = async () => {
    await account.deleteSession('current');
}
export const users = async () => {
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_USER_FUNCTION_ID, // functionId
        '', // body (optional)
        false, // async (optional)
        'users', // path (optional)
        ExecutionMethod.GET, // method (optional)
        {}, // headers (optional)
    );
    return result;
}
export const getUserId = async (body: string) => {
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_USER_FUNCTION_ID, // functionId
        body, // body (optional)
        false, // async (optional)
        'getUserIds', // path (optional)
        ExecutionMethod.GET, // method (optional)
        {}, // headers (optional)
    );
    return result;
}
export const createUser = async (body: string) => {
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_USER_FUNCTION_ID, // functionId
        body, // body (optional)
        false, // async (optional)
        'users', // path (optional)
        ExecutionMethod.POST, // method (optional)
        {}, // headers (optional)
    );
    return result;
}
export const getDocumentsGlobal = async (collectionId: string) => {
    return await databases.listDocuments(
        databaseId,
        collectionId,
        [
        ]
    );
}
export const getSingleDocumentsGlobal = async (documentId: string, collectionId: string) => {
    return await databases.getDocument(
        databaseId,
        collectionId,
        documentId
    );
}
export const createDocumentGlobal = async (collectionId: string, data: any) => {
    return await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        data
    );
}
export const editDocumentGlobal = async (collectionId: string, documentId: string, data: any) => {
    return await databases.updateDocument(
        databaseId,
        collectionId,
        documentId,
        data
    );
}
export const deleteDocumentGlobal = async (collectionId: string, documentId: string) => {
    return await databases.deleteDocument(
        databaseId,
        collectionId,
        documentId,
    );
}

const functions = new Functions(client);

export const deleteUser = async (data: any) => {
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_ACTIVITY_FUNCTION_ID, // functionId
        JSON.stringify(data), // body (optional)
        false, // async (optional)
        'patron', // path (optional)
        ExecutionMethod.DELETE, // method (optional)
        {}, // headers (optional)
    );
    await deleteDocumentGlobal(patronCollection, data.documentId);
    return result;
}

export const updateUser = async (data: any, documentId: string) => {
    const dataJ = { ...data, freeze: data.freeze ? 1 : null }
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_ACTIVITY_FUNCTION_ID, // functionId
        JSON.stringify(dataJ), // body (optional)
        false, // async (optional)
        'patron', // path (optional)
        ExecutionMethod.PUT, // method (optional)
        {}, // headers (optional)
    );
    await editDocumentGlobal(patronCollection, documentId, data);
    return result;
}

export const getDocumentsFreeze = async () => {
    return await databases.listDocuments(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_PATRON_COLLECTION_ID,
        [
            Query.equal('freeze', true)
        ]
    );
}
export const getUser = async () => {
    return await account.get()
}


export const addNewUser = async (data: any) => {
    const result = await functions.createExecution(
        import.meta.env.VITE_APP_ACTIVITY_FUNCTION_ID, // functionId
        data, // body (optional)
        false, // async (optional)
        'patron', // path (optional)
        ExecutionMethod.POST, // method (optional)
        {}, // headers (optional)
    );
    return result;
}

export const createNewUser = async (data: any) => {
    return databases.createDocument(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_PATRON_COLLECTION_ID,
        ID.unique(),
        data
    );
}

export const createActivitiesLogs = async (data: any) => {
    return databases.createDocument(
        import.meta.env.VITE_APP_ACTIVITY_DATABASE_ID,
        import.meta.env.VITE_APP_ACTIVITY_COLLECTION_ID,
        ID.unique(),
        data
    );
}

export const getDocumentsWithFilerGlobal = async (collectionId: string, filters: string[]) => {
    return await databases.listDocuments(
        databaseId,
        collectionId,
        filters
    );
}

