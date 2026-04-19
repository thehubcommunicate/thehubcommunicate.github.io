import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, increment, deleteDoc, where, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'Huber',
        hubCoins: 100, // Welcome gift
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    } else {
      await setDoc(userDocRef, {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      const msg = "Sign-in popup bị chặn! Vui lòng nhấn vào biểu tượng 'Mở trong tab mới' (góc trên bên phải) để đăng nhập, hoặc cho phép popup từ trình duyệt.";
      console.warn(msg);
      throw new Error(msg);
    } else if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      const msg = `Tên miền '${currentDomain}' chưa được cấp phép trong Firebase Console. \n\nCÁCH FIX: \n1. Truy cập Firebase Console -> Authentication -> Settings -> Authorized Domains. \n2. Thêm domain '${currentDomain}' vào danh sách.`;
      console.error(msg);
      throw new Error(msg);
    } else {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Social Feed
export interface PostMedia {
  url: string;
  type: 'image' | 'video';
}

export const createPost = async (author: User, content: string, media?: PostMedia) => {
  const postsRef = collection(db, 'posts');
  return addDoc(postsRef, {
    authorId: author.uid,
    authorName: author.displayName,
    authorPhoto: author.photoURL,
    content,
    mediaUrl: media?.url || null,
    mediaType: media?.type || null,
    likes: 0,
    commentCount: 0,
    createdAt: serverTimestamp()
  });
};

export const deletePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  return deleteDoc(postRef);
};

export const subscribeToFeed = (callback: (posts: any[]) => void) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};

export const likePost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  return updateDoc(postRef, {
    likes: increment(1)
  });
};

// Comments
export const addComment = async (postId: string, author: User, content: string) => {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const postRef = doc(db, 'posts', postId);
  
  await addDoc(commentsRef, {
    postId,
    authorId: author.uid,
    authorName: author.displayName,
    authorPhoto: author.photoURL,
    content,
    createdAt: serverTimestamp()
  });

  return updateDoc(postRef, {
    commentCount: increment(1)
  });
};

export const subscribeToComments = (postId: string, callback: (comments: any[]) => void) => {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
};

// Bookings
export const createBooking = async (userId: string, bookingData: any) => {
  const bookingsRef = collection(db, 'bookings');
  const qrPass = `HUB-PASS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  return addDoc(bookingsRef, {
    userId,
    status: 'pending',
    paymentStatus: 'unpaid',
    ...bookingData,
    qrPass,
    createdAt: serverTimestamp()
  });
};

export const subscribeToPublicBookings = (callback: (bookings: any[]) => void) => {
  const q = query(collection(db, 'bookings'), where('privacy', '==', 'public'), orderBy('createdAt', 'desc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

// Service Orders
export const placeServiceOrder = async (userId: string, orderData: any) => {
  const ordersRef = collection(db, 'serviceOrders');
  return addDoc(ordersRef, {
    userId,
    status: 'pending',
    ...orderData,
    createdAt: serverTimestamp()
  });
};

// Events
export const subscribeToEvents = (callback: (events: any[]) => void) => {
  const q = query(collection(db, 'events'), orderBy('date', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const interactWithEvent = async (eventId: string, userId: string, type: 'interested' | 'join') => {
  const eventRef = doc(db, 'events', eventId);
  const field = type === 'interested' ? 'interestedCount' : 'attendeeCount';
  return updateDoc(eventRef, {
    [field]: increment(1)
  });
};

// Blog
export const subscribeToBlogPosts = (callback: (posts: any[]) => void) => {
  const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const createBlogPost = async (userId: string, userName: string, postData: any) => {
  const blogRef = collection(db, 'blogPosts');
  const userRef = doc(db, 'users', userId);
  
  await addDoc(blogRef, {
    ...postData,
    authorId: userId,
    authorName: userName,
    createdAt: serverTimestamp()
  });

  // Reward Hub-Coin for UGC
  return updateDoc(userRef, {
    hubCoins: increment(50)
  });
};
