// authService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./Firebase.config";

// تسجيل مستخدم جديد
async function signUp(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // حفظ بيانات إضافية في Firestore
    await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date()
    });

    return user;
}

// تسجيل الدخول
async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}
export { signUp, signIn }