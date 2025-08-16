// src/services/firebase.js
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export class FirebaseService {
  // Mengambil data special code dari Firebase
  static async getSpecialCodeData(code) {
    try {
      const docRef = doc(db, 'specialCodes', code.toLowerCase());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No such special code!');
        return null;
      }
    } catch (error) {
      console.error('Error getting special code:', error);
      return null;
    }
  }

  // Mengambil semua gambar untuk code tertentu
  static async getImagesForCode(code) {
    try {
      const imagesRef = collection(db, 'specialCodes', code.toLowerCase(), 'images');
      const querySnapshot = await getDocs(imagesRef);
      
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return images.sort((a, b) => a.order - b.order); // Sort by order field
    } catch (error) {
      console.error('Error getting images:', error);
      return [];
    }
  }

  // Mengambil semua special codes yang tersedia
  static async getAllSpecialCodes() {
    try {
      const codesRef = collection(db, 'specialCodes');
      const querySnapshot = await getDocs(codesRef);
      
      const codes = [];
      querySnapshot.forEach((doc) => {
        codes.push({
          code: doc.id,
          ...doc.data()
        });
      });
      
      return codes;
    } catch (error) {
      console.error('Error getting special codes:', error);
      return [];
    }
  }

  // Validasi special code
  static async validateSpecialCode(code) {
    const data = await this.getSpecialCodeData(code);
    return data !== null;
  }
}