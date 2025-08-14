import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID
};
// 
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app);
// 
// Add Data
const addPatient = async (patient) => {
    try {
        await setDoc(doc(db, "patients", patient.id), patient);
        console.log("✅ تمت الإضافة:", patient);
    } catch (error) {
        console.error("❌ خطأ في الإضافة:", error);
    }
};

// Read Data
const getPatients = async () => {
    const querySnapshot = await getDocs(collection(db, "patients"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Edit Data
const updatePatient = async (id, newData) => {
    const docRef = doc(db, "patients", id);
    await updateDoc(docRef, newData);
};

// Delete Data
const deletePatient = async (id) => {
    await deleteDoc(doc(db, "patients", id));
};

export { addPatient, getPatients, updatePatient, deletePatient, db, auth }